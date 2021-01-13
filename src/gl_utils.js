import { base_zoom, start_zoom, zoom_scaler } from "./constants.js";
import {
  perspective,
  lookAt,
  multiply,
  invert,
  multiplyPoint,
  transformPoint,
  normalize,
} from "./mat4.js";

export function setViewports(scene, $render, cols, rows) {
  let w = Math.floor($render.width / cols);
  let h = Math.floor($render.height / rows);
  scene.viewports = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.viewports.push([c * w, r * h, w, h]);
    }
  }
}

export function initImageMap(scene, cols, rows) {
  scene.viewport_image_map = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      scene.viewport_image_map.push(null);
    }
  }
}

export function initCameras(scene) {
  scene.cameras = [];
  scene.projection = [];
  scene.inverse_projection = [];
  scene.views = [];
  scene.view_projections = [];
  scene.inverse_view_projections = [];
  for (let i = 0; i < scene.viewports.length; i++) {
    scene.cameras.push([0, 0, start_zoom]);
    scene.views.push([]);
    scene.view_projections.push([]);
    scene.inverse_view_projections.push([]);
  }
}

export function setProjectionMatrices(scene) {
  if (scene.viewports.length > 0) {
    let w = scene.viewports[0][2];
    let h = scene.viewports[0][3];
    perspective(scene.projection, Math.PI / 3, w / h, 0.01, 100);
    invert(scene.inverse_projection, scene.projection);
  }
}

function getLookAt(camera) {
  return [camera[0], camera[1], 0];
}

export function setViewMatrix(scene, i) {
  let camera = scene.cameras[i];
  if (scene.views[i]) {
    lookAt(scene.views[i], camera, getLookAt(camera), [0, 1, 0]);
    multiply(scene.view_projections[i], scene.projection, scene.views[i]);
    invert(scene.inverse_view_projections[i], scene.view_projections[i]);
  }
}

export function setViewMatrices(scene) {
  for (let i = 0; i < scene.cameras.length; i++) {
    let camera = scene.cameras[i];
    lookAt(scene.views[i], camera, getLookAt(camera), [0, 1, 0]);
    multiply(scene.view_projections[i], scene.projection, scene.views[i]);
    invert(scene.inverse_view_projections[i], scene.view_projections[i]);
  }
}

export function getProjectionZ(scene, world_z) {
  let projected = multiplyPoint(scene.projection, [0, 0, world_z, 1]);
  let ndz = projected[2] / projected[3];
  return ndz;
}

export function getWorldFromPx(scene, px, camera_dist) {
  let z = getProjectionZ(scene, -camera_dist);
  let raw = [(2 * px) / scene.viewports[0][2], 0, z, 1];
  let point_world = multiplyPoint(scene.inverse_projection, raw);
  return point_world[0] / point_world[3];
}

export function mosaic(scene, indexes) {
  let $render = scene.$render;
  // need matrices to be initialized already
  if (indexes === undefined) indexes = scene.group;
  for (let i of indexes) {
    let [vx, vy, vw, vh] = scene.viewports[i];
    let camera = scene.cameras[i];
    let midx = vx + vw / 2;
    let midy = vy + vh / 2;
    let difx = midx - $render.width / 2;
    let dify = midy - $render.height / 2;
    let w = getWorldFromPx(scene, difx, camera[2]);
    let h = getWorldFromPx(scene, dify, camera[2]);
    scene.cameras[i][0] = w;
    scene.cameras[i][1] = h;
  }
}

export function panSetPixels(scene, x, y) {
  let indexes = scene.active;
  for (let index of indexes) {
    let viewport = scene.viewports[index];
    let camera = scene.cameras[index];
    let ndx = getWorldFromPx(scene, x * 8, camera[2]);
    let ndy = getWorldFromPx(scene, y * 8, camera[2]);
    scene.cameras[index][0] += ndx;
    scene.cameras[index][1] += ndy;
  }
}

export function panViewports(scene, dx, dy) {
  let indexes = scene.active;
  for (let index of indexes) {
    let viewport = scene.viewports[index];
    let camera = scene.cameras[index];
    let ndx = getWorldFromPx(scene, dx, camera[2]);
    let ndy = getWorldFromPx(scene, dy, camera[2]);
    scene.cameras[index][0] -= ndx;
    scene.cameras[index][1] += ndy;
  }
}

export function getClipsFromMouse(viewport, mouse_position) {
  let ratio_x = (mouse_position[0] - viewport[0]) / viewport[2];
  let ratio_y = (mouse_position[1] - viewport[1]) / viewport[3];
  let clip_x = 2 * ratio_x - 1;
  let clip_y = 2 * ratio_y - 1;
  return [clip_x, clip_y];
}

export function castRay(scene, index, mouse, world_z) {
  let viewport = scene.viewports[index];
  let ndz = getNormalizedZ(scene, index, world_z);
  let clips = getClipsFromMouse(viewport, mouse);
  let device_coordinates = [clips[0], clips[1], ndz, 1];
  let point_world = multiplyPoint(
    scene.inverse_view_projections[index],
    device_coordinates
  );
  // divide by w at end
  let world_points = [
    point_world[0] / point_world[3],
    point_world[1] / point_world[3],
  ];
  return world_points;
}

function zoomLimit(new_zoom) {
  let max = 99;
  let min = 0.01;
  return Math.min(max, Math.max(min, new_zoom));
}

export function zoomCenter(scene, sign) {
  let indexes = scene.active;
  for (let i of indexes) {
    let zoom = scene.cameras[i][2];
    let new_cam;
    if (sign === 1) {
      new_cam = scene.cameras[i][2] * zoom_scaler;
    } else {
      new_cam = scene.cameras[i][2] / zoom_scaler;
    }
    let new_zoom = zoomLimit(new_cam);
    if (new_zoom > zoom || new_zoom < zoom) {
      if (scene.zoom_mode === "canvas") {
        let projected = castRay(
          scene,
          i,
          [scene.width / 2, scene.height / 2],
          new_zoom
        );
        scene.cameras[i] = [...projected, new_zoom];
      } else if (scene.zoom_mode === "active") {
        // TODO figure out if this is what you sant
        let viewport = scene.viewports[scene.active];
        let projected = castRay(
          scene,
          i,
          [viewport[0] + viewport[2] / 2, viewport[1] + viewport[3] / 2],
          new_zoom
        );
        scene.cameras[i] = [...projected, new_zoom];
      } else if (scene.zoom_mode === "every") {
        scene.cameras[i][2] = new_zoom;
      }
    }
  }
}

export function getNormalizedZ(scene, index, world_z) {
  let projected = multiplyPoint(scene.view_projections[index], [
    0,
    0,
    world_z,
    1,
  ]);
  let ndz = projected[2] / projected[3];
  return ndz;
}

export function shake(scene) {
  let indexes = scene.active;
  for (let i = 0; i < indexes.length; i++) {
    let index = indexes[i];
    let camera = scene.cameras[index];
    let nx = getWorldFromPx(scene, 16, camera[2]);
    let dx = 1 - 2 * Math.random();
    let dy = 1 - 2 * Math.random();
    scene.cameras[index][0] += dx * nx;
    scene.cameras[index][1] += dy * nx;
  }
}

export function viewportCenter(scene) {
  let indexes = scene.active;
  for (let index of indexes) {
    scene.cameras[index][0] = 0;
    scene.cameras[index][1] = 0;
  }
}

export function minMaxOrder(v1, v2) {
  let min = Math.min(v1, v2);
  let max = Math.max(v1, v2);
  return [min, max];
}

export function moveGroupWithFocus(group_selected, mactive, cols, rows) {
  let x1 = group_selected[0] % cols;
  let y1 = Math.floor(group_selected[0] / cols);
  let x2 = group_selected[1] % cols;
  let y2 = Math.floor(group_selected[1] / cols);
  let mx = mactive % cols;
  let my = Math.floor(mactive / cols);
  let start_col = x1;
  let start_row = y1;
  let end_col = x2;
  let end_row = y2;
  let w = x2 - x1;
  let h = y2 - y1;
  if (mx < x1) {
    start_col = mx;
    end_col = start_col + w;
  } else if (mx > x2) {
    end_col = mx;
    start_col = end_col - w;
  }
  if (my < y1) {
    start_row = my;
    end_row = start_row + h;
  } else if (my > y2) {
    end_row = my;
    start_row = end_row - h;
  }
  let g1 = start_row * cols + start_col;
  let g2 = end_row * rows + end_col;
  return [g1, g2];
}

export function resizeGroupWithFocus(group_selected, mactive, cols, rows) {
  let x1 = group_selected[0] % cols;
  let y1 = Math.floor(group_selected[0] / cols);
  let x2 = group_selected[1] % cols;
  let y2 = Math.floor(group_selected[1] / cols);
  let mx = mactive % cols;
  let my = Math.floor(mactive / cols);
  let start_col = x1;
  let start_row = y1;
  let end_col = x2;
  let end_row = y2;
  let w = x2 - x1;
  let h = y2 - y1;
  if (mx < x1) {
    start_col = mx;
  } else if (mx > x2) {
    end_col = mx;
  }
  if (my < y1) {
    start_row = my;
  } else if (my > y2) {
    end_row = my;
  }
  let g1 = start_row * cols + start_col;
  let g2 = end_row * cols + end_col;
  return [g1, g2];
}

export function resizeRelative(group_selected, cols, rows, dx, dy) {
  let x1 = group_selected[0] % cols;
  let y1 = Math.floor(group_selected[0] / cols);
  let x2 = group_selected[1] % cols;
  let y2 = Math.floor(group_selected[1] / cols);
  let end_col = Math.min(cols - 1, Math.max(x1, x2 + dx));
  let end_row = Math.min(rows - 1, Math.max(y1, y2 + dy));
  return end_row * cols + end_col;
}

export function confineActive(group_selected, mactive, cols, rows) {
  let x1 = group_selected[0] % cols;
  let y1 = Math.floor(group_selected[0] / cols);
  let x2 = group_selected[1] % cols;
  let y2 = Math.floor(group_selected[1] / cols);
  let mx = mactive % cols;
  let my = Math.floor(mactive / cols);
  if (mx < x1) {
    mx = x1;
  } else if (mx > x2) {
    mx = x2;
  }
  if (my < y1) {
    my = y1;
  } else if (my > y2) {
    my = y2;
  }
  return my * cols + mx;
}

export function getGroupIndexes(group, cols, rows) {
  let x1 = group[0] % cols;
  let y1 = Math.floor(group[0] / cols);
  let x2 = group[1] % cols;
  let y2 = Math.floor(group[1] / cols);
  let indexes = [];
  for (let r = 0; r < y2 - y1; r++) {
    for (let c = 0; c < x2 - x1; c++) {
      indexes.push(r * cols + c);
    }
  }
  return indexes;
}

export function push(scene) {
  let group = scene.active;
  let [x1, y1, x2, y2] = getVertices(scene.group, scene.cols, scene.rows);
  let c1 = x1 + (x2 - x1 + 1) / 2;
  let c2 = y1 + (y2 - y1 + 1) / 2;
  for (let index of group) {
    let c = (index % scene.cols) + 0.5;
    let r = Math.floor(index / scene.cols) + 0.5;
    let dx = 0;
    let dy = 0;
    if (c1 < c) {
      dx = -1;
    } else if (c1 > c) {
      dx = 1;
    }
    if (c2 < r) {
      dy = -1;
    } else if (c2 > r) {
      dy = 1;
    }
    let camera = scene.cameras[index];
    let ndx = getWorldFromPx(scene, dx * 8, camera[2]);
    let ndy = getWorldFromPx(scene, dy * 8, camera[2]);
    scene.cameras[index][0] += ndx;
    scene.cameras[index][1] += ndy;
  }
}

export function pull(scene) {
  let group = scene.active;
  let [x1, y1, x2, y2] = getVertices(scene.group, scene.cols, scene.rows);
  let c1 = x1 + (x2 - x1 + 1) / 2;
  let c2 = y1 + (y2 - y1 + 1) / 2;
  for (let index of group) {
    let c = (index % scene.cols) + 0.5;
    let r = Math.floor(index / scene.cols) + 0.5;
    let dx = 0;
    let dy = 0;
    if (c1 < c) {
      dx = 1;
    } else if (c1 > c) {
      dx = -1;
    }
    if (c2 < r) {
      dy = 1;
    } else if (c2 > r) {
      dy = -1;
    }
    let camera = scene.cameras[index];
    let ndx = getWorldFromPx(scene, dx * 8, camera[2]);
    let ndy = getWorldFromPx(scene, dy * 8, camera[2]);
    scene.cameras[index][0] += ndx;
    scene.cameras[index][1] += ndy;
  }
}

export function resetZoom(scene) {
  let group = scene.active;
  for (let index of group) {
    scene.cameras[index][2] = start_zoom;
  }
}

export function copy(scene) {
  let group = scene.active;
  let copy_array = [];
  for (let index of group) {
    let camera = scene.cameras[index];
    let image = scene.viewport_image_map[index];
    let container = [camera, image];
    copy_array.push(container);
  }
  scene.copy_buffer = copy_array;
}

export function paste(scene) {
  let buffer = scene.copy_buffer;
  let group = scene.active;
  if (buffer !== null) {
    let i = 0;
    for (let copy of buffer) {
      let [camera, image] = JSON.parse(JSON.stringify(copy));
      if (group[i] !== undefined) {
        let index = group[i];
        scene.cameras[index] = camera;
        scene.viewport_image_map[index] = image;
      }
      i++;
    }
  }
}

export function moveVertices(v, dx, dy) {
  v[0] += dx;
  v[1] += dy;
  v[2] += dx;
  v[3] += dy;
  return v;
}

export function getVertices(group, cols, rows) {
  let x1 = group[0] % cols;
  let y1 = Math.floor(group[0] / cols);
  let x2 = group[1] % cols;
  let y2 = Math.floor(group[1] / cols);
  let gx1 = Math.min(x1, x2);
  let gy1 = Math.min(y1, y2);
  let gx2 = Math.max(x1, x2);
  let gy2 = Math.max(y1, y2);
  return [gx1, gy1, gx2, gy2];
}

export function getIndexes(v, cols, rows) {
  let [gx1, gy1, gx2, gy2] = v;
  let i1 = gy1 * cols + gx1;
  let i2 = gy2 * cols + gx2;
  return [i1, i2];
}

export function confineVertices(v, cols, rows) {
  let [x1, y1, x2, y2] = v;
  if (x1 < 0) {
    let diff = -x1;
    x1 += diff;
    x2 += diff;
  }
  if (x2 > cols - 1) {
    let diff = x2 - (cols - 1);
    x1 -= diff;
    x2 -= diff;
  }
  // too wide
  if (x1 < 0) {
    x1 = 0;
  }
  if (y1 < 0) {
    let diff = -y1;
    y1 += diff;
    y2 += diff;
  }
  if (y2 > rows - 1) {
    let diff = y2 - (rows - 1);
    y1 -= diff;
    y2 -= diff;
  }
  // too tall
  if (y1 < 0) {
    y1 = 0;
  }
  return [x1, y1, x2, y2];
}

export function moveRelative(group, cols, rows, dx, dy) {
  let v = moveVertices(getVertices(group, cols, rows), dx, dy);
  v = confineVertices(v, cols, rows);
  return getIndexes(v, cols, rows);
}

export function confineToCanvas(group, cols, rows) {
  let v = getVertices(group, cols, rows);
  v = confineVertices(v, cols, rows);
  return getIndexes(v, cols, rows);
}

export function moveAbsolute(group, cols, rows, index) {
  let [x1, y1, x2, y2] = getVertices(group, cols, rows);
  let w = x2 - x1;
  let h = y2 - y1;
  let xoff1 = Math.floor(w / 2);
  let xoff2 = w - xoff1;
  let yoff1 = Math.floor(h / 2);
  let yoff2 = h - yoff1;
  let tar = getVertices([index, index], cols, rows);
  let nx1 = tar[0] - xoff1;
  let nx2 = tar[0] + xoff2;
  let ny1 = tar[1] - yoff1;
  let ny2 = tar[1] + yoff2;
  let v = confineVertices([nx1, ny1, nx2, ny2], cols, rows);
  return getIndexes(v, cols, rows);
}

export function addSceneCol(scene, col) {
  let $render = scene.$render;
  let copied = [];
  for (let r = 0; r < scene.rows; r++) {
    let index = r * scene.cols + col;
    let camera = scene.cameras[index];
    let image = scene.viewport_image_map[index];
    let container = [camera, image];
    copied.push(container);
  }
  scene.cols += 1;
  setViewports(scene, $render, scene.cols, scene.rows);
  for (let r = 0; r < scene.rows; r++) {
    let copy = JSON.parse(JSON.stringify(copied[r]));
    let index = r * scene.cols + col;
    scene.viewport_image_map.splice(index, 0, copy[1]);
    scene.cameras.splice(index, 0, copy[0]);
    scene.views.splice(index, 0, []);
    scene.view_projections.splice(index, 0, []);
    scene.inverse_view_projections.splice(index, 0, []);
  }
}

export function addSceneRow(scene, row) {
  let $render = scene.$render;
  let copied = [];
  for (let c = 0; c < scene.cols; c++) {
    let index = row * scene.cols + c;
    let camera = scene.cameras[index];
    let image = scene.viewport_image_map[index];
    let container = [camera, image];
    copied.push(container);
  }
  scene.rows += 1;
  setViewports(scene, $render, scene.cols, scene.rows);
  for (let c = 0; c < scene.cols; c++) {
    let copy = JSON.parse(JSON.stringify(copied[c]));
    let index = row * scene.cols + c;
    scene.viewport_image_map.splice(index, 0, copy[1]);
    scene.cameras.splice(index, 0, copy[0]);
    scene.views.splice(index, 0, []);
    scene.view_projections.splice(index, 0, []);
    scene.inverse_view_projections.splice(index, 0, []);
  }
}

export function remSceneCol(scene, col) {
  let $render = scene.$render;
  scene.cols -= 1;
  setViewports(scene, $render, scene.cols, scene.rows);
  for (let r = 0; r < scene.rows; r++) {
    let index = r * scene.cols + col;
    scene.viewport_image_map.splice(index, 1);
    scene.cameras.splice(index, 1);
    scene.views.splice(index, 1);
    scene.view_projections.splice(index, 1);
    scene.inverse_view_projections.splice(index, 1);
  }
}

export function remSceneRow(scene, row) {
  let $render = scene.$render;
  scene.rows -= 1;
  setViewports(scene, $render, scene.cols, scene.rows);
  for (let c = 0; c < scene.cols; c++) {
    // index is different bc it is chopping one each time
    let index = row * scene.cols;
    scene.viewport_image_map.splice(index, 1);
    scene.cameras.splice(index, 1);
    scene.views.splice(index, 1);
    scene.view_projections.splice(index, 1);
    scene.inverse_view_projections.splice(index, 1);
  }
}
