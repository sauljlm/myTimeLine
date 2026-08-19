"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ViewState {
  x: number;
  y: number;
  scale: number;
}

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// Bajado de 0.1 a 0.05: el eje de tiempo ahora reserva mucho más ancho a
// la historia registrada (ver `timeScale.ts`), así que el canvas completo
// es más ancho que antes — sin este margen extra, "Reset" no alcanzaba a
// encuadrar todo el contenido y el botón de zoom mínimo se quedaba corto.
// Bajado de 0.05 a 0.01: con todo el contenido acumulado, los carriles de
// América y las tarjetas a 500px, el canvas mide ~122 000px
// de ancho, y a 0.05 el botón "Reset" ya no alcanzaba a mostrarlo
// entero en pantalla (justo lo que ese botón existe para hacer). A este
// zoom las tarjetas son ilegibles a propósito: la vista sirve para ver la
// forma del conjunto y decidir a dónde acercarse.
const MIN_SCALE = 0.01;
const MAX_SCALE = 4;
const SCALE_STATE_DEBOUNCE_MS = 60;
const ZOOM_STEP = 1.2;

function clampScale(scale: number): number {
  return Math.min(MAX_SCALE, Math.max(MIN_SCALE, scale));
}

/**
 * Motor de pan/zoom estilo Figma/Miro para un contenedor DOM.
 *
 * El transform (translate + scale) se aplica directamente al DOM vía ref
 * en cada evento, sin pasar por el estado de React, para que el arrastre y
 * el zoom se sientan fluidos a 60fps. `scale` en el estado de React se
 * actualiza con un pequeño debounce — solo para que la UI (regla de
 * tiempo, indicador de zoom) pueda reaccionar sin re-renderizar en cada
 * pixel de movimiento.
 */
export function useCanvasPanZoom() {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  // La pista de la regla de tiempo (solo se traslada/escala en X, ya que
  // verticalmente queda fija con `position: sticky`).
  const rulerTrackRef = useRef<HTMLDivElement | null>(null);
  const view = useRef<ViewState>({ x: 0, y: 0, scale: 1 });

  const [scale, setScale] = useState(1);
  const scaleDebounceTimer = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  const dragState = useRef<{
    dragging: boolean;
    startClientX: number;
    startClientY: number;
    startX: number;
    startY: number;
  }>({ dragging: false, startClientX: 0, startClientY: 0, startX: 0, startY: 0 });

  // Puntero(s) activos actualmente sobre el viewport. Con dos dedos en
  // pantalla, cada uno dispara sus propios eventos de pointer además de
  // los touchstart/touchmove que maneja el pellizco (pinch) — sin este
  // control, el arrastre (pensado para un solo puntero) pelea con el
  // pellizco por el mismo gesto de dos dedos.
  const activePointers = useRef<Set<number>>(new Set());

  const pinchState = useRef<{
    active: boolean;
    startDistance: number;
    startScale: number;
    centerClientX: number;
    centerClientY: number;
  }>({ active: false, startDistance: 0, startScale: 1, centerClientX: 0, centerClientY: 0 });

  const applyTransform = useCallback(() => {
    const el = canvasRef.current;
    const { x, y, scale: s } = view.current;
    if (el) {
      el.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
      el.style.transformOrigin = "0 0";
    }
    const ruler = rulerTrackRef.current;
    if (ruler) {
      // Misma X que el canvas, pero `scaleX` (NO `scale` parejo) y sin
      // componente Y: la regla siempre queda alineada horizontalmente con
      // el contenido de abajo, sin importar cuánto se haga pan vertical, y
      // su alto de 40px nunca se toca. Con `scale()` uniforme antes, a
      // niveles de zoom bajos el contenedor entero se achicaba también en
      // vertical desde su esquina superior-izquierda (`transformOrigin`),
      // empujando el texto casi al borde de arriba en vez de mantenerlo
      // centrado — el contra-escalado de la marca (ver abajo) corregía el
      // TAMAÑO del texto pero no ese corrimiento vertical. Con `scaleX`, el
      // eje Y nunca se transforma, así que el centrado con flexbox de cada
      // marca (`TimeRuler.tsx`) queda estable en cualquier nivel de zoom.
      ruler.style.transform = `translateX(${x}px) scaleX(${s})`;
      ruler.style.transformOrigin = "0 0";
      // Contra-escala del TEXTO de cada marca, como variable CSS: se
      // actualiza acá mismo, en cada frame, en vez de depender del estado
      // `scale` de React (que está debounced ~60ms, ver `scheduleScaleStateUpdate`
      // más abajo). Si el contra-escalado dependiera de ese estado, durante
      // el gesto de zoom en sí (antes de que el debounce se dispare) el
      // texto de la regla quedaba sin contrarrestar y se veía crecer/encoger
      // junto con el resto del canvas — exactamente el bug reportado. Las
      // marcas leen esta variable vía `var(--inverse-scale)`, así que se
      // actualizan en el mismo frame que la posición, sin re-render de React.
      ruler.style.setProperty("--inverse-scale", String(1 / s));
    }
  }, []);

  const scheduleScaleStateUpdate = useCallback(() => {
    if (scaleDebounceTimer.current) clearTimeout(scaleDebounceTimer.current);
    scaleDebounceTimer.current = setTimeout(() => {
      setScale(view.current.scale);
    }, SCALE_STATE_DEBOUNCE_MS);
  }, []);

  const panBy = useCallback(
    (dx: number, dy: number) => {
      view.current.x += dx;
      view.current.y += dy;
      applyTransform();
    },
    [applyTransform],
  );

  /** Hace zoom centrado en un punto de la pantalla (coordenadas de viewport, no del mundo). */
  const zoomAt = useCallback(
    (clientX: number, clientY: number, factor: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      const px = clientX - rect.left;
      const py = clientY - rect.top;

      const prevScale = view.current.scale;
      const nextScale = clampScale(prevScale * factor);
      if (nextScale === prevScale) return;

      // Punto del "mundo" (contenido sin transformar) que está bajo el cursor.
      const worldX = (px - view.current.x) / prevScale;
      const worldY = (py - view.current.y) / prevScale;

      view.current.scale = nextScale;
      // Reacomoda x/y para que ese mismo punto del mundo siga bajo el cursor.
      view.current.x = px - worldX * nextScale;
      view.current.y = py - worldY * nextScale;

      applyTransform();
      scheduleScaleStateUpdate();
    },
    [applyTransform, scheduleScaleStateUpdate],
  );

  const zoomAtCenter = useCallback(
    (factor: number) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();
      zoomAt(rect.left + rect.width / 2, rect.top + rect.height / 2, factor);
    },
    [zoomAt],
  );

  const resetView = useCallback(
    (bounds?: BoundingBox, padding = 80) => {
      const viewport = viewportRef.current;
      if (!viewport) return;
      const rect = viewport.getBoundingClientRect();

      if (!bounds) {
        view.current = { x: rect.width / 2, y: rect.height / 2, scale: 1 };
        applyTransform();
        scheduleScaleStateUpdate();
        return;
      }

      const contentWidth = Math.max(1, bounds.maxX - bounds.minX);
      const contentHeight = Math.max(1, bounds.maxY - bounds.minY);
      const scaleX = (rect.width - padding * 2) / contentWidth;
      const scaleY = (rect.height - padding * 2) / contentHeight;
      const nextScale = clampScale(Math.min(scaleX, scaleY));

      const contentCenterX = (bounds.minX + bounds.maxX) / 2;
      const contentCenterY = (bounds.minY + bounds.maxY) / 2;

      view.current = {
        scale: nextScale,
        x: rect.width / 2 - contentCenterX * nextScale,
        y: rect.height / 2 - contentCenterY * nextScale,
      };
      applyTransform();
      scheduleScaleStateUpdate();
    },
    [applyTransform, scheduleScaleStateUpdate],
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        // Zoom centrado en el cursor (rueda + Ctrl/Cmd, o pellizco en trackpad).
        const factor = Math.pow(2, -e.deltaY * 0.01);
        zoomAt(e.clientX, e.clientY, factor);
      } else {
        // Pan normal con la rueda, como en Figma.
        panBy(-e.deltaX, -e.deltaY);
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;
      // No iniciar arrastre si el click empieza sobre un elemento
      // interactivo (botón, link, etc.) dentro de una tarjeta. Si no se
      // corta acá, `setPointerCapture` más abajo redirige TODOS los
      // eventos de puntero siguientes al viewport completo — el pointerup
      // ya no le llega al botón bajo el cursor y el navegador no llega a
      // sintetizar el "click" sobre él. Por eso "Ver más" (y en general
      // cualquier botón/link dentro del canvas) no respondía al click.
      if (
        e.target instanceof HTMLElement &&
        e.target.closest("button, a, input, textarea, select")
      ) {
        return;
      }
      activePointers.current.add(e.pointerId);
      // Si ya hay otro puntero activo (segundo dedo), esto es el inicio de
      // un pellizco, no de un arrastre: no empieces (ni sigas) el pan.
      if (activePointers.current.size > 1) {
        dragState.current.dragging = false;
        return;
      }
      dragState.current = {
        dragging: true,
        startClientX: e.clientX,
        startClientY: e.clientY,
        startX: view.current.x,
        startY: view.current.y,
      };
      viewportRef.current?.setPointerCapture(e.pointerId);
      if (viewportRef.current) viewportRef.current.style.cursor = "grabbing";
    }

    function onPointerMove(e: PointerEvent) {
      if (!dragState.current.dragging) return;
      if (activePointers.current.size > 1) return;
      const dx = e.clientX - dragState.current.startClientX;
      const dy = e.clientY - dragState.current.startClientY;
      view.current.x = dragState.current.startX + dx;
      view.current.y = dragState.current.startY + dy;
      applyTransform();
    }

    function onPointerUp(e: PointerEvent) {
      activePointers.current.delete(e.pointerId);
      if (!dragState.current.dragging) return;
      dragState.current.dragging = false;
      viewportRef.current?.releasePointerCapture(e.pointerId);
      if (viewportRef.current) viewportRef.current.style.cursor = "grab";
    }

    function touchDistance(t0: Touch, t1: Touch) {
      return Math.hypot(t0.clientX - t1.clientX, t0.clientY - t1.clientY);
    }

    function onTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        const [t0, t1] = [e.touches[0], e.touches[1]];
        pinchState.current = {
          active: true,
          startDistance: touchDistance(t0, t1),
          startScale: view.current.scale,
          centerClientX: (t0.clientX + t1.clientX) / 2,
          centerClientY: (t0.clientY + t1.clientY) / 2,
        };
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches.length === 2 && pinchState.current.active) {
        e.preventDefault();
        const [t0, t1] = [e.touches[0], e.touches[1]];
        const distance = touchDistance(t0, t1);
        const centerX = (t0.clientX + t1.clientX) / 2;
        const centerY = (t0.clientY + t1.clientY) / 2;
        const targetScale = clampScale(
          pinchState.current.startScale *
            (distance / pinchState.current.startDistance),
        );
        const factor = targetScale / view.current.scale;
        if (factor !== 1) zoomAt(centerX, centerY, factor);
      }
    }

    function onTouchEnd(e: TouchEvent) {
      if (e.touches.length < 2) pinchState.current.active = false;
    }

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("pointerdown", onPointerDown);
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerup", onPointerUp);
    viewport.addEventListener("pointercancel", onPointerUp);
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });
    viewport.addEventListener("touchend", onTouchEnd);
    viewport.style.cursor = "grab";
    viewport.style.touchAction = "none";

    function onKeyDown(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLElement &&
        ["INPUT", "TEXTAREA"].includes(e.target.tagName)
      ) {
        return;
      }
      if (e.key === "0") {
        resetView();
      } else if (e.key === "+" || e.key === "=") {
        zoomAtCenter(ZOOM_STEP);
      } else if (e.key === "-") {
        zoomAtCenter(1 / ZOOM_STEP);
      }
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("pointerdown", onPointerDown);
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerup", onPointerUp);
      viewport.removeEventListener("pointercancel", onPointerUp);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
      viewport.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      if (scaleDebounceTimer.current) clearTimeout(scaleDebounceTimer.current);
    };
  }, [applyTransform, panBy, zoomAt, zoomAtCenter, resetView]);

  useEffect(() => {
    applyTransform();
  }, [applyTransform]);

  return {
    viewportRef,
    canvasRef,
    rulerTrackRef,
    scale,
    zoomIn: () => zoomAtCenter(ZOOM_STEP),
    zoomOut: () => zoomAtCenter(1 / ZOOM_STEP),
    resetView,
    minScale: MIN_SCALE,
    maxScale: MAX_SCALE,
  };
}
