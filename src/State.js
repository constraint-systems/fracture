import React from "react";
import { atom, atomFamily, selector } from "recoil";
import { getWorldFromPx, castRay } from "./gl_utils";
import { base_zoom, zoom_scaler } from "./constants";
import { getID } from "./App";

export let aScene = atom({
  key: "scene",
  default: {},
});

export let aActive = atom({
  key: "active",
  default: [2, 1, 1, 1],
});

export let a_Mode = atom({
  key: "mode",
  default: "normal",
});

export let aMode = selector({
  key: "sMode",
  get: ({ get }) => {
    return get(a_Mode);
  },
  set: ({ set }, name) => {
    set(a_Mode, name);
  },
});

export let aSize = atom({
  key: "size",
  default: [null, null],
});

export let aGridSize = atom({
  key: "gridSize",
  default: [null, null],
});

export let sGridSize = selector({
  key: "changeGridSize",
  set: ({ get, set }, diff) => {
    let [dx, dy] = diff;
    let [w, h] = get(aGridSize).slice();
    let wlimit = Math.max(64, w + dx * 8);
    let hlimit = Math.max(64, h + dy * 8);
    set(aGridSize, [wlimit, hlimit]);
  },
});

export let aCols = atom({
  key: "cols",
  default: 4,
});

export let aRows = atom({
  key: "rows",
  default: 4,
});

export let aBarHeight = atom({
  key: "barHeight",
  default: 0,
});

export let aSidebarWidth = atom({
  key: "sidebarWidth",
  default: 360,
});

export let aCameras = atom({
  key: "cameras",
  default: [],
});

export let afCamera = atomFamily({
  key: "camera",
  default: [0, 0, 5],
});

export let aImageMap = atom({
  key: "imageMap",
  default: [],
});

export let aImages = atom({
  key: "images",
  default: [],
});

export let sAddImage = selector({
  key: "addImage",
  set: ({ get, set }, img) => {
    let imgs = get(aImages);
    set(aImages, [...imgs, img]);
  },
});

function constrainActive(active, cols, rows) {
  let [x, y, w, h] = active;
  if (w > cols) w = cols;
  if (h > rows) h = rows;
  return [minmax(x, 0, cols - w), minmax(y, 0, rows - h), w, h];
}

function minmax(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export let sActiveSelector = selector({
  key: "activeSelector",
  set: ({ get, set }, new_value) => {
    set(aActive, constrainActive(new_value, get(aCols), get(aRows)));
  },
});

export let sSelectAll = selector({
  key: "selectAll",
  set: ({ get, set }, new_value) => {
    set(aActive, [0, 0, get(aCols), get(aRows)]);
  },
});

export let sMoveActiveSelector = selector({
  key: "moveActiveSelector",
  set: ({ get, set }, diff) => {
    let [x, y, w, h] = get(aActive);
    let [dx, dy] = diff;
    set(sActiveSelector, [x + dx, y + dy, w, h]);
  },
});

function constrainResize(active, cols, rows) {
  let [x, y, w, h] = active;
  let wlimit = cols - active[0];
  let hlimit = rows - active[1];
  return [x, y, minmax(w, 1, wlimit), minmax(h, 1, hlimit)];
}

export let sResizeActiveSelector = selector({
  key: "resizeActiveSelector",
  set: ({ get, set }, diff) => {
    let [x, y, w, h] = get(aActive);
    let [dx, dy] = diff;
    let new_value = [x, y, w + dx, h + dy];
    set(aActive, constrainResize(new_value, get(aCols), get(aRows)));
  },
});

export let sViewports = selector({
  key: "viewports",
  get: ({ get }) => {
    let [w, h] = get(aGridSize);
    let cols = get(aCols);
    let rows = get(aRows);
    let vw = Math.floor(w / cols);
    let vh = Math.floor(h / rows);
    return [...Array(cols * rows)].map((_, i) => {
      let c = i % cols;
      let r = Math.floor(i / cols);
      return [c * vw, r * vh, vw, vh];
    });
  },
});

export let sPanCamera = selector({
  key: "panCamera",
  set: ({ get, set }, { scene, diff }) => {
    let [dx, dy] = diff;
    let cameras = get(aCameras);
    let cols = get(aCols);
    let [x, y, w, h] = get(aActive);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let id = cameras[index];
        let camera = get(afCamera(id));
        let new_camera = camera.slice();
        let ndx = getWorldFromPx(scene, dx, new_camera[2]);
        let ndy = getWorldFromPx(scene, dy, new_camera[2]);
        new_camera[0] -= ndx;
        new_camera[1] += ndy;
        set(afCamera(id), new_camera);
      }
    }
  },
});

export let sActiveEscape = selector({
  key: "activeEscape",
  set: ({ get, set }) => {
    let [x, y, w, h] = get(aActive);
    set(aActive, [x, y, 1, 1]);
  },
});

export let sResetZoom = selector({
  key: "resetZoom",
  set: ({ get, set }) => {
    let cameras = get(aCameras);
    let cols = get(aCols);
    let [x, y, w, h] = get(aActive);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let id = cameras[index];
        let camera = get(afCamera(id));
        let new_camera = camera.slice();
        new_camera[2] = base_zoom;
        set(afCamera(id), new_camera);
      }
    }
  },
});

export let sAllCameras = selector({
  key: "allCameras",
  get: ({ get }) => {
    let cameras = get(aCameras);
    let cols = get(aCols);
    let rows = get(aRows);
    let expandedCameras = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let index = r * cols + c;
        let id = cameras[index];
        let camera = get(afCamera(id));
        expandedCameras.push(camera);
      }
    }
    return expandedCameras;
  },
});

export let sMosaicCamera = selector({
  key: "mosaicCamera",
  set: ({ get, set }, { scene, active }) => {
    let cameras = get(aCameras);
    let viewports = get(sViewports);
    let [gw, gh] = get(aGridSize);
    let cols = get(aCols);
    let rows = get(aRows);
    let get_active;
    if (active === undefined) {
      get_active = get(aActive);
    } else {
      get_active = active;
    }
    let [x, y, w, h] = get_active;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let inverted = (rows - 1 - (y + r)) * cols + (x + c);
        let id = cameras[index];
        let [vx, vy, vw, vh] = viewports[inverted];
        let camera = get(afCamera(id));
        let new_camera = camera.slice();
        let midx = vx + vw / 2;
        let midy = vy + vh / 2;
        let difx = midx - gw / 2;
        let dify = midy - gh / 2;
        let w = getWorldFromPx(scene, difx, new_camera[2]);
        let h = getWorldFromPx(scene, dify, new_camera[2]);
        new_camera[0] = w;
        new_camera[1] = h;
        set(afCamera(id), new_camera);
      }
    }
  },
});

export let sShakeCamera = selector({
  key: "shakeCamera",
  set: ({ get, set }, { scene, active }) => {
    let cameras = get(aCameras);
    let cols = get(aCols);
    let get_active;
    if (active === undefined) {
      get_active = get(aActive);
    } else {
      get_active = active;
    }
    let [x, y, w, h] = get_active;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let id = cameras[index];
        let camera = get(afCamera(id));
        let new_camera = camera.slice();
        let nd = getWorldFromPx(scene, 24, new_camera[2]);
        let dx = 0 - nd / 2 + Math.random() * nd;
        let dy = 0 - nd / 2 + Math.random() * nd;
        new_camera[0] += dx;
        new_camera[1] += dy;
        set(afCamera(id), new_camera);
      }
    }
  },
});

export let sPushCameras = selector({
  key: "pushCameras",
  set: ({ get, set }, { scene, active }) => {
    let [x, y, w, h] = get(aActive);
    let cameras = get(aCameras);
    let cols = get(aCols);
    let c1 = x + w / 2;
    let c2 = y + h / 2;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let id = cameras[index];
        let camera = get(afCamera(id));
        let new_camera = camera.slice();
        let dx = 0;
        let dy = 0;
        if (c1 < c + x + 0.5) {
          dx = -1;
        } else if (c1 > c + x + 0.5) {
          dx = 1;
        }
        if (c2 < r + y + 0.5) {
          dy = 1;
        } else if (c2 > r + y + 0.5) {
          dy = -1;
        }
        let ndx = getWorldFromPx(scene, dx * 8, camera[2]);
        let ndy = getWorldFromPx(scene, dy * 8, camera[2]);
        new_camera[0] += ndx;
        new_camera[1] += ndy;
        set(afCamera(id), new_camera);
      }
    }
  },
});

export let sPullCameras = selector({
  key: "pullCameras",
  set: ({ get, set }, { scene, active }) => {
    let [x, y, w, h] = get(aActive);
    let cameras = get(aCameras);
    let cols = get(aCols);
    let c1 = x + w / 2;
    let c2 = y + h / 2;
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let id = cameras[index];
        let camera = get(afCamera(id));
        let new_camera = camera.slice();
        let dx = 0;
        let dy = 0;
        if (c1 < c + x + 0.5) {
          dx = 1;
        } else if (c1 > c + x + 0.5) {
          dx = -1;
        }
        if (c2 < r + y + 0.5) {
          dy = -1;
        } else if (c2 > r + y + 0.5) {
          dy = 1;
        }
        let ndx = getWorldFromPx(scene, dx * 8, camera[2]);
        let ndy = getWorldFromPx(scene, dy * 8, camera[2]);
        new_camera[0] += ndx;
        new_camera[1] += ndy;
        set(afCamera(id), new_camera);
      }
    }
  },
});

export let sShatterCamera = selector({
  key: "shatterCamera",
  set: ({ get, set }, scene) => {
    let cameras = get(aCameras);
    let cols = get(aCols);
    let rows = get(aRows);
    let [x, y, w, h] = get(aActive);
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let id = cameras[index];
        let camera = get(afCamera(id));
        let new_camera = camera.slice();
        new_camera[0] = 0;
        new_camera[1] = 0;
        set(afCamera(id), new_camera);
      }
    }
  },
});

export let sSetImageMap = selector({
  key: "setImageMap",
  set: ({ get, set }, { active }) => {
    let cols = get(aCols);
    let rows = get(aRows);
    let get_active;
    if (active === undefined) {
      get_active = get(aActive);
    } else {
      get_active = active;
    }
    let [x, y, w, h] = get_active;
    let images = get(aImages);
    let new_map = get(aImageMap).slice();
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let inverted = (rows - 1 - (y + r)) * cols + (x + c);
        new_map[inverted] = images.length - 1;
      }
    }
    set(aImageMap, new_map);
  },
});

function zoomLimit(new_zoom) {
  let max = 100;
  let min = 0.01;
  return Math.min(max, Math.max(min, new_zoom));
}

export let aZoomMode = atom({
  key: "zoomMode",
  default: "canvas",
});

export let aShowCameras = atom({
  key: "showCameras",
  default: false,
});

export let aShowGrid = atom({
  key: "showGrid",
  default: true,
});

export let aShowPreview = atom({
  key: "showPreview",
  default: false,
});

export let aCopy = atom({
  key: "copy",
  default: [],
});

export let sCopy = selector({
  key: "setCopy",
  set: ({ get, set }) => {
    let [x, y, w, h] = get(aActive);
    let imageMap = get(aImageMap);
    let cols = get(aCols);
    let rows = get(aRows);
    let cameras = get(aCameras);
    let copy = [];
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let inverted = (rows - 1 - (y + r)) * cols + (x + c);
        let id = cameras[index];
        let camera = get(afCamera(id));
        let map = imageMap[inverted];
        let obj = [camera.slice(), map];
        copy.push(obj);
      }
    }
    set(aCopy, copy);
  },
});

export let sPaste = selector({
  key: "setPaste",
  set: ({ get, set }) => {
    let copy = get(aCopy);
    if (copy.length > 0) {
      let [x, y, w, h] = get(aActive);
      let imageMap = get(aImageMap);
      let newMap = imageMap.slice();
      let cols = get(aCols);
      let rows = get(aRows);
      let cameras = get(aCameras);
      let copy = get(aCopy);
      for (let r = 0; r < h; r++) {
        for (let c = 0; c < w; c++) {
          let copyIndex = r * w + c;
          if (copy[copyIndex] === undefined) copyIndex = copy.length - 1;
          let [new_camera, new_map] = copy[copyIndex];
          let index = (y + r) * cols + (x + c);
          let inverted = (rows - 1 - (y + r)) * cols + (x + c);
          let id = cameras[index];
          newMap[inverted] = new_map;
          set(afCamera(id), new_camera);
        }
      }
      set(aImageMap, newMap);
    }
  },
});

export let sZoomCamera = selector({
  key: "zoomCamera",
  set: ({ get, set }, { scene, sign, mult }) => {
    let cameras = get(aCameras);
    let cols = get(aCols);
    let rows = get(aRows);
    let [x, y, w, h] = get(aActive);
    let [gw, gh] = get(aGridSize);
    let zoomMode = get(aZoomMode);
    let viewports = get(sViewports);
    let [xp, yp] = viewports[(rows - (y + h)) * cols + x];
    let [_, __, vw, vh] = viewports[0];
    let active_size = [vw * w, vh * h];
    for (let r = 0; r < h; r++) {
      for (let c = 0; c < w; c++) {
        let index = (y + r) * cols + (x + c);
        let inverted = (rows - 1 - (y + r)) * cols + (x + c);
        let id = cameras[index];
        let camera = get(afCamera(id));
        let new_camera = camera.slice();
        let zoom = new_camera[2];
        let new_poss;
        if (sign > 0) {
          new_poss = zoom * mult;
        } else {
          new_poss = zoom / mult;
        }
        let new_zoom = zoomLimit(new_poss);
        if (new_zoom > zoom || new_zoom < zoom) {
          if (zoomMode === "canvas") {
            let projected = castRay(
              scene,
              inverted,
              [gw / 2, gh / 2],
              new_zoom
            );
            new_camera = [...projected, new_zoom];
          } else if (zoomMode === "active") {
            let projected = castRay(
              scene,
              inverted,
              [xp + active_size[0] / 2, yp + active_size[1] / 2],
              new_zoom
            );
            new_camera = [...projected, new_zoom];
          } else {
            new_camera[2] = new_zoom;
          }
          set(afCamera(id), new_camera);
        }
      }
    }
  },
});

export let sAddCol = selector({
  key: "addCol",
  set: ({ get, set }) => {
    let cols = get(aCols);
    let rows = get(aRows);
    if (cols < 10) {
      let [x, y, w, h] = get(aActive);
      let insertCol = x + w;
      let lastCol = insertCol - 1;

      let imageMap = get(aImageMap);
      let mapCols = [...Array(cols)].map((n) => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let index = r * cols + c;
          mapCols[c].push(imageMap[index]);
        }
      }
      let copyCol = mapCols[lastCol].slice();
      mapCols.splice(insertCol, 0, copyCol);
      let recombinedMap = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < mapCols.length; c++) {
          recombinedMap.push(mapCols[c][r]);
        }
      }

      let cameras = get(aCameras);
      let cameraCols = [...Array(cols)].map((n) => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let index = r * cols + c;
          cameraCols[c].push(cameras[index]);
        }
      }
      let copyCameras = cameraCols[lastCol].slice();
      let newCol = [];
      for (let r = 0; r < rows; r++) {
        let id = getID();
        let copyID = copyCameras[r];
        let cloneCamera = get(afCamera(copyID)).slice();
        set(afCamera(id), cloneCamera);
        newCol.push(id);
      }
      cameraCols.splice(insertCol, 0, newCol);
      let recombinedCameras = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cameraCols.length; c++) {
          recombinedCameras.push(cameraCols[c][r]);
        }
      }

      set(aCameras, recombinedCameras);
      set(aImageMap, recombinedMap);
      set(aCols, cols + 1);
      set(aActive, [x, y, w + 1, h]);
    }
  },
});

export let sRemCol = selector({
  key: "remCol",
  set: ({ get, set }) => {
    let cols = get(aCols);
    let rows = get(aRows);
    if (cols > 1) {
      let [x, y, w, h] = get(aActive);
      let firstCol = x;

      let imageMap = get(aImageMap);
      let mapCols = [...Array(cols)].map((n) => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let index = r * cols + c;
          mapCols[c].push(imageMap[index]);
        }
      }
      mapCols.splice(firstCol, 1);
      let recombinedMap = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < mapCols.length; c++) {
          recombinedMap.push(mapCols[c][r]);
        }
      }

      let cameras = get(aCameras);
      let cameraCols = [...Array(cols)].map((n) => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let index = r * cols + c;
          cameraCols[c].push(cameras[index]);
        }
      }
      cameraCols.splice(firstCol, 1);
      let recombinedCameras = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cameraCols.length; c++) {
          recombinedCameras.push(cameraCols[c][r]);
        }
      }

      set(aCameras, recombinedCameras);
      set(aImageMap, recombinedMap);
      set(aCols, cols - 1);
      if (w > 1) {
        set(aActive, constrainActive([x, y, w - 1, h], cols - 1, rows));
      } else {
        set(aActive, constrainActive([x - 1, y, w, h], cols - 1, rows));
      }
    }
  },
});

export let sAddRow = selector({
  key: "addRow",
  set: ({ get, set }) => {
    let cols = get(aCols);
    let rows = get(aRows);
    if (rows < 8) {
      let [x, y, w, h] = get(aActive);
      let insertRow = y + h;
      let lastRow = insertRow - 1;

      let imageMap = get(aImageMap);
      let mapRows = [...Array(rows)].map((n) => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let index = r * cols + c;
          mapRows[r].push(imageMap[index]);
        }
      }
      let copyRow = mapRows[lastRow].slice();
      mapRows.splice(insertRow, 0, copyRow);
      let recombinedMap = [];
      for (let r = 0; r < mapRows.length; r++) {
        for (let c = 0; c < cols; c++) {
          recombinedMap.push(mapRows[r][c]);
        }
      }

      let cameras = get(aCameras);
      let cameraRows = [...Array(rows)].map((n) => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let index = r * cols + c;
          cameraRows[r].push(cameras[index]);
        }
      }
      let copyCameras = cameraRows[lastRow].slice();
      let newRow = [];
      for (let c = 0; c < cols; c++) {
        let id = getID();
        let copyID = copyCameras[c];
        let cloneCamera = get(afCamera(copyID)).slice();
        set(afCamera(id), cloneCamera);
        newRow.push(id);
      }
      cameraRows.splice(insertRow, 0, newRow);
      let recombinedCameras = [];
      for (let r = 0; r < cameraRows.length; r++) {
        for (let c = 0; c < cols; c++) {
          recombinedCameras.push(cameraRows[r][c]);
        }
      }

      set(aCameras, recombinedCameras);
      set(aImageMap, recombinedMap);
      set(aRows, rows + 1);
      set(aActive, [x, y, w, h + 1]);
    }
  },
});

export let sRemRow = selector({
  key: "remRoww",
  set: ({ get, set }) => {
    let cols = get(aCols);
    let rows = get(aRows);
    if (rows > 1) {
      let [x, y, w, h] = get(aActive);
      let firstRow = y;

      let imageMap = get(aImageMap);
      let mapRows = [...Array(rows)].map((n) => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let index = r * cols + c;
          mapRows[r].push(imageMap[index]);
        }
      }
      mapRows.splice(firstRow, 1);
      let recombinedMap = [];
      for (let r = 0; r < mapRows.length; r++) {
        for (let c = 0; c < cols; c++) {
          recombinedMap.push(mapRows[r][c]);
        }
      }

      let cameras = get(aCameras);
      let cameraRows = [...Array(rows)].map((n) => []);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let index = r * cols + c;
          cameraRows[r].push(cameras[index]);
        }
      }
      cameraRows.splice(firstRow, 1);
      let recombinedCameras = [];
      for (let r = 0; r < cameraRows.length; r++) {
        for (let c = 0; c < cols; c++) {
          recombinedCameras.push(cameraRows[r][c]);
        }
      }

      set(aCameras, recombinedCameras);
      set(aImageMap, recombinedMap);
      set(aRows, rows - 1);
      if (h > 1) {
        set(aActive, constrainActive([x, y, w, h - 1], cols, rows - 1));
      } else {
        set(aActive, constrainActive([x - 1, y, w, h], cols, rows - 1));
      }
    }
  },
});
