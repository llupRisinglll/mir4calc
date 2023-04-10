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

/***/ "./src/test.tsx":
/*!**********************!*\
  !*** ./src/test.tsx ***!
  \**********************/
/***/ (() => {

eval("var JSX = {\n  createElement: function createElement(name, props) {\n    var content = [];\n    for (var _i = 2; _i < arguments.length; _i++) {\n      content[_i - 2] = arguments[_i];\n    }\n    props = props || {};\n    var propsstr = Object.keys(props).map(function (key) {\n      var value = props[key];\n      if (key === \"className\") return \"class=\".concat(value);else return \"\".concat(key, \"=\").concat(value);\n    }).join(\" \");\n    return \"<\".concat(name, \" \").concat(propsstr, \"> \").concat(content.join(\"\"), \"</\").concat(name, \">\");\n  }\n};\nfunction Hello(name) {\n  return JSX.createElement(\"div\", {\n    className: \"asd\"\n  }, \"Hello \", name, JSX.createElement(\"div\", null, \" Hello Nested \"), JSX.createElement(\"div\", null, \" Hello Nested 2\"));\n}\nfunction log(html) {\n  console.log(html);\n}\n\n//# sourceURL=webpack://resource-distribution/./src/test.tsx?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/test.tsx"]();
/******/ 	
/******/ })()
;