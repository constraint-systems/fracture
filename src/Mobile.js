import React, { useEffect, useRef, useState } from "react";
import {
  aSize,
  aGridSize,
  sViewports,
  aCols,
  aRows,
  aMode,
  aBarHeight,
  aSidebar,
  aCameras,
  afCamera,
  aImages,
  sAddImage,
  aImageMap,
  sSetImageMap,
  aSidebarWidth,
  sMosaicCamera,
  sAllCameras,
  sMoveActiveSelector,
  sResizeActiveSelector,
  sPanCamera,
  sZoomCamera,
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
  aShowCameras,
  aShowGrid,
  aZoomMode,
  aShowPreview,
  sCopy,
  sPaste,
  sGridSize,
} from "./State.js";
import { domLoadImage } from "./App";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useUndo, useRedo } from "recoil-undo";
import {
  ToggleKeyButton,
  KeyButton,
  Spacer,
  Info,
  Tip,
  HSpacer,
} from "./Sidebar";

function MobileBar({ scene_ref, input_ref }) {
  let sidebarWidth = useRecoilValue(aSidebarWidth);
  let [mode, setMode] = useRecoilState(aMode);
  let [zoomMode, setZoomMode] = useRecoilState(aZoomMode);
  let [showCameras, setShowCameras] = useRecoilState(aShowCameras);
  let [showGrid, setShowGrid] = useRecoilState(aShowGrid);
  let [showPreview, setShowPreview] = useRecoilState(aShowPreview);
  let moveActive = useSetRecoilState(sMoveActiveSelector);
  let resizeActive = useSetRecoilState(sResizeActiveSelector);
  let zoomCamera = useSetRecoilState(sZoomCamera);
  let panCamera = useSetRecoilState(sPanCamera);
  let mosaicCamera = useSetRecoilState(sMosaicCamera);
  let shatterCamera = useSetRecoilState(sShatterCamera);
  let shakeCamera = useSetRecoilState(sShakeCamera);
  let pushCameras = useSetRecoilState(sPushCameras);
  let pullCameras = useSetRecoilState(sPullCameras);
  let selectAll = useSetRecoilState(sSelectAll);
  let copy = useSetRecoilState(sCopy);
  let paste = useSetRecoilState(sPaste);
  let addCol = useSetRecoilState(sAddCol);
  let remCol = useSetRecoilState(sRemCol);
  let addRow = useSetRecoilState(sAddRow);
  let remRow = useSetRecoilState(sRemRow);
  let resetZoom = useSetRecoilState(sResetZoom);
  let activeEscape = useSetRecoilState(sActiveEscape);
  let addImage = useSetRecoilState(sAddImage);
  let setImageMap = useSetRecoilState(sSetImageMap);
  let setGridSize = useSetRecoilState(sGridSize);
  let km_ref = useRef({});
  let undo = useUndo();
  let redo = useRedo();

  let resize = mode === "resize";
  let scene = scene_ref.current;
  let input = input_ref.current;

  return (
    <div
      style={{
        paddingLeft: 8,
        paddingRight: 8,
      }}
    >
      <HSpacer />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <ToggleKeyButton
            text="Resize selection"
            compare={resize}
            click={setMode.bind(null, resize ? "normal" : "resize")}
          />
        </div>
        <div>
          Zoom:{" "}
          <KeyButton
            text="+"
            click={zoomCamera.bind(null, { scene, sign: -1 })}
          />
          <KeyButton
            text="-"
            click={zoomCamera.bind(null, { scene, sign: 1 })}
          />
        </div>
      </div>
      <div>
        <KeyButton text="Select all" click={selectAll} />
        <KeyButton text="Clear" click={activeEscape} />
      </div>
      <HSpacer />
      <Info>Zoom center</Info>
      <div>
        <ToggleKeyButton
          text="Canvas"
          compare={zoomMode === "canvas"}
          click={setZoomMode.bind(null, "canvas")}
        />
        <ToggleKeyButton
          text="Individual"
          compare={zoomMode === "individual"}
          click={setZoomMode.bind(null, "individual")}
        />
        <ToggleKeyButton
          text="Active"
          compare={zoomMode === "active"}
          click={setZoomMode.bind(null, "active")}
        />
      </div>
    </div>
  );
}

export default MobileBar;
