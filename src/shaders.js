export function generateQuadPositions(x0, y0, x1, y1) {
  return [
    [x0, y0],
    [x1, y0],
    [x0, y1],
    [x0, y1],
    [x1, y0],
    [x1, y1],
  ];
}

export function initImageQuad(scene, $img, x0, y0, x1, y1) {
  let regl = scene.regl;
  return regl({
    frag: `
    precision mediump float;
    uniform vec4 color;
    uniform sampler2D texture;
    varying vec2 vuv;
    void main () {
      gl_FragColor = texture2D(texture, vuv);
    }`,
    vert: `
    precision mediump float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vuv;
    uniform mat4 view_projection;
    void main () {
      vuv = uv;
      gl_Position = view_projection * vec4(position, 0, 1);
    }`,
    attributes: {
      position: generateQuadPositions(x0, y0, x1, y1),
      uv: [
        [0, 0],
        [1, 0],
        [0, 1],
        [0, 1],
        [1, 0],
        [1, 1],
      ],
    },
    uniforms: {
      texture: regl.texture($img),
      color: [1, 1, 0, 1],
      view_projection: regl.prop("view_projection"),
    },
    count: 6,
  });
}
