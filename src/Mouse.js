import React, { useState, useEffect, useRef } from "react";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { draw } from "./Gl.js";
import {
  aActive,
  sViewports,
  sPanCamera,
  aCols,
  sActiveSelector,
  sSetImageMap,
  sZoomCamera,
  aMode,
  sAddImage,
} from "./State.js";
import { useBatching } from "recoil-undo";
import { loadImage } from "./App";

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

function throttle(callback, limit) {
  var waiting = false; // Initially, we're not waiting
  return function () {
    // We return a throttled function
    if (!waiting) {
      // If we're not waiting
      callback.apply(this, arguments); // Execute users function
      waiting = true; // Prevent future invocations
      setTimeout(function () {
        // After a period of time
        waiting = false; // And allow future invocations
      }, limit);
    }
  };
}

function Mouse({ canvas_ref, scene_ref, scroll_ref }) {
  let mouse_ref = useRef({
    raw: [0, 0],
    down: false,
    drag_start: null,
    scrollCheck: [0, 0],
  });
  let viewports = useRecoilValue(sViewports);
  let panCamera = useSetRecoilState(sPanCamera);
  let active = useRecoilValue(aActive);
  let cols = useRecoilValue(aCols);
  let mode = useRecoilValue(aMode);
  let setActive = useSetRecoilState(sActiveSelector);
  let zoomCamera = useSetRecoilState(sZoomCamera);
  let addImage = useSetRecoilState(sAddImage);
  let setImageMap = useSetRecoilState(sSetImageMap);
  let { startBatch, endBatch } = useBatching();

  useEffect(() => {
    function getViewportFromMouse(mouse_raw) {
      let [mx, my] = mouse_raw;
      for (let i = 0; i < viewports.length; i++) {
        let viewport = viewports[i];
        let [x, y, w, h] = viewport;
        let col = i % cols;
        let row = Math.floor(i / cols);
        if (mx >= x && mx <= x + w && my >= y && my <= y + h) {
          return [col, row];
        }
      }
    }

    let canvas = canvas_ref.current;
    let mouse = mouse_ref.current;
    let scene = scene_ref.current;
    let scroll = scroll_ref.current;

    function mouseMove(e) {
      e.preventDefault();
      if (e.clientX !== mouse.raw[0] && e.clientY !== mouse.raw[1]) {
        if (mouse.scroll) {
          let dx = e.clientX - mouse.scrollCheck[0];
          let dy = e.clientY - mouse.scrollCheck[1];
          window.scrollBy(-dx, -dy);
          mouse.scrollCheck = [e.clientX, e.clientY];
          return false;
        }
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        if (mouse.down) {
          if (mode === "resize") {
            let [ax, ay, aw, ah] = active;
            let [mx, my] = getViewportFromMouse(mouse.raw);
            let ax2 = ax + aw - 1;
            let ay2 = ay + ah - 1;
            let nx = Math.min(mx, ax);
            let ny = Math.min(my, ay);
            let nx2 = Math.max(mx, ax2);
            let ny2 = Math.max(my, ay2);
            let w = nx2 - nx + 1;
            let h = ny2 - ny + 1;
            setActive([nx, ny, w, h]);
          } else {
            let dx = x - mouse.raw[0];
            let dy = y - mouse.raw[1];
            panCamera({ scene, diff: [dx, dy] });
          }
        }
        mouse.raw = [x, y];
      }
    }
    function mouseDown(e) {
      e.preventDefault();
      // startBatch();
      if (e.ctrlKey) {
        mouse.scroll = true;
        canvas.setPointerCapture(e.pointerId);
        mouse.scrollCheck = [e.clientX, e.clientY];
        return false;
      }
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left; //x position within the element.
      var y = e.clientY - rect.top;
      mouse.raw = [x, y];
      if (mode === "resize") {
        let [ax, ay, aw, ah] = active;
        let [mcol, mrow] = getViewportFromMouse(mouse.raw);
        setActive([mcol, mrow, 1, 1]);
        mouse.down = true;
      } else if (mode === "normal") {
        let [ax, ay, aw, ah] = active;
        let [mcol, mrow] = getViewportFromMouse(mouse.raw);
        if (mcol >= ax && mcol < ax + aw && mrow >= ay && mrow < ay + ah) {
          mouse.down = true;
        } else {
          setActive([
            mcol - Math.round((aw - 1) / 2),
            mrow - Math.round((ah - 1) / 2),
            aw,
            ah,
          ]);
          mouse.down = true;
        }
      }
      canvas.setPointerCapture(e.pointerId);
    }
    function mouseUp(e) {
      e.preventDefault();
      // endBatch();
      mouse.down = false;
      mouse.scroll = false;
      canvas.releasePointerCapture(e.pointerId);
    }
    function mouseWheel(e) {
      e.preventDefault();

      if (mode === "normal") {
        let sign = e.deltaY < 0 ? -1 : 1;
        let mult = 1;
        let abs = Math.abs(e.deltaY);
        if (abs > 25) {
          mult = 1.125;
        } else {
          mult = 1 + 0.125 * (abs / 80);
        }
        zoomCamera({ scene, sign, mult });
      }
    }

    function onDrop(e) {
      e.preventDefault();
      e.stopPropagation();
      let file = e.dataTransfer.files[0];
      let filename = file.path ? file.path : file.name ? file.name : "";
      let src = URL.createObjectURL(file);
      loadImage(scene, src, addImage);
    }

    function onDrag(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }

    function onPaste(e) {
      e.preventDefault();
      e.stopPropagation();
      console.log("paste");
      for (const item of e.clipboardData.items) {
        if (item.type.indexOf("image") < 0) {
          continue;
        }
        let file = item.getAsFile();
        let src = URL.createObjectURL(file);
        loadImage(scene, src, addImage, setImageMap.bind(null, {}));
      }
    }

    canvas.addEventListener("pointermove", mouseMove);
    canvas.addEventListener("pointerdown", mouseDown);
    canvas.addEventListener("pointerup", mouseUp);
    canvas.addEventListener("wheel", mouseWheel, { passive: false });
    window.addEventListener("paste", onPaste);
    window.addEventListener("dragover", onDrag);
    window.addEventListener("drop", onDrop);
    return () => {
      canvas.removeEventListener("pointermove", mouseMove);
      canvas.removeEventListener("pointerdown", mouseDown);
      canvas.removeEventListener("pointerup", mouseUp);
      canvas.removeEventListener("wheel", mouseWheel);
      window.removeEventListener("paste", onPaste);
      window.removeEventListener("dragover", onDrag);
      window.removeEventListener("drop", onDrop);
    };
  }, [viewports, mode, canvas_ref, active, cols]);

  return null;
}

export default Mouse;
