import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  RecoilRoot,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import {
  aActive,
  aSize,
  aGridSize,
  sViewports,
  aCols,
  aRows,
  aMode,
  aBarHeight,
  aSidebarWidth,
  aCameras,
  afCamera,
  aImages,
  sAddImage,
  aImageMap,
  sSetImageMap,
  sMosaicCamera,
  sAllCameras,
  aShowCameras,
  aShowGrid,
  aShowPreview,
} from "./State.js";
import {
  setProjectionMatrices,
  setViewMatrix,
  getWorldFromPx,
  setViewMatrices,
} from "./gl_utils";
import {
  RecoilUndoRoot,
  useUndo,
  useRedo,
  useIsTrackingHistory,
} from "recoil-undo";
import Keyboard from "./Keyboard";
import Mouse from "./Mouse";
import MobileBar from "./Mobile";
import Sidebar from "./Sidebar";
import REGL from "regl";
import { base_zoom, mobile } from "./constants";
import { initImageQuad } from "./shaders";

function Examples() {
  return <div>examples</div>;
}

export default Examples;
