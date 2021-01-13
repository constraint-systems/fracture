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
import Examples from "./Examples";

function Heading(props) {
  return (
    <div className="heading" style={{ marginBottom: 8 }}>
      {props.children.toUpperCase()}
    </div>
  );
}

export function Info(props) {
  return <div style={{ marginBottom: 8 }}>{props.children}</div>;
}

export function Tip(props) {
  return <div style={{ marginBottom: 8, color: "#aaa" }}>{props.children}</div>;
}

export function Spacer() {
  return <div style={{ width: "100%", height: 8 }}></div>;
}

export function HSpacer() {
  return <div style={{ width: "100%", height: 4 }}></div>;
}

function Sidebar({ scene_ref, input_ref, mobile }) {
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
  let sidebarScrollRef = useRef(null);

  let resize = mode === "resize";
  let scene = scene_ref.current;
  let input = input_ref.current;

  let reg_style = {
    position: "fixed",
    right: 0,
    height: "100%",
    top: 0,
    width: sidebarWidth,
    overflow: "auto",
    background: "#222",
    userSelect: "none",
  };
  let mobile_style = {
    position: "fixed",
    left: 0,
    bottom: 0,
    height: 48 * 6,
    overflow: "auto",
    background: "#222",
    userSelect: "none",
  };

  useEffect(() => {
    if (sidebarScrollRef.current !== null) {
      // put it here
      sidebarScrollRef.current.scrollTo(0, 0);
    }
  }, [mode, sidebarScrollRef]);

  return (
    <div ref={sidebarScrollRef} style={mobile ? mobile_style : reg_style}>
      <div
        style={{
          padding: 16,
          userSelect: "none",
        }}
      >
        {resize ? (
          <div>
            <Heading>Resize selection mode</Heading>
            <div>
              <ToggleKeyButton
                text="Resize selection"
                keyname="r"
                compare={resize}
                click={setMode.bind(null, "normal")}
              />
            </div>
            <Info>Click and drag cells or use</Info>
            <div>
              <TwoKeyButton
                text="narrower"
                keyname1="←"
                keyname2="h"
                click={resizeActive.bind(null, [-1, 0])}
              />
            </div>
            <div>
              <TwoKeyButton
                text="wider"
                keyname1="→"
                keyname2="l"
                click={resizeActive.bind(null, [-1, 0])}
              />
            </div>
            <div>
              <TwoKeyButton
                text="shorter"
                keyname1="↑"
                keyname2="k"
                click={resizeActive.bind(null, [0, -1])}
              />
            </div>
            <div>
              <TwoKeyButton
                text="taller"
                keyname1="↓"
                keyname2="j"
                click={resizeActive.bind(null, [0, 1])}
              />
            </div>
            <Info>Finish</Info>
            <div>
              <KeyButton
                text="End resize"
                keyname="enter"
                click={setMode.bind(null, "normal")}
              />
            </div>
            <Tip>
              <div>TIP:</div>When resizing with the keyboard controls, the top
              left corner of the selection is locked to its position.
            </Tip>
          </div>
        ) : mode === "canvasResize" ? (
          <div>
            <Heading>Resize Canvas</Heading>
            <ToggleKeyButton
              text="Resize canvas"
              keyname="x"
              compare={mode === "canvasResize"}
              click={setMode.bind(null, "normal")}
            />
            <div>
              <TwoKeyButton
                text="narrower"
                keyname1="←"
                keyname2="h"
                click={setGridSize.bind(null, [-1, 0])}
              />
            </div>
            <div>
              <TwoKeyButton
                text="wider"
                keyname1="→"
                keyname2="l"
                click={setGridSize.bind(null, [1, 0])}
              />
            </div>
            <div>
              <TwoKeyButton
                text="shorter"
                keyname1="↑"
                keyname2="k"
                click={setGridSize.bind(null, [0, -1])}
              />
            </div>
            <div>
              <TwoKeyButton
                text="taller"
                keyname1="↓"
                keyname2="j"
                click={setGridSize.bind(null, [0, 1])}
              />
            </div>
            <Info>Finish</Info>
            <div>
              <KeyButton
                text="End resize"
                keyname="enter"
                click={setMode.bind(null, "normal")}
              />
            </div>
            <HSpacer />
            <Info>
              Need to scroll the canvas? Hold Ctrl and click and drag, or use:
            </Info>
            <div>
              <TwoKeyButton
                text=""
                keyname1="Ctrl+←"
                keyname2="Ctrl+h"
                click={window.scrollBy.bind(null, -16, 0)}
              />
              <TwoKeyButton
                text=""
                keyname1="Ctrl+→"
                keyname2="Ctrl+l"
                click={window.scrollBy.bind(null, 16, 0)}
              />
              <TwoKeyButton
                text=""
                keyname1="Ctrl+↑"
                keyname2="Ctrl+k"
                click={window.scrollBy.bind(null, 0, -16)}
              />
              <TwoKeyButton
                text=""
                keyname1="Ctrl+↓"
                keyname2="Ctrl+j"
                click={window.scrollBy.bind(null, 0, 16)}
              />
            </div>
          </div>
        ) : (
          <div>
            <Info>Shatter and recombine images using a grid of viewports</Info>
            <HSpacer />
            <Heading>Examples</Heading>
            <Examples />
            <HSpacer />
            <Heading>Select</Heading>
            <div>
              <Info>Click a cell or move with</Info>
              <KeyButton
                text="←"
                keyname="h"
                click={moveActive.bind(null, [-1, 0])}
              />
              <KeyButton
                text="↓"
                keyname="j"
                click={moveActive.bind(null, [0, 1])}
              />
              <KeyButton
                text="↑"
                keyname="k"
                click={moveActive.bind(null, [0, -1])}
              />
              <KeyButton
                text="→"
                keyname="l"
                click={moveActive.bind(null, [1, 0])}
              />
            </div>
            <Info>Change selection size</Info>
            <div>
              <ToggleKeyButton
                text="Resize selection"
                keyname="r"
                compare={resize}
                click={setMode.bind(null, "resize")}
              />
              <div>
                <KeyButton text="Select all" keyname="a" click={selectAll} />
                <KeyButton text="Clear" keyname="escape" click={activeEscape} />
              </div>
            </div>
            <HSpacer />
            <Heading>Pan</Heading>
            <Info>Click and drag or use</Info>
            <div>
              <KeyButton
                text=""
                keyname="←"
                click={panCamera.bind(null, { scene, diff: [1, 0] })}
              />
              <KeyButton
                text=""
                keyname="↓"
                click={panCamera.bind(null, { scene, diff: [0, 1] })}
              />
              <KeyButton
                text=""
                keyname="↑"
                click={panCamera.bind(null, { scene, diff: [0, -1] })}
              />
              <KeyButton
                text=""
                keyname="→"
                click={panCamera.bind(null, { scene, diff: [-1, 0] })}
              />
            </div>
            <HSpacer />
            <Heading>Zoom</Heading>
            <Info>Scroll or use</Info>
            <div>
              <KeyButton
                text="In"
                keyname="+"
                click={zoomCamera.bind(null, { scene, sign: -1, mult: 1.125 })}
              />
              <KeyButton
                text="Out"
                keyname="-"
                click={zoomCamera.bind(null, { scene, sign: 1, mult: 1.125 })}
              />
            </div>
            <Info>Zoom center</Info>
            <div>
              <ToggleKeyButton
                text="Canvas"
                keyname="s"
                compare={zoomMode === "canvas"}
                click={setZoomMode.bind(null, "canvas")}
              />
              <ToggleKeyButton
                text="Individual"
                keyname="i"
                compare={zoomMode === "individual"}
                click={setZoomMode.bind(null, "individual")}
              />
              <ToggleKeyButton
                text="Active"
                keyname="t"
                compare={zoomMode === "active"}
                click={setZoomMode.bind(null, "active")}
              />
            </div>
            <HSpacer />
            <Heading>Load image to selection</Heading>
            <KeyButtonOnce
              text="Load image"
              keyname="o"
              click={domLoadImage.bind(
                null,
                scene,
                input,
                addImage,
                setImageMap.bind(null, {})
              )}
            />
            <Info>
              Or copy and paste an image
              <br />
              Or drag and drop an image file
            </Info>
            <HSpacer />
            <Heading>Copy/Paste</Heading>
            <HSpacer />
            <KeyButton text="Copy" keyname="c" click={copy} />
            <KeyButton text="Paste" keyname="v" click={paste} />
            <Heading>More actions</Heading>
            <KeyButton
              text="Shatter"
              keyname="e"
              click={shatterCamera.bind(null, { scene })}
            />
            <KeyButton
              text="Mosaic"
              keyname="m"
              click={mosaicCamera.bind(null, { scene })}
            />
            <KeyButton
              text="Shake"
              keyname="b"
              click={shakeCamera.bind(null, { scene })}
            />
            <KeyButton
              text="Push"
              keyname="u"
              click={pushCameras.bind(null, { scene })}
            />
            <KeyButton
              text="Pull"
              keyname="n"
              click={pullCameras.bind(null, { scene })}
            />
            <KeyButton
              text="Reset zoom"
              keyname="d"
              click={resetZoom.bind(null, scene)}
            />
            <HSpacer />
            <Heading>View</Heading>
            <ToggleKeyButton
              text="Preview"
              keyname="p"
              compare={showPreview}
              click={setShowPreview.bind(null, showPreview ? false : true)}
            />
            <ToggleKeyButton
              text="Show grid"
              keyname="g"
              compare={showGrid}
              disabled={showPreview ? true : false}
              click={setShowGrid.bind(null, showGrid ? false : true)}
            />
            <ToggleKeyButton
              text="Show camera info"
              keyname="f"
              disabled={showPreview ? true : false}
              compare={showCameras}
              click={setShowCameras.bind(null, showCameras ? false : true)}
            />
            <HSpacer />
            <Heading>Save Image</Heading>
            <HSpacer />
            <KeyButton
              text="Save image"
              keyname="w"
              click={() => {
                scene.capture = true;
              }}
            />
            <Heading>Undo/Redo</Heading>
            <HSpacer />
            <KeyButton text="Undo" keyname="z" click={undo} />
            <KeyButton text="Redo" keyname="y" click={redo} />
            <Heading>Change Grid</Heading>
            <HSpacer />
            <div>
              {`Cols: `}
              <KeyButton text="Remove" keyname="(" click={remCol} />
              <KeyButton text="Add" keyname=")" click={addCol} />
            </div>
            <div>
              {`Rows: `}
              <KeyButton text="Remove" keyname="[" click={remRow} />
              <KeyButton text="Add" keyname="]" click={addRow} />
            </div>
            <Heading>Resize Canvas</Heading>
            <ToggleKeyButton
              text="Resize canvas"
              keyname="x"
              compare={mode === "canvasResize"}
              click={setMode.bind(null, "canvasResize")}
            />
            <HSpacer />
            <Tip>Need to scroll the canvas? Hold Ctrl and click and drag.</Tip>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;

export function KeyButton(props) {
  let $button_ref = useRef(null);
  let { text, click, keyname } = props;
  window.intervalCheck = null;

  useEffect(() => {
    let $button = $button_ref.current;
    let time;
    function runInterval() {
      window.intervalCheck = setInterval(click, 60);
    }
    function pointerDown(e) {
      clearInterval(window.intervalCheck);
      time = setTimeout(runInterval, 250);
      click();
      $button.setPointerCapture(e.pointerId);
    }
    function pointerUp(e) {
      clearTimeout(time);
      clearInterval(window.intervalCheck);
      $button.releasePointerCapture(e.pointerId);
    }
    $button.addEventListener("pointerdown", pointerDown);
    $button.addEventListener("pointerup", pointerUp);
    return () => {
      $button.removeEventListener("pointerdown", pointerDown);
      $button.removeEventListener("pointerup", pointerUp);
    };
  }, []);

  return (
    <div ref={$button_ref} className="button" role="button">
      {text !== "" ? text + " " : ""}
      {keyname ? <span className="keyname">{keyname}</span> : ""}
    </div>
  );
}

export function KeyButtonOnce(props) {
  let $button_ref = useRef(null);
  let { text, click, keyname } = props;

  return (
    <div ref={$button_ref} className="button" role="button" onClick={click}>
      {text !== "" ? text + " " : ""}
      <span className="keyname">{keyname}</span>
    </div>
  );
}

export function TwoKeyButton(props) {
  let $button_ref = useRef(null);
  let { text, click, keyname1, keyname2 } = props;

  useEffect(() => {
    let $button = $button_ref.current;
    let time;
    let interval;
    function runInterval() {
      interval = setInterval(click, 60);
    }
    function pointerDown(e) {
      $button.setPointerCapture(e.pointerId);
      time = setTimeout(runInterval, 250);
      click();
    }
    function pointerUp(e) {
      $button.releasePointerCapture(e.pointerId);
      clearTimeout(time);
      clearInterval(interval);
    }
    $button.addEventListener("pointerdown", pointerDown);
    $button.addEventListener("pointerup", pointerUp);
    return () => {
      $button.removeEventListener("pointerdown", pointerDown);
      $button.removeEventListener("pointerup", pointerUp);
    };
  }, []);

  return (
    <div ref={$button_ref} className="button" role="button">
      {text !== "" ? text + " " : ""}
      <span className="keyname">{keyname1}</span>{" "}
      <span className="keytip">or</span>{" "}
      <span className="keyname">{keyname2}</span>
    </div>
  );
}

export function ToggleKeyButton(props) {
  let $button_ref = useRef(null);
  let { text, click, keyname, compare, disabled } = props;

  // toggle requires click every time TODO: switch to mousedown for consistent response?
  return (
    <div
      ref={$button_ref}
      className={`button toggle ${compare ? "active" : ""} ${
        disabled ? "disabled" : ""
      }`}
      role="button"
      onClick={click}
    >
      {text !== "" ? text + " " : ""}
      {keyname ? <span className="keyname">{keyname}</span> : null}
    </div>
  );
}
