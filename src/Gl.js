import REGL from "regl";

export function draw(regl) {
  return regl({
    frag: `
    precision mediump float;
    uniform vec4 color;
    void main() {
      gl_FragColor = color;
    }`,

    vert: `
    precision mediump float;
    attribute vec2 position;
    uniform float angle;
    void main() {
      gl_Position = vec4(
        cos(angle) * position.x + sin(angle) * position.y,
        -sin(angle) * position.x + cos(angle) * position.y, 0, 1);
    }`,

    attributes: {
      position: [-1, 0, 0, -1, 1, 1],
    },

    uniforms: {
      color: regl.prop("color"),
      angle: ({ tick }) => 0.01 * tick,
    },

    depth: {
      enable: false,
    },

    count: 3,
  });
}
