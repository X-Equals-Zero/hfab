// webglScene.mjs
export function initializeWebGLScene() {
  // Get the WebGL canvas element
  const canvas = document.getElementById("webglCanvas");

  // Get the WebGL rendering context
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("WebGL is not supported by your browser.");
  }

  // Set the clear color and enable depth testing
  gl.clearColor(0.2, 0.3, 0.8, 1.0);
  gl.enable(gl.DEPTH_TEST);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
