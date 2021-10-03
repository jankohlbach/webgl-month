/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shaders/fragment.glsl":
/*!***********************************!*\
  !*** ./src/shaders/fragment.glsl ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"precision mediump float;\\n\\nvoid main() {\\n  gl_FragColor = vec4(1, 0, 0, 1);\\n}\\n\");\n\n//# sourceURL=webpack://webgl-month/./src/shaders/fragment.glsl?");

/***/ }),

/***/ "./src/shaders/vertex.glsl":
/*!*********************************!*\
  !*** ./src/shaders/vertex.glsl ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (\"attribute vec2 position;\\nuniform vec2 resolution;\\n\\n#define M_PI 3.1415926535897932384626433832795\\n\\nvoid main() {\\n  vec2 transformedPosition = position / resolution * 2.0 - 1.0;\\n  gl_PointSize = 2.0;\\n  gl_Position = vec4(transformedPosition, 0, 1);\\n}\\n\");\n\n//# sourceURL=webpack://webgl-month/./src/shaders/vertex.glsl?");

/***/ }),

/***/ "./src/shape-helpers.js":
/*!******************************!*\
  !*** ./src/shape-helpers.js ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"createRect\": () => (/* binding */ createRect),\n/* harmony export */   \"createHexagon\": () => (/* binding */ createHexagon)\n/* harmony export */ });\nfunction createRect(top, left, width, height) {\n  return [\n    left, top,\n    left + width, top,\n    left, top + height,\n    left + width, top + height,\n  ];\n}\n\nfunction createHexagon(centerX, centerY, radius, segmentsCount) {\n  const vertexData = [];\n  const segmentAngle =  Math.PI * 2 / segmentsCount;\n\n  for (let i = 0; i < Math.PI * 2; i += segmentAngle) {\n    const from = i;\n    const to = i + segmentAngle;\n\n    const color = rainbowColors[i / segmentAngle];\n\n    vertexData.push(centerX, centerY);\n    vertexData.push(...color);\n\n    vertexData.push(centerX + Math.cos(from) * radius, centerY + Math.sin(from) * radius);\n    vertexData.push(...color);\n\n    vertexData.push(centerX + Math.cos(to) * radius, centerY + Math.sin(to) * radius);\n    vertexData.push(...color);\n  }\n\n  return vertexData;\n}\n\n\n//# sourceURL=webpack://webgl-month/./src/shape-helpers.js?");

/***/ }),

/***/ "./src/week-1.js":
/*!***********************!*\
  !*** ./src/week-1.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _shaders_vertex_glsl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shaders/vertex.glsl */ \"./src/shaders/vertex.glsl\");\n/* harmony import */ var _shaders_fragment_glsl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shaders/fragment.glsl */ \"./src/shaders/fragment.glsl\");\n/* harmony import */ var _shape_helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shape-helpers */ \"./src/shape-helpers.js\");\n\n\n\n\n\nconst canvas = document.querySelector('canvas');\nconst gl = canvas.getContext('webgl');\n\nconst program = gl.createProgram();\n\nconst vertexShader = gl.createShader(gl.VERTEX_SHADER);\nconst fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);\n\nfunction compileShader(shader, source) {\n  gl.shaderSource(shader, source);\n  gl.compileShader(shader);\n\n  const log = gl.getShaderInfoLog(shader);\n\n  if (log) {\n    throw new Error(log);\n  }\n}\n\ncompileShader(vertexShader, _shaders_vertex_glsl__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\ncompileShader(fragmentShader, _shaders_fragment_glsl__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n\ngl.attachShader(program, vertexShader);\ngl.attachShader(program, fragmentShader);\n\ngl.linkProgram(program);\n\ngl.useProgram(program);\n\nconst positionAttributeLocation = gl.getAttribLocation(program, 'position');\n\nconst resolutionUniformLocation = gl.getUniformLocation(program, 'resolution');\n\ngl.uniform2fv(resolutionUniformLocation, [canvas.width, canvas.height]);\n\nconst triangles = (0,_shape_helpers__WEBPACK_IMPORTED_MODULE_2__.createRect)(0, 0, canvas.height, canvas.height);\n\nconst vertexData = new Float32Array(triangles);\nconst vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);\n\nconst indexBuffer = gl.createBuffer(gl.ARRAY_BUFFER);\n\nconst indexData = new Uint8Array([\n  0, 1, 2,\n  1, 2, 3,\n]);\n\ngl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);\ngl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);\n\ngl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);\ngl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);\n\nconst attributeSize = 2;\nconst type = gl.FLOAT;\nconst normalized = false;\nconst stride = 0;\nconst offset = 0;\n\ngl.enableVertexAttribArray(positionAttributeLocation);\ngl.vertexAttribPointer(positionAttributeLocation, attributeSize, type, normalized, stride, offset);\n\ngl.drawElements(gl.TRIANGLES, indexData.length, gl.UNSIGNED_BYTE, 0);\n\n\n//# sourceURL=webpack://webgl-month/./src/week-1.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/week-1.js");
/******/ 	
/******/ })()
;