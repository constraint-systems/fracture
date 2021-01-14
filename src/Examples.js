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
  sShakeCamera,
  afCamera,
  aImages,
  sShatterCamera,
  sActiveSelector,
  sAddImage,
  sResetZoom,
  aImageMap,
  sSetImageMap,
  sMosaicCamera,
  sAllCameras,
  sZoomCamera,
  aShowCameras,
  aShowGrid,
  aShowPreview,
  sAddCol,
  sRemCol,
  sAddRow,
  sRemRow,
  sCopy,
  sPaste,
} from "./State.js";
import { KeyButton } from "./Sidebar";
import { loadImage } from "./App";

function Examples({ scene_ref }) {
  let scene = scene_ref.current;
  let addImage = useSetRecoilState(sAddImage);
  let zoomCamera = useSetRecoilState(sZoomCamera);
  let setImageMap = useSetRecoilState(sSetImageMap);
  let shatterCamera = useSetRecoilState(sShatterCamera);
  let mosaicCamera = useSetRecoilState(sMosaicCamera);
  let shakeCamera = useSetRecoilState(sShakeCamera);
  let resetZoom = useSetRecoilState(sResetZoom);
  let setActive = useSetRecoilState(sActiveSelector);
  let addCol = useSetRecoilState(sAddCol);
  let remCol = useSetRecoilState(sRemCol);
  let addRow = useSetRecoilState(sAddRow);
  let remRow = useSetRecoilState(sRemRow);
  let copy = useSetRecoilState(sCopy);
  let paste = useSetRecoilState(sPaste);

  function loadFLW() {
    let new_cols = 4;
    let new_rows = 4;
    let col_diff = new_cols - scene.cols;
    let row_diff = new_rows - scene.rows;
    if (col_diff > 0) {
      for (let i = 0; i < col_diff; i++) {
        addCol();
      }
    }
    if (col_diff < 0) {
      for (let i = 0; i < Math.abs(col_diff); i++) {
        remCol();
      }
    }
    if (row_diff > 0) {
      for (let i = 0; i < row_diff; i++) {
        addRow();
      }
    }
    if (row_diff < 0) {
      for (let i = 0; i < Math.abs(row_diff); i++) {
        remRow();
      }
    }
    loadImage(
      scene,
      process.env.PUBLIC_URL + "/images/flw.jpg",
      addImage,
      setImageMap.bind(null, { active: [0, 0, new_cols, new_rows] }),
      () => {
        setActive([0, 0, new_cols, new_rows]);
        resetZoom();
        zoomCamera({ scene, sign: 1, mult: 1.5 });
        setActive([0, 0, new_cols / 2, new_rows]);
        mosaicCamera({ scene });
        setActive([2, 0, new_cols / 2, new_rows]);
        shatterCamera({ scene });
      }
    );
  }

  function loadAnimals() {
    let new_cols = 4;
    let new_rows = 4;
    let col_diff = new_cols - scene.cols;
    let row_diff = new_rows - scene.rows;
    if (col_diff > 0) {
      for (let i = 0; i < col_diff; i++) {
        addCol();
      }
    }
    if (col_diff < 0) {
      for (let i = 0; i < Math.abs(col_diff); i++) {
        remCol();
      }
    }
    if (row_diff > 0) {
      for (let i = 0; i < row_diff; i++) {
        addRow();
      }
    }
    if (row_diff < 0) {
      for (let i = 0; i < Math.abs(row_diff); i++) {
        remRow();
      }
    }
    loadImage(
      scene,
      process.env.PUBLIC_URL + "/images/dog.jpg",
      addImage,
      setImageMap.bind(null, { active: [0, 0, 2, 2] }),
      () => {
        setActive([0, 0, 2, 2]);
        resetZoom();
        mosaicCamera({ scene });
      }
    );
    loadImage(
      scene,
      process.env.PUBLIC_URL + "/images/panda.jpg",
      addImage,
      setImageMap.bind(null, { active: [2, 0, 2, 4] }),
      () => {
        setActive([2, 0, 2, 4]);
        resetZoom();
        mosaicCamera({ scene });
      }
    );
    loadImage(
      scene,
      process.env.PUBLIC_URL + "/images/frog.jpg",
      addImage,
      setImageMap.bind(null, { active: [0, 2, 2, 2] }),
      () => {
        setActive([0, 2, 2, 2]);
        resetZoom();
        mosaicCamera({ scene });
      }
    );
  }

  function loadTile() {
    let new_cols = 5;
    let new_rows = 3;
    let col_diff = new_cols - scene.cols;
    let row_diff = new_rows - scene.rows;
    if (col_diff > 0) {
      for (let i = 0; i < col_diff; i++) {
        addCol();
      }
    }
    if (col_diff < 0) {
      for (let i = 0; i < Math.abs(col_diff); i++) {
        remCol();
      }
    }
    if (row_diff > 0) {
      for (let i = 0; i < row_diff; i++) {
        addRow();
      }
    }
    if (row_diff < 0) {
      for (let i = 0; i < Math.abs(row_diff); i++) {
        remRow();
      }
    }
    loadImage(
      scene,
      process.env.PUBLIC_URL + "/images/iron.jpg",
      addImage,
      setImageMap.bind(null, { active: [4, 0, 1, 1] }),
      () => {
        setActive([4, 0, 1, 1]);
        resetZoom();
        zoomCamera({ scene, sign: 1, mult: 2 });
        shatterCamera({ scene });
        copy();
        setActive([0, 0, 1, 1]);
        paste();
        setActive([2, 0, 1, 1]);
        paste();
        setActive([1, 1, 1, 1]);
        paste();
        setActive([3, 1, 1, 1]);
        paste();
        setActive([2, 2, 1, 1]);
        paste();
        setActive([0, 2, 1, 1]);
        paste();
        setActive([2, 2, 1, 1]);
        paste();
        setActive([4, 2, 1, 1]);
        paste();
      }
    );
    loadImage(
      scene,
      process.env.PUBLIC_URL + "/images/smithsonite.jpg",
      addImage,
      setImageMap.bind(null, { active: [4, 1, 1, 1] }),
      () => {
        setActive([4, 1, 1, 1]);
        resetZoom();
        zoomCamera({ scene, sign: 1, mult: 2 });
        shatterCamera({ scene });
        copy();
        setActive([1, 0, 1, 1]);
        paste();
        setActive([3, 0, 1, 1]);
        paste();
        setActive([0, 1, 1, 1]);
        paste();
        setActive([2, 1, 1, 1]);
        paste();
        setActive([1, 2, 1, 1]);
        paste();
        setActive([3, 2, 1, 1]);
        paste();
      }
    );
  }

  return (
    <div>
      <KeyButton text="Animals" click={loadAnimals} />
      <KeyButton text="Wright" click={loadFLW} />
      <KeyButton text="Rocks" click={loadTile} />
    </div>
  );
}

export default Examples;
