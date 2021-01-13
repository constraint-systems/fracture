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

let id_counter = 0;
export function getID() {
  id_counter++;
  return id_counter;
}

function Root() {
  let scene_ref = useRef({
    viewports: [],
    projection: [],
    inverse_projection: [],
    views: [],
    view_projections: [],
    inverse_view_projections: [],
    image_map: [],
    image_draws: [],
    capture: false,
  });
  let input_ref = useRef(null);
  let scroll_ref = useRef(null);

  return (
    <RecoilRoot>
      <RecoilUndoRoot trackingByDefault={false}>
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          ref={input_ref}
        />
        <SizeObserver />
        <div style={{ position: "relative", marginLeft: 4, marginTop: 4 }}>
          <Canvas scroll_ref={scroll_ref} scene_ref={scene_ref} />
          <Layers />
        </div>
        <Actions scene_ref={scene_ref} input_ref={input_ref} />
        <Keyboard scene_ref={scene_ref} input_ref={input_ref} />
      </RecoilUndoRoot>
    </RecoilRoot>
  );
}

export default Root;

function Actions({ input_ref, scene_ref }) {
  let [w, h] = useRecoilValue(aSize);
  return w < mobile ? (
    <Sidebar mobile={true} scene_ref={scene_ref} input_ref={input_ref} />
  ) : (
    <Sidebar scene_ref={scene_ref} input_ref={input_ref} />
  );
}

function Layers() {
  let showPreview = useRecoilValue(aShowPreview);
  let showCameras = useRecoilValue(aShowCameras);
  let showGrid = useRecoilValue(aShowGrid);
  let mode = useRecoilValue(aMode);
  return (
    <React.Fragment>
      {showPreview ? null : showCameras ? <ShowCameras /> : null}
      {showPreview ? null : showGrid ? <ShowGrid /> : null}
      {showPreview || mode === "canvasResize" ? null : <ShowActive />}
      {mode === "canvasResize" ? <CanvasResize /> : null}
    </React.Fragment>
  );
}

function SizeObserver() {
  let setSize = useSetRecoilState(aSize);
  let setGridSize = useSetRecoilState(aGridSize);
  let barHeight = useRecoilValue(aBarHeight);
  let sidebarWidth = useRecoilValue(aSidebarWidth);

  useEffect(() => {
    function setNewSize() {
      let w = window.innerWidth;
      let h = window.innerHeight;
      setSize([w, h]);
      if (w < mobile) {
        setGridSize([w - 8, h - 48 * 6 - 8]);
      } else {
        setGridSize([w - sidebarWidth - 8, h - barHeight - 12]);
      }
    }
    // setSize([4000 - sidebarWidth - 8, 4000 - barHeight - 12]);
    // setGridSize([4000 - sidebarWidth - 8, 4000 - barHeight - 12]);
    setNewSize();
    window.addEventListener("resize", setNewSize);
    return () => {
      window.removeEventListener("resize", setNewSize);
    };
  }, [setSize, setGridSize]);

  return null;
}

function CanvasResize() {
  let cols = useRecoilValue(aCols);
  let rows = useRecoilValue(aRows);
  let viewports = useRecoilValue(sViewports);

  let v = viewports[0];
  return (
    <div
      className="active-outline resize-canvas"
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: cols * v[2],
        height: rows * v[3],
        pointerEvents: "none",
        touchEvents: "none",
      }}
    ></div>
  );
}

function ShowActive() {
  let active = useRecoilValue(aActive);
  let viewports = useRecoilValue(sViewports);
  let mode = useRecoilValue(aMode);

  let v = viewports[0];
  return (
    <div
      className="active-outline"
      style={{
        position: "absolute",
        left: active[0] * v[2],
        top: active[1] * v[3],
        width: active[2] * v[2],
        height: active[3] * v[3],
        pointerEvents: "none",
        touchEvents: "none",
      }}
    >
      {mode === "resize" ? (
        <Fragment>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              background: "#111",
              width: 17,
              height: 17,
              borderBottom: "solid 1px white",
              borderRight: "solid 1px white",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              right: 0,
              bottom: 0,
              background: "#111",
              width: 17,
              height: 17,
              borderTop: "solid 1px white",
              borderLeft: "solid 1px white",
            }}
          ></div>
        </Fragment>
      ) : null}
    </div>
  );
}

function ShowCameras() {
  let viewports = useRecoilValue(sViewports);
  let camera_ids = useRecoilValue(aCameras);

  return viewports.map((camera, i) => {
    let v = viewports[i];
    let id = camera_ids[i];
    return (
      <div
        key={`camera${i}`}
        style={{
          position: "absolute",
          left: v[0],
          top: v[1],
          width: v[2],
          height: v[3],
          pointerEvents: "none",
          touchEvents: "none",
        }}
      >
        <CameraRead id={id} />
      </div>
    );
  });
}

function ShowGrid() {
  let [width, height] = useRecoilValue(aGridSize);
  let cols = useRecoilValue(aCols);
  let rows = useRecoilValue(aRows);
  let showPreview = useRecoilValue(aShowPreview);
  let vw = Math.floor(width / cols);
  let vh = Math.floor(height / rows);
  let crop_width = vw * cols;
  let crop_height = vh * rows;
  let bl = 160;
  return (
    <div>
      {cols > 0
        ? [...Array(cols - 1)].map((_, c) => {
            return (
              <React.Fragment key={`colback_${c}`}>
                <div
                  style={{
                    pointerEvents: "none",
                    touchEvents: "none",
                    position: "absolute",
                    left: (c + 1) * vw - 1.5,
                    top: 0,
                    width: 3,
                    height: crop_height,
                    background: "rgba(20,20,20,0.5)",
                  }}
                ></div>
                <div
                  style={{
                    pointerEvents: "none",
                    touchEvents: "none",
                    position: "absolute",
                    left: (c + 1) * vw - 0.5,
                    top: 0,
                    width: 1,
                    height: crop_height,
                    background: "rgba(" + [bl, bl, bl] + ",0.5)",
                  }}
                ></div>
              </React.Fragment>
            );
          })
        : null}

      {rows > 0
        ? [...Array(rows - 1)].map((_, r) => {
            return (
              <React.Fragment key={`rowback_${r}`}>
                <div
                  style={{
                    pointerEvents: "none",
                    touchEvents: "none",
                    position: "absolute",
                    left: 0,
                    top: (r + 1) * vh - 1.5,
                    height: 3,
                    width: crop_width,
                    background: "rgba(20,20,20,0.5)",
                  }}
                ></div>
                <div
                  style={{
                    pointerEvents: "none",
                    touchEvents: "none",
                    position: "absolute",
                    left: 0,
                    top: (r + 1) * vh - 0.5,
                    height: 1,
                    width: crop_width,
                    background: "rgba(" + [bl, bl, bl] + ",0.5)",
                  }}
                ></div>
              </React.Fragment>
            );
          })
        : null}
    </div>
  );
}

function CameraRead({ id }) {
  let camera = useRecoilValue(afCamera(id));
  return (
    <div
      className="outline-text"
      style={{
        position: "absolute",
        fontSize: 12,
        left: 0,
        bottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        color: "#eee",
        userSelect: "none",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {camera
        .map((v) => Math.round((v + Number.EPSILON) * 100) / 100)
        .join(",")}
    </div>
  );
}

export function loadImage(scene, src, addImage, presetImageMap, callback) {
  let $img = new Image();
  $img.onload = function () {
    // might be a race condition
    scene.pixel = getWorldFromPx(scene, 1, base_zoom);
    let w = $img.width * scene.pixel;
    let h = $img.height * scene.pixel;
    let x0 = -w / 2;
    let y0 = h / 2;
    let x1 = w / 2;
    let y1 = -h / 2;
    let place = [x0, y0, x1, y1];
    addImage($img);
    let drawImage = initImageQuad(scene, $img, ...place);
    scene.image_draws.push(drawImage);
    if (presetImageMap !== undefined) presetImageMap();
    if (callback !== undefined) {
      callback();
    }
  };
  $img.src = src;
}

export function domLoadImage(scene, input, addImage, presetImageMap) {
  function handleChange(e) {
    for (let item of this.files) {
      if (item.type.indexOf("image") < 0) {
        continue;
      }
      let src = URL.createObjectURL(item);
      loadImage(scene, src, addImage, presetImageMap);
      input.value = null;
    }
    input.removeEventListener("change", handleChange);
  }
  input.addEventListener("change", handleChange);

  input.dispatchEvent(
    new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window,
    })
  );
}

function Canvas({ scene_ref, scroll_ref }) {
  let gridSize = useRecoilValue(aGridSize);
  let viewports = useRecoilValue(sViewports);
  let cols = useRecoilValue(aCols);
  let rows = useRecoilValue(aRows);
  let sidebarWidth = useRecoilValue(aSidebarWidth);
  let allCameras = useRecoilValue(sAllCameras);
  let images = useRecoilValue(aImages);
  let barHeight = useRecoilValue(aBarHeight);
  let addImage = useSetRecoilState(sAddImage);
  let [imageMap, rawSetImageMap] = useRecoilState(aImageMap);
  let setImageMap = useSetRecoilState(sSetImageMap);
  let mosaicCamera = useSetRecoilState(sMosaicCamera);
  let [cameras, setCameras] = useRecoilState(aCameras);
  let canvas_ref = useRef(null);
  let regl_ref = useRef(null);
  let size = useRecoilValue(aSize);
  let [loaded, setLoaded] = useState(false);
  const { getIsTrackingHistory, setIsTrackingHistory } = useIsTrackingHistory();

  useEffect(() => {
    if (gridSize[0] !== null && !loaded) {
      let regl = REGL(canvas_ref.current);
      regl_ref.current = regl;
      let scene = scene_ref.current;
      scene.regl = regl;

      // init cameras and scene arrays
      let camera_ids = [];
      for (let i = 0; i < cols * rows; i++) {
        let id = getID();
        camera_ids.push(id);
        scene.views.push([]);
        scene.view_projections.push([]);
        scene.inverse_view_projections.push([]);
        scene.image_map.push(null);
      }
      setCameras(camera_ids);
      scene.cameras = [...Array(cols * rows)].map((v) => [0, 0, 5]);

      rawSetImageMap([...Array(cols * rows)].map((v) => null));

      setScene();

      loadImage(
        scene,
        process.env.PUBLIC_URL + "/images/ozymandias-screens-watchmen.jpg",
        addImage,
        setImageMap.bind(null, { active: [0, 0, cols, rows] }),
        () => {
          mosaicCamera({ scene, active: [0, 0, cols, rows] });
          setIsTrackingHistory(true);
        }
      );

      let gl = canvas_ref.current.getContext("webgl");
      gl.enable(gl.SCISSOR_TEST);

      regl.frame(({ tick }) => {
        regl.clear({
          color: [0, 0, 0, 1],
        });
        if (scene.viewports.length > 0) {
          let vy_offset =
            scene.gridSize[1] - scene.viewports[0][3] * scene.rows;
          for (let i = 0; i < scene.viewports.length; i++) {
            let viewport = scene.viewports[i];
            let [vx, vy, vw, vh] = viewport;
            // gap at bottom instead of top
            vy = vy + vy_offset;
            gl.viewport(vx, vy, vw, vh);
            gl.scissor(vx, vy, vw, vh);
            regl.clear({
              color: [0, 0, 0, 1],
            });
            if (scene.image_map.length > 0 && scene.image_map[i] !== null) {
              let draw = scene.image_draws[scene.image_map[i]];
              draw({
                view_projection: scene.view_projections[i],
              });
            }
          }
        }

        if (scene.capture) {
          scene.capture = false;
          let save_canvas = document.createElement("canvas");
          save_canvas.width = scene.viewports[0][2] * scene.cols;
          save_canvas.height = scene.viewports[0][3] * scene.rows;
          let sx = save_canvas.getContext("2d");
          sx.drawImage(gl.canvas, 0, 0);
          let link = document.createElement("a");
          save_canvas.toBlob(function (blob) {
            link.setAttribute(
              "download",
              "fracture-" + Math.round(new Date().getTime() / 1000) + ".png"
            );
            link.setAttribute("href", URL.createObjectURL(blob));
            link.dispatchEvent(
              new MouseEvent(`click`, {
                bubbles: true,
                cancelable: true,
                view: window,
              })
            );
          });
        }
      });
      setLoaded(true);
    }
  }, [gridSize, loaded]);

  useEffect(() => {
    if (loaded) {
      let scene = scene_ref.current;
      scene.image_map = imageMap;
    }
  }, [loaded, imageMap]);

  function setScene() {
    let scene = scene_ref.current;

    let rawCameras = allCameras.slice();
    let invertedCameras = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let index = r * cols + c;
        let invert_row = rows - 1 - Math.floor(index / cols);
        let inverted = invert_row * cols + (index % cols);
        invertedCameras.push(rawCameras[inverted]);
      }
    }

    scene.cameras = invertedCameras;
    scene.gridSize = gridSize;
    scene.cols = cols;
    scene.rows = rows;
    scene.viewports = viewports;

    setProjectionMatrices(scene);

    scene.views = [];
    scene.view_projections = [];
    scene.inverse_view_projections = [];
    for (let i = 0; i < cols * rows; i++) {
      scene.views.push([]);
      scene.view_projections.push([]);
      scene.inverse_view_projections.push([]);
    }
    setViewMatrices(scene);
  }

  useEffect(() => {
    if (loaded) {
      setScene();
    }
  }, [loaded, cols, rows, gridSize, viewports, cameras]);

  return gridSize[0] !== null ? (
    <div
      ref={scroll_ref}
      style={{
        width: gridSize[0] + (size[0] > mobile ? sidebarWidth : 0) + 4,
        height: gridSize[1] + (size[0] > mobile ? barHeight + 8 : 4),
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <canvas width={gridSize[0]} height={gridSize[1]} ref={canvas_ref}>
        {cameras.map((id, index) => (
          <CanvasCamera key={id} id={id} index={index} scene_ref={scene_ref} />
        ))}
        <Mouse
          canvas_ref={canvas_ref}
          scene_ref={scene_ref}
          scroll_ref={scroll_ref}
        />
      </canvas>
    </div>
  ) : null;
}

function CanvasCamera({ id, index, scene_ref }) {
  let camera = useRecoilValue(afCamera(id));

  useEffect(() => {
    let scene = scene_ref.current;

    let invert_row = scene.rows - 1 - Math.floor(index / scene.cols);
    let inverted = invert_row * scene.cols + (index % scene.cols);

    scene.cameras[inverted] = camera;
    setViewMatrix(scene, inverted);
  }, [id, index, camera, scene_ref]);

  return null;
}

function ReadActive() {
  let [x, y, w, h] = useRecoilValue(aActive);
  let [gw, gh] = useRecoilValue(aGridSize);
  let size = useRecoilValue(aSize);
  let mode = useRecoilValue(aMode);
  return size[0] > mobile ? (
    <div style={{ position: "fixed", left: 0, bottom: 0, display: "flex" }}>
      {mode === "canvasResize" ? (
        <div style={{ background: "#111", padding: 8 }}>
          {gw}x{gh}
        </div>
      ) : (
        <div style={{ background: "#111", padding: 8 }}>
          □ {x},{y} {w}x{h}
        </div>
      )}
    </div>
  ) : null;
}
