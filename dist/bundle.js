/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/app/AppRoot.js"
/*!****************************!*\
  !*** ./src/app/AppRoot.js ***!
  \****************************/
() {

eval("{class AppRoot extends HTMLElement {\r\n  connectedCallback() {\r\n    this.innerHTML = `\r\n      <toolbar-panel></toolbar-panel>\r\n      <canvas-view style=\"flex:1;\"></canvas-view>\r\n    `;\r\n  }\r\n}\r\n\r\ncustomElements.define('app-root', AppRoot);\n\n//# sourceURL=webpack://polygon-editor/./src/app/AppRoot.js?\n}");

/***/ },

/***/ "./src/components/CanvasView.js"
/*!**************************************!*\
  !*** ./src/components/CanvasView.js ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state/store.js */ \"./src/state/store.js\");\n/* harmony import */ var _geometry_collision_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../geometry/collision.js */ \"./src/geometry/collision.js\");\n/* harmony import */ var _geometry_bounds_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../geometry/bounds.js */ \"./src/geometry/bounds.js\");\n\r\n\r\n\r\n\r\nclass CanvasView extends HTMLElement {\r\n  connectedCallback() {\r\n    this.style.display = \"block\";\r\n    this.style.flex = \"1\";\r\n    this.style.minHeight = \"0\";\r\n\r\n    this.canvas = document.createElement(\"canvas\");\r\n    this.canvas.style.width = \"100%\";\r\n    this.canvas.style.height = \"100%\";\r\n    this.canvas.style.display = \"block\";\r\n    this.canvas.style.cursor = \"default\";\r\n\r\n    this.appendChild(this.canvas);\r\n\r\n    this.ctx = this.canvas.getContext(\"2d\");\r\n\r\n    this.dragging = false;\r\n    this.lastPos = null;\r\n    this.dragStartPoints = null;\r\n\r\n    requestAnimationFrame(() => this.resize());\r\n    window.addEventListener(\"resize\", () => this.resize());\r\n\r\n    this.initEvents();\r\n\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.subscribe(() => this.render());\r\n  }\r\n\r\n  resize() {\r\n    this.canvas.width = this.clientWidth;\r\n    this.canvas.height = this.clientHeight;\r\n    this.canvas.style.background = \"#1a1a1a\";\r\n\r\n    this.render();\r\n  }\r\n\r\n  initEvents() {\r\n    this.canvas.addEventListener(\"mousedown\", (e) => this.onDown(e));\r\n    this.canvas.addEventListener(\"mousemove\", (e) => this.onMove(e));\r\n    window.addEventListener(\"mouseup\", () => this.onUp());\r\n  }\r\n\r\n  getMouse(e) {\r\n    const rect = this.canvas.getBoundingClientRect();\r\n    return {\r\n      x: e.clientX - rect.left,\r\n      y: e.clientY - rect.top,\r\n    };\r\n  }\r\n\r\n  onDown(e) {\r\n    const mouse = this.getMouse(e);\r\n\r\n    const found = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.find((p) =>\r\n      this.pointInPolygon(mouse, p.points)\r\n    );\r\n\r\n    if (found) {\r\n      _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.selectedId = found.id;\r\n\r\n      this.dragging = true;\r\n      this.lastPos = mouse;\r\n\r\n      this.dragStartPoints = found.points.map((p) => ({ ...p }));\r\n      this.canvas.style.cursor = \"grabbing\";\r\n    } else {\r\n      _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.selectedId = null;\r\n    }\r\n\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.notify();\r\n  }\r\n\r\n  onMove(e) {\r\n    const mouse = this.getMouse(e);\r\n\r\n    // 🔥 hover работает всегда\r\n    const hovering = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.some((p) =>\r\n      this.pointInPolygon(mouse, p.points)\r\n    );\r\n\r\n    if (!this.dragging) {\r\n      this.canvas.style.cursor = hovering ? \"grab\" : \"default\";\r\n      return;\r\n    }\r\n\r\n    let dx = mouse.x - this.lastPos.x;\r\n    let dy = mouse.y - this.lastPos.y;\r\n\r\n    const poly = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.find((p) => p.id === _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.selectedId);\r\n    if (!poly) return;\r\n\r\n    const clamped = (0,_geometry_bounds_js__WEBPACK_IMPORTED_MODULE_2__.clampMove)(\r\n      poly.points,\r\n      dx,\r\n      dy,\r\n      this.canvas.width,\r\n      this.canvas.height\r\n    );\r\n\r\n    dx = clamped.dx;\r\n    dy = clamped.dy;\r\n\r\n    const moved = {\r\n      ...poly,\r\n      points: poly.points.map((pt) => ({\r\n        x: pt.x + dx,\r\n        y: pt.y + dy,\r\n      })),\r\n    };\r\n\r\n    const others = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.filter((p) => p.id !== poly.id);\r\n\r\n    if ((0,_geometry_collision_js__WEBPACK_IMPORTED_MODULE_1__.hasCollision)(moved, others)) return;\r\n\r\n    poly.points = moved.points;\r\n\r\n    this.lastPos = mouse;\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.notify();\r\n  }\r\n\r\n  onUp() {\r\n    if (!this.dragging) return;\r\n\r\n    const poly = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.find((p) => p.id === _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.selectedId);\r\n    if (!poly) return;\r\n\r\n    const endPoints = poly.points.map((p) => ({ ...p }));\r\n\r\n    Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../history/actions.js */ \"./src/history/actions.js\")).then(({ movePolygonAction }) => {\r\n      _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.apply(\r\n        movePolygonAction(poly.id, this.dragStartPoints, endPoints)\r\n      );\r\n    });\r\n\r\n    this.dragging = false;\r\n    this.canvas.style.cursor = \"default\";\r\n  }\r\n\r\n  render() {\r\n    if (!this.ctx) return;\r\n\r\n    const now = Date.now();\r\n\r\n    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\r\n\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.forEach((p) => {\r\n      const duration = 300;\r\n      const t = Math.min(1, (now - (p.createdAt || 0)) / duration);\r\n\r\n      this.drawPolygonAnimated(p, t);\r\n    });\r\n\r\n    if (_state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.some((p) => now - (p.createdAt || 0) < 300)) {\r\n      requestAnimationFrame(() => this.render());\r\n    }\r\n  }\r\n\r\n  drawPolygonAnimated(polygon, t) {\r\n    const ctx = this.ctx;\r\n\r\n    const ease = t * (2 - t);\r\n\r\n    const cx =\r\n      polygon.points.reduce((sum, p) => sum + p.x, 0) / polygon.points.length;\r\n    const cy =\r\n      polygon.points.reduce((sum, p) => sum + p.y, 0) / polygon.points.length;\r\n\r\n    ctx.save();\r\n\r\n    ctx.globalAlpha = ease;\r\n\r\n    ctx.translate(cx, cy);\r\n    ctx.scale(ease, ease);\r\n    ctx.translate(-cx, -cy);\r\n\r\n    ctx.beginPath();\r\n\r\n    polygon.points.forEach((pt, i) => {\r\n      if (i === 0) ctx.moveTo(pt.x, pt.y);\r\n      else ctx.lineTo(pt.x, pt.y);\r\n    });\r\n\r\n    ctx.closePath();\r\n\r\n    ctx.fillStyle = polygon.color;\r\n    ctx.fill();\r\n\r\n    ctx.lineWidth = polygon.id === _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.selectedId ? 3 : 1;\r\n    ctx.strokeStyle = polygon.id === _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.selectedId ? \"#ffffff\" : \"#333\";\r\n    ctx.stroke();\r\n\r\n    ctx.restore();\r\n  }\r\n\r\n  pointInPolygon(point, polygon) {\r\n    let inside = false;\r\n\r\n    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {\r\n      const xi = polygon[i].x, yi = polygon[i].y;\r\n      const xj = polygon[j].x, yj = polygon[j].y;\r\n\r\n      const intersect =\r\n        yi > point.y !== yj > point.y &&\r\n        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;\r\n\r\n      if (intersect) inside = !inside;\r\n    }\r\n\r\n    return inside;\r\n  }\r\n}\r\n\r\ncustomElements.define(\"canvas-view\", CanvasView);\n\n//# sourceURL=webpack://polygon-editor/./src/components/CanvasView.js?\n}");

/***/ },

/***/ "./src/components/InfoPanel.js"
/*!*************************************!*\
  !*** ./src/components/InfoPanel.js ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state/store.js */ \"./src/state/store.js\");\n\r\n\r\nclass InfoPanel extends HTMLElement {\r\n  connectedCallback() {\r\n    this.style.marginLeft = \"auto\";\r\n    this.style.opacity = \"0.8\";\r\n\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.subscribe(() => this.render());\r\n    this.render();\r\n  }\r\n\r\n  render() {\r\n    const selected = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.find(p => p.id === _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.selectedId);\r\n\r\n    this.innerHTML = `\r\n      <span>Polygons: ${_state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.length}</span>\r\n      &nbsp;&nbsp;|&nbsp;&nbsp;\r\n      <span>${selected ? \"Selected: \" + selected.id.slice(0, 6) : \"Nothing selected\"}</span>\r\n    `;\r\n  }\r\n}\r\n\r\ncustomElements.define(\"info-panel\", InfoPanel);\n\n//# sourceURL=webpack://polygon-editor/./src/components/InfoPanel.js?\n}");

/***/ },

/***/ "./src/components/ToolbarPanel.js"
/*!****************************************!*\
  !*** ./src/components/ToolbarPanel.js ***!
  \****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _state_store_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../state/store.js */ \"./src/state/store.js\");\n/* harmony import */ var _geometry_polygon_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../geometry/polygon.js */ \"./src/geometry/polygon.js\");\n/* harmony import */ var _history_actions_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../history/actions.js */ \"./src/history/actions.js\");\n/* harmony import */ var _geometry_collision_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../geometry/collision.js */ \"./src/geometry/collision.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nclass ToolbarPanel extends HTMLElement {\r\n  connectedCallback() {\r\n    this.style.display = \"flex\";\r\n    this.style.gap = \"10px\";\r\n    this.style.padding = \"10px\";\r\n    this.style.background = \"#252525\";\r\n    this.style.flexWrap = \"wrap\";\r\n\r\n    this.innerHTML = `\r\n      <button id=\"gen\">➕ Generate</button>\r\n      <button id=\"del\">🗑 Delete</button>\r\n      <button id=\"delAll\">💣 Clear</button>\r\n      <button id=\"undo\">↶ Undo</button>\r\n      <button id=\"redo\">↷ Redo</button>\r\n      <button id=\"export\">💾 Export</button>\r\n      <button id=\"import\">📂 Import</button>\r\n      <input type=\"file\" id=\"fileInput\" style=\"display:none\" />\r\n      <info-panel></info-panel>\r\n    `;\r\n\r\n    this.querySelector(\"#gen\").onclick = () => this.generate();\r\n    this.querySelector(\"#del\").onclick = () => this.deleteSelected();\r\n    this.querySelector(\"#delAll\").onclick = () => this.deleteAll();\r\n    this.querySelector(\"#undo\").onclick = () => _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.undo();\r\n    this.querySelector(\"#redo\").onclick = () => _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.redo();\r\n    this.querySelector(\"#export\").onclick = () => this.exportJSON();\r\n    this.querySelector(\"#import\").onclick = () => this.importJSON();\r\n    this.querySelector(\"#fileInput\").onchange = (e) => this.handleFile(e);\r\n  }\r\n\r\n  exportJSON() {\r\n    const data = JSON.stringify(_state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons, null, 2);\r\n\r\n    const blob = new Blob([data], { type: \"application/json\" });\r\n    const url = URL.createObjectURL(blob);\r\n\r\n    const a = document.createElement(\"a\");\r\n    a.href = url;\r\n    a.download = \"polygons.json\";\r\n    a.click();\r\n\r\n    URL.revokeObjectURL(url);\r\n  }\r\n\r\n  importJSON() {\r\n    this.querySelector(\"#fileInput\").click();\r\n  }\r\n\r\n  handleFile(e) {\r\n    const file = e.target.files[0];\r\n    if (!file) return;\r\n\r\n    const reader = new FileReader();\r\n\r\n    reader.onload = () => {\r\n      try {\r\n        const polygons = JSON.parse(reader.result);\r\n\r\n        const normalized = polygons.map((p) => ({\r\n          ...p,\r\n          createdAt: p.createdAt || Date.now(),\r\n        }));\r\n\r\n        Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../history/actions.js */ \"./src/history/actions.js\")).then(\r\n          ({ deleteAllAction, addPolygonAction }) => {\r\n            _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.apply(deleteAllAction(_state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons));\r\n\r\n            normalized.forEach((p) => {\r\n              _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.apply(addPolygonAction(p));\r\n            });\r\n          },\r\n        );\r\n      } catch {\r\n        alert(\"Invalid JSON\");\r\n      }\r\n    };\r\n\r\n    reader.readAsText(file);\r\n  }\r\n\r\n  generate() {\r\n    let polygon;\r\n    let attempts = 0;\r\n\r\n    const canvas = document.querySelector(\"canvas\");\r\n    const canvasWidth = canvas.width;\r\n    const canvasHeight = canvas.height;\r\n\r\n    do {\r\n      const id = crypto.randomUUID();\r\n\r\n      polygon = {\r\n        id,\r\n        points: (0,_geometry_polygon_js__WEBPACK_IMPORTED_MODULE_1__.createPolygon)(\r\n          Math.random() * canvasWidth,\r\n          Math.random() * canvasHeight,\r\n          40 + Math.random() * 30,\r\n          Math.floor(Math.random() * 5) + 3,\r\n        ),\r\n        color: `hsl(${Math.random() * 360},70%,60%)`,\r\n        createdAt: Date.now(),\r\n      };\r\n\r\n      const bounds = (0,_geometry_collision_js__WEBPACK_IMPORTED_MODULE_3__.getBounds)(polygon.points);\r\n\r\n      const outOfBounds =\r\n        bounds.minX < 0 ||\r\n        bounds.maxX > canvasWidth ||\r\n        bounds.minY < 0 ||\r\n        bounds.maxY > canvasHeight;\r\n\r\n      const collision = (0,_geometry_collision_js__WEBPACK_IMPORTED_MODULE_3__.hasCollision)(polygon, _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons);\r\n\r\n      attempts++;\r\n\r\n      if (!outOfBounds && !collision) {\r\n        break;\r\n      }\r\n    } while (attempts < 30);\r\n\r\n    if (attempts >= 30) {\r\n      alert(\"Не удалось разместить полигон\");\r\n      return;\r\n    }\r\n\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.apply((0,_history_actions_js__WEBPACK_IMPORTED_MODULE_2__.addPolygonAction)(polygon));\r\n  }\r\n\r\n  deleteSelected() {\r\n    const id = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.selectedId;\r\n\r\n    if (!id) {\r\n      alert(\"Ничего не выбрано\");\r\n      return;\r\n    }\r\n\r\n    const polygon = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.find((p) => p.id === id);\r\n\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.apply((0,_history_actions_js__WEBPACK_IMPORTED_MODULE_2__.deletePolygonAction)(polygon));\r\n  }\r\n\r\n  deleteAll() {\r\n    if (!confirm(\"Удалить все полигоны?\")) return;\r\n    if (_state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.length === 0) return;\r\n\r\n    const snapshot = _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.polygons.map((p) => ({\r\n      ...p,\r\n      points: p.points.map((pt) => ({ ...pt })),\r\n    }));\r\n\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_0__.store.apply((0,_history_actions_js__WEBPACK_IMPORTED_MODULE_2__.deleteAllAction)(snapshot));\r\n  }\r\n}\r\n\r\ncustomElements.define(\"toolbar-panel\", ToolbarPanel);\r\n\n\n//# sourceURL=webpack://polygon-editor/./src/components/ToolbarPanel.js?\n}");

/***/ },

/***/ "./src/geometry/bounds.js"
/*!********************************!*\
  !*** ./src/geometry/bounds.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   clampMove: () => (/* binding */ clampMove)\n/* harmony export */ });\nfunction clampMove(points, dx, dy, width, height) {\r\n  let minX = Infinity;\r\n  let maxX = -Infinity;\r\n  let minY = Infinity;\r\n  let maxY = -Infinity;\r\n\r\n  points.forEach(p => {\r\n    const x = p.x + dx;\r\n    const y = p.y + dy;\r\n\r\n    minX = Math.min(minX, x);\r\n    maxX = Math.max(maxX, x);\r\n    minY = Math.min(minY, y);\r\n    maxY = Math.max(maxY, y);\r\n  });\r\n\r\n  if (minX < 0) dx -= minX;\r\n  if (maxX > width) dx -= (maxX - width);\r\n\r\n  if (minY < 0) dy -= minY;\r\n  if (maxY > height) dy -= (maxY - height);\r\n\r\n  return { dx, dy };\r\n}\n\n//# sourceURL=webpack://polygon-editor/./src/geometry/bounds.js?\n}");

/***/ },

/***/ "./src/geometry/collision.js"
/*!***********************************!*\
  !*** ./src/geometry/collision.js ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getBounds: () => (/* binding */ getBounds),\n/* harmony export */   hasCollision: () => (/* binding */ hasCollision),\n/* harmony export */   isIntersecting: () => (/* binding */ isIntersecting),\n/* harmony export */   polygonsIntersect: () => (/* binding */ polygonsIntersect)\n/* harmony export */ });\nfunction getBounds(points) {\r\n  const xs = points.map((p) => p.x);\r\n  const ys = points.map((p) => p.y);\r\n\r\n  return {\r\n    minX: Math.min(...xs),\r\n    maxX: Math.max(...xs),\r\n    minY: Math.min(...ys),\r\n    maxY: Math.max(...ys),\r\n  };\r\n}\r\n\r\nfunction isIntersecting(a, b) {\r\n  return !(\r\n    a.maxX < b.minX ||\r\n    a.minX > b.maxX ||\r\n    a.maxY < b.minY ||\r\n    a.minY > b.maxY\r\n  );\r\n}\r\n\r\nfunction linesIntersect(a, b, c, d) {\r\n  const det = (a, b, c, d) => a * d - b * c;\r\n\r\n  const dx1 = b.x - a.x;\r\n  const dy1 = b.y - a.y;\r\n  const dx2 = d.x - c.x;\r\n  const dy2 = d.y - c.y;\r\n\r\n  const delta = det(dx1, dy1, dx2, dy2);\r\n  if (delta === 0) return false;\r\n\r\n  const s = det(c.x - a.x, c.y - a.y, dx2, dy2) / delta;\r\n  const t = det(c.x - a.x, c.y - a.y, dx1, dy1) / delta;\r\n\r\n  return s >= 0 && s <= 1 && t >= 0 && t <= 1;\r\n}\r\n\r\nfunction polygonsIntersect(p1, p2) {\r\n  for (let i = 0; i < p1.length; i++) {\r\n    const a1 = p1[i];\r\n    const a2 = p1[(i + 1) % p1.length];\r\n\r\n    for (let j = 0; j < p2.length; j++) {\r\n      const b1 = p2[j];\r\n      const b2 = p2[(j + 1) % p2.length];\r\n\r\n      if (linesIntersect(a1, a2, b1, b2)) {\r\n        return true;\r\n      }\r\n    }\r\n  }\r\n\r\n  return false;\r\n}\r\n\r\nfunction pointInPolygon(point, polygon) {\r\n  let inside = false;\r\n\r\n  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {\r\n    const xi = polygon[i].x,\r\n      yi = polygon[i].y;\r\n    const xj = polygon[j].x,\r\n      yj = polygon[j].y;\r\n\r\n    const intersect =\r\n      yi > point.y !== yj > point.y &&\r\n      point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;\r\n\r\n    if (intersect) inside = !inside;\r\n  }\r\n\r\n  return inside;\r\n}\r\n\r\nfunction hasCollision(newPoly, polygons) {\r\n  const newBounds = getBounds(newPoly.points);\r\n\r\n  return polygons.some((p) => {\r\n    const b = getBounds(p.points);\r\n\r\n    if (!isIntersecting(newBounds, b)) return false;\r\n\r\n    if (polygonsIntersect(newPoly.points, p.points)) return true;\r\n\r\n    if (pointInPolygon(newPoly.points[0], p.points)) return true;\r\n    if (pointInPolygon(p.points[0], newPoly.points)) return true;\r\n\r\n    return false;\r\n  });\r\n}\r\n\n\n//# sourceURL=webpack://polygon-editor/./src/geometry/collision.js?\n}");

/***/ },

/***/ "./src/geometry/polygon.js"
/*!*********************************!*\
  !*** ./src/geometry/polygon.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createPolygon: () => (/* binding */ createPolygon)\n/* harmony export */ });\nfunction createPolygon(cx, cy, radius, count) {\r\n  const points = [];\r\n\r\n  for (let i = 0; i < count; i++) {\r\n    const angle = (Math.PI * 2 * i) / count;\r\n\r\n    let randomFactor = 0.6 + Math.random() * 0.8;\r\n\r\n    if (Math.random() < 0.3) {\r\n      randomFactor *= 0.4;\r\n    }\r\n\r\n    points.push({\r\n      x: cx + Math.cos(angle) * radius * randomFactor,\r\n      y: cy + Math.sin(angle) * radius * randomFactor,\r\n    });\r\n  }\r\n\r\n  return points;\r\n}\r\n\n\n//# sourceURL=webpack://polygon-editor/./src/geometry/polygon.js?\n}");

/***/ },

/***/ "./src/history/actions.js"
/*!********************************!*\
  !*** ./src/history/actions.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   addPolygonAction: () => (/* binding */ addPolygonAction),\n/* harmony export */   changeColorAction: () => (/* binding */ changeColorAction),\n/* harmony export */   deleteAllAction: () => (/* binding */ deleteAllAction),\n/* harmony export */   deletePolygonAction: () => (/* binding */ deletePolygonAction),\n/* harmony export */   movePolygonAction: () => (/* binding */ movePolygonAction)\n/* harmony export */ });\nfunction addPolygonAction(polygon) {\r\n  return {\r\n    undo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: state.polygons.filter((p) => p.id !== polygon.id),\r\n      };\r\n    },\r\n    redo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: [...state.polygons, polygon],\r\n      };\r\n    },\r\n  };\r\n}\r\n\r\nfunction movePolygonAction(id, from, to) {\r\n  return {\r\n    undo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: state.polygons.map((p) =>\r\n          p.id === id ? { ...p, points: from } : p,\r\n        ),\r\n      };\r\n    },\r\n    redo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: state.polygons.map((p) =>\r\n          p.id === id ? { ...p, points: to } : p,\r\n        ),\r\n      };\r\n    },\r\n  };\r\n}\r\n\r\nfunction deletePolygonAction(polygon) {\r\n  return {\r\n    undo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: [...state.polygons, polygon],\r\n      };\r\n    },\r\n    redo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: state.polygons.filter((p) => p.id !== polygon.id),\r\n        selectedId: null,\r\n      };\r\n    },\r\n  };\r\n}\r\n\r\nfunction deleteAllAction(polygons) {\r\n  return {\r\n    undo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: [...polygons],\r\n      };\r\n    },\r\n    redo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: [],\r\n        selectedId: null,\r\n      };\r\n    },\r\n  };\r\n}\r\n\r\nfunction changeColorAction(id, from, to) {\r\n  return {\r\n    undo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: state.polygons.map((p) =>\r\n          p.id === id ? { ...p, color: from || p.color } : p,\r\n        ),\r\n      };\r\n    },\r\n    redo(state) {\r\n      return {\r\n        ...state,\r\n        polygons: state.polygons.map((p) =>\r\n          p.id === id ? { ...p, color: to || p.color } : p,\r\n        ),\r\n      };\r\n    },\r\n  };\r\n}\r\n\n\n//# sourceURL=webpack://polygon-editor/./src/history/actions.js?\n}");

/***/ },

/***/ "./src/history/history.js"
/*!********************************!*\
  !*** ./src/history/history.js ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   History: () => (/* binding */ History),\n/* harmony export */   history: () => (/* binding */ history)\n/* harmony export */ });\nclass History {\r\n  constructor() {\r\n    this.undoStack = [];\r\n    this.redoStack = [];\r\n  }\r\n\r\n  push(action) {\r\n    this.undoStack.push(action);\r\n    this.redoStack = [];\r\n  }\r\n\r\n  undo(state) {\r\n    const action = this.undoStack.pop();\r\n    if (!action) return state;\r\n\r\n    this.redoStack.push(action);\r\n    return action.undo(state);\r\n  }\r\n\r\n  redo(state) {\r\n    const action = this.redoStack.pop();\r\n    if (!action) return state;\r\n\r\n    this.undoStack.push(action);\r\n    return action.redo(state);\r\n  }\r\n}\r\n\r\nconst history = new History();\r\n\n\n//# sourceURL=webpack://polygon-editor/./src/history/history.js?\n}");

/***/ },

/***/ "./src/index.js"
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app_AppRoot_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/AppRoot.js */ \"./src/app/AppRoot.js\");\n/* harmony import */ var _app_AppRoot_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_app_AppRoot_js__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _components_ToolbarPanel_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/ToolbarPanel.js */ \"./src/components/ToolbarPanel.js\");\n/* harmony import */ var _components_CanvasView_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/CanvasView.js */ \"./src/components/CanvasView.js\");\n/* harmony import */ var _components_InfoPanel_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/InfoPanel.js */ \"./src/components/InfoPanel.js\");\n/* harmony import */ var _history_actions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./history/actions.js */ \"./src/history/actions.js\");\n/* harmony import */ var _state_store_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./state/store.js */ \"./src/state/store.js\");\n\r\n\r\n\r\n\r\n\r\n\r\n\r\ndocument.addEventListener(\"keydown\", (e) => {\r\n  if (e.ctrlKey && e.key === \"z\") {\r\n    e.preventDefault();\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_5__.store.undo();\r\n  }\r\n\r\n  if (e.ctrlKey && (e.key === \"y\" || (e.shiftKey && e.key === \"Z\"))) {\r\n    e.preventDefault();\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_5__.store.redo();\r\n  }\r\n\r\n  if (e.key === \"Delete\") {\r\n    const id = _state_store_js__WEBPACK_IMPORTED_MODULE_5__.store.selectedId;\r\n\r\n    if (!id) {\r\n      alert(\"Ничего не выбрано\");\r\n      return;\r\n    }\r\n\r\n    const polygon = _state_store_js__WEBPACK_IMPORTED_MODULE_5__.store.polygons.find((p) => p.id === id);\r\n    _state_store_js__WEBPACK_IMPORTED_MODULE_5__.store.apply((0,_history_actions_js__WEBPACK_IMPORTED_MODULE_4__.deletePolygonAction)(polygon));\r\n  }\r\n});\r\n\n\n//# sourceURL=webpack://polygon-editor/./src/index.js?\n}");

/***/ },

/***/ "./src/state/store.js"
/*!****************************!*\
  !*** ./src/state/store.js ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   store: () => (/* binding */ store)\n/* harmony export */ });\n/* harmony import */ var _history_history_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../history/history.js */ \"./src/history/history.js\");\n\r\n\r\nconst store = {\r\n  polygons: [],\r\n  selectedId: null,\r\n  listeners: [],\r\n\r\n  setState(newState) {\r\n    Object.assign(this, newState);\r\n    this.notify();\r\n  },\r\n\r\n  apply(action) {\r\n    const newState = action.redo(this);\r\n    this.setState(newState);\r\n    _history_history_js__WEBPACK_IMPORTED_MODULE_0__.history.push(action);\r\n  },\r\n\r\n  undo() {\r\n    const newState = _history_history_js__WEBPACK_IMPORTED_MODULE_0__.history.undo(this);\r\n    this.setState(newState);\r\n  },\r\n\r\n  redo() {\r\n    const newState = _history_history_js__WEBPACK_IMPORTED_MODULE_0__.history.redo(this);\r\n    this.setState(newState);\r\n  },\r\n\r\n  subscribe(fn) {\r\n    this.listeners.push(fn);\r\n  },\r\n\r\n  notify() {\r\n    this.listeners.forEach((fn) => fn(this));\r\n  },\r\n};\r\n\n\n//# sourceURL=webpack://polygon-editor/./src/state/store.js?\n}");

/***/ }

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
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;