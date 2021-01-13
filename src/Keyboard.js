import { useEffect, useRef, useState } from "react";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  useRecoilSnapshot,
  useRecoilCallback,
} from "recoil";
import {
  aMode,
  sMoveActiveSelector,
  sResizeActiveSelector,
  sPanCamera,
  sZoomCamera,
  sMosaicCamera,
  sShatterCamera,
  sSelectAll,
  sShakeCamera,
  sPushCameras,
  sPullCameras,
  sAddCol,
  sRemCol,
  sAddRow,
  sRemRow,
  sResetZoom,
  sActiveEscape,
  sAddImage,
  sSetImageMap,
  aShowCameras,
  aShowGrid,
  aZoomMode,
  aShowPreview,
  sCopy,
  sPaste,
  sGridSize,
  sAllCameras,
  aCols,
  aRows,
} from "./State.js";
import { useUndo, useRedo } from "recoil-undo";
import { domLoadImage } from "./App";

function Keyboard({ scene_ref, input_ref }) {
  let [mode, setMode] = useRecoilState(aMode);
  let moveActive = useSetRecoilState(sMoveActiveSelector);
  let resizeActive = useSetRecoilState(sResizeActiveSelector);
  let [zoomMode, setZoomMode] = useRecoilState(aZoomMode);
  let [showCameras, setShowCameras] = useRecoilState(aShowCameras);
  let [showGrid, setShowGrid] = useRecoilState(aShowGrid);
  let [showPreview, setShowPreview] = useRecoilState(aShowPreview);
  let zoomCamera = useSetRecoilState(sZoomCamera);
  let panCamera = useSetRecoilState(sPanCamera);
  let mosaicCamera = useSetRecoilState(sMosaicCamera);
  let shatterCamera = useSetRecoilState(sShatterCamera);
  let shakeCamera = useSetRecoilState(sShakeCamera);
  let pushCameras = useSetRecoilState(sPushCameras);
  let pullCameras = useSetRecoilState(sPullCameras);
  let selectAll = useSetRecoilState(sSelectAll);
  let setGridSize = useSetRecoilState(sGridSize);
  let addCol = useSetRecoilState(sAddCol);
  let remCol = useSetRecoilState(sRemCol);
  let addRow = useSetRecoilState(sAddRow);
  let remRow = useSetRecoilState(sRemRow);
  let resetZoom = useSetRecoilState(sResetZoom);
  let activeEscape = useSetRecoilState(sActiveEscape);
  let addImage = useSetRecoilState(sAddImage);
  let setImageMap = useSetRecoilState(sSetImageMap);
  let km_ref = useRef({});
  let undo = useUndo();
  let redo = useRedo();
  let copy = useSetRecoilState(sCopy);
  let paste = useSetRecoilState(sPaste);

  const snapshot = useRecoilCallback();

  let check = [
    "h",
    "j",
    "k",
    "l",
    "arrowleft",
    "arrowright",
    "arrowup",
    "arrowdown",
  ];

  let logState = useRecoilCallback(({ snapshot }) => () => {
    let log = {};
    log.cols = snapshot.getLoadable(aCols).contents;
    log.rows = snapshot.getLoadable(aCols).contents;
    log.cameras = snapshot.getLoadable(sAllCameras).contents;
    console.log(JSON.stringify(log));
  });

  useEffect(() => {
    let km = km_ref.current;
    let scene = scene_ref.current;
    let input = input_ref.current;
    function pressed(press, e) {
      // temp
      if (km["1"]) {
        logState();
      }

      if (e.ctrlKey) {
        if (check.includes(press)) {
          e.preventDefault();
          let scroll_diff = [0, 0];
          if (press === "h" || press === "arrowleft") scroll_diff[0] -= 16;
          if (press === "j" || press === "arrowdown") scroll_diff[1] += 16;
          if (press === "k" || press === "arrowup") scroll_diff[1] -= 16;
          if (press === "l" || press === "arrowright") scroll_diff[0] += 16;
          window.scrollBy(...scroll_diff);
        }
        return;
      }

      if (check.includes(press)) {
        e.preventDefault();
      }

      if (km.z) undo();
      if (km.x) redo();

      if (mode === "normal") {
        if (km.h) moveActive([-1, 0]);
        if (km.j) moveActive([0, 1]);
        if (km.k) moveActive([0, -1]);
        if (km.l) moveActive([1, 0]);
        if (km.arrowleft) panCamera({ scene, diff: [-8, 0] });
        if (km.arrowright) panCamera({ scene, diff: [8, 0] });
        if (km.arrowup) panCamera({ scene, diff: [0, -8] });
        if (km.arrowdown) panCamera({ scene, diff: [0, 8] });

        if (press === "r") setMode("resize");
        if (press === "a") selectAll();
        if (press === "escape") activeEscape();

        if (km["-"]) zoomCamera({ scene, sign: 1, mult: 1.125 });
        if (km["+"]) zoomCamera({ scene, sign: -1, mult: 1.125 });
        if (km["="]) zoomCamera({ scene, sign: -1, mult: 1.125 });

        if (km["s"]) setZoomMode("canvas");
        if (km["i"]) setZoomMode("individual");
        if (km["t"]) setZoomMode("active");

        if (press === "o")
          domLoadImage(scene, input, addImage, setImageMap.bind(null, {}));

        if (km.c) copy();
        if (km.v) paste();

        if (km.e) shatterCamera({ scene });
        if (km.m) mosaicCamera({ scene });
        if (km.b) shakeCamera({ scene });
        if (km.u) pushCameras({ scene });
        if (km.n) pullCameras({ scene });
        if (km.d) resetZoom();

        // view
        if (km.p) setShowPreview(!showPreview);
        if (km.g) setShowGrid(!showGrid);
        if (km.f) setShowCameras(!showCameras);

        // save
        if (km.w) scene.capture = true;

        // undo redo
        if (km.z) undo();
        if (km.y) redo();

        if (km["("]) remCol();
        if (km[")"]) addCol();
        if (km["["]) remRow();
        if (km["]"]) addRow();

        if (press === "x") setMode("canvasResize");
        return;
      } else if (mode === "resize") {
        if (km.h) resizeActive([-1, 0]);
        if (km.j) resizeActive([0, 1]);
        if (km.k) resizeActive([0, -1]);
        if (km.l) resizeActive([1, 0]);
        if (km.arrowleft) resizeActive([-1, 0]);
        if (km.arrowdown) resizeActive([0, 1]);
        if (km.arrowup) resizeActive([0, -1]);
        if (km.arrowright) resizeActive([1, 0]);

        if (press === "escape") activeEscape();
        if (press === "a") selectAll();
        if (press === "r") setMode("normal");
        if (km.enter) setMode("normal");
        return;
      } else if (mode === "canvasResize") {
        if (km.h) setGridSize([-1, 0]);
        if (km.j) setGridSize([0, 1]);
        if (km.k) setGridSize([0, -1]);
        if (km.l) setGridSize([1, 0]);
        if (km.arrowleft) setGridSize([-1, 0]);
        if (km.arrowdown) setGridSize([0, 1]);
        if (km.arrowup) setGridSize([0, -1]);
        if (km.arrowright) setGridSize([1, 0]);

        if (press === "x") setMode("normal");
        if (km.enter) setMode("normal");
        return;
      }
    }

    function downHandler(e) {
      let press = e.key.toLowerCase();
      km[press] = true;
      pressed(press, e);
    }

    function upHandler(e) {
      let press = e.key.toLowerCase();
      km[press] = false;
    }

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [mode, showGrid, showCameras, showPreview]);

  return null;
}

export default Keyboard;
