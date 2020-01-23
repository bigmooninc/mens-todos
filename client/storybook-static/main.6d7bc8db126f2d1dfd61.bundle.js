(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{271:function(module,exports,__webpack_require__){__webpack_require__(272),__webpack_require__(415),module.exports=__webpack_require__(416)},333:function(module,exports){},416:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),function(module){var _storybook_svelte__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(269);Object(_storybook_svelte__WEBPACK_IMPORTED_MODULE_0__.configure)(__webpack_require__(606),module)}.call(this,__webpack_require__(417)(module))},606:function(module,exports,__webpack_require__){var map={"./todos/Todo.stories.js":625};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=606},609:function(module,exports,__webpack_require__){var api=__webpack_require__(610),content=__webpack_require__(611);"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.i,content,""]]);var options={insert:"head",singleton:!1},exported=(api(content,options),content.locals?content.locals:{});module.exports=exported},611:function(module,exports,__webpack_require__){(exports=__webpack_require__(612)(!1)).push([module.i,'/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\n/**\n * Add the correct font size in all browsers.\n */\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type="button"],\n[type="reset"],\n[type="submit"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type="button"]::-moz-focus-inner,\n[type="reset"]::-moz-focus-inner,\n[type="submit"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type="button"]:-moz-focusring,\n[type="reset"]:-moz-focusring,\n[type="submit"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type="checkbox"],\n[type="radio"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type="number"]::-webkit-inner-spin-button,\n[type="number"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type="search"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type="search"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\n/*\n * Add the correct display in all browsers.\n */\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n\n/**\n * Manually forked from SUIT CSS Base: https://github.com/suitcss/base\n * A thin layer on top of normalize.css that provides a starting point more\n * suitable for web applications.\n */\n\n/**\n * 1. Prevent padding and border from affecting element width\n * https://goo.gl/pYtbK7\n * 2. Change the default font family in all browsers (opinionated)\n */\n\nhtml {\n  box-sizing: border-box; /* 1 */\n  font-family: sans-serif; /* 2 */\n}\n\n*,\n*::before,\n*::after {\n  box-sizing: inherit;\n}\n\n/**\n * Removes the default spacing and border for appropriate elements.\n */\n\n\nh2,\nh3,\np {\n  margin: 0;\n}\n\nbutton {\n  background: transparent;\n  padding: 0;\n}\n\n/**\n * Work around a Firefox/IE bug where the transparent `button` background\n * results in a loss of the default `button` focus styles.\n */\n\nbutton:focus {\n  outline: 1px dotted;\n  outline: 5px auto -webkit-focus-ring-color;\n}\n\n\nul {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/**\n * Tailwind custom reset styles\n */\n\n/**\n * 1. Use the system font stack as a sane default.\n * 2. Use Tailwind\'s default "normal" line-height so the user isn\'t forced\n * to override it to ensure consistency even when using the default theme.\n */\n\nhtml {\n  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 1 */\n  line-height: 1.5; /* 2 */\n}\n\n/**\n * Allow adding a border to an element by just adding a border-width.\n *\n * By default, the way the browser specifies that an element should have no\n * border is by setting it\'s border-style to `none` in the user-agent\n * stylesheet.\n *\n * In order to easily add borders to elements by just setting the `border-width`\n * property, we change the default border-style for all elements to `solid`, and\n * use border-width to hide them instead. This way our `border` utilities only\n * need to set the `border-width` property instead of the entire `border`\n * shorthand, making our border utilities much more straightforward to compose.\n *\n * https://github.com/tailwindcss/tailwindcss/pull/116\n */\n\n*,\n*::before,\n*::after {\n  border-width: 0;\n  border-style: solid;\n  border-color: #e2e8f0;\n}\n\n/*\n * Ensure horizontal rules are visible by default\n */\n\n/**\n * Undo the `border-style: none` reset that Normalize applies to images so that\n * our `border-{width}` utilities have the expected effect.\n *\n * The Normalize reset is unnecessary for us since we default the border-width\n * to 0 on all elements.\n *\n * https://github.com/tailwindcss/tailwindcss/issues/362\n */\n\ninput::placeholder {\n  color: #a0aec0;\n}\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n\nh2,\nh3 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/**\n * Reset links to optimize for opt-in styling instead of\n * opt-out.\n */\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/**\n * Reset form element properties that are easy to forget to\n * style explicitly so you don\'t inadvertently introduce\n * styles that deviate from your design system. These styles\n * supplement a partial reset that is already applied by\n * normalize.css.\n */\n\nbutton,\ninput {\n  padding: 0;\n  line-height: inherit;\n  color: inherit;\n}\n\n/**\n * Use the configured \'mono\' font family for elements that\n * are expected to be rendered with a monospace font, falling\n * back to the system monospace stack if there is no configured\n * \'mono\' font family.\n */\n\n/**\n * Make replaced elements `display: block` by default as that\'s\n * the behavior you want almost all of the time. Inspired by\n * CSS Remedy, with `svg` added as well.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\n\nobject {\n  display: block;\n  vertical-align: middle;\n}\n\n/**\n * Constrain images and videos to the parent width and preserve\n * their instrinsic aspect ratio.\n *\n * https://github.com/mozdevs/cssremedy/issues/14\n */\n\n*, *::before, *::after {\n  --transition-duration: 250ms;\n}\n\n.bg-black {\n  background-color: #000;\n}\n\n.bg-red-800 {\n  background-color: #9b2c2c;\n}\n\n.hover\\:bg-red-900:hover {\n  background-color: #742a2a;\n}\n\n.border-gray-300 {\n  border-color: #e2e8f0;\n}\n\n.border {\n  border-width: 1px;\n}\n\n.flex {\n  display: flex;\n}\n\n.flex-col {\n  flex-direction: column;\n}\n\n.items-center {\n  align-items: center;\n}\n\n.justify-center {\n  justify-content: center;\n}\n\n.justify-between {\n  justify-content: space-between;\n}\n\n.font-bold {\n  font-weight: 700;\n}\n\n.h-screen {\n  height: 100vh;\n}\n\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n\n.ml-1 {\n  margin-left: 0.25rem;\n}\n\n.mb-3 {\n  margin-bottom: 0.75rem;\n}\n\n.mt-4 {\n  margin-top: 1rem;\n}\n\n.mb-4 {\n  margin-bottom: 1rem;\n}\n\n.max-w-xs {\n  max-width: 20rem;\n}\n\n.max-w-md {\n  max-width: 28rem;\n}\n\n.p-2 {\n  padding: 0.5rem;\n}\n\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n\n.pb-20 {\n  padding-bottom: 5rem;\n}\n\n.text-center {\n  text-align: center;\n}\n\n.text-white {\n  color: #fff;\n}\n\n.text-red-700 {\n  color: #c53030;\n}\n\n.text-sm {\n  font-size: 0.875rem;\n}\n\n.text-2xl {\n  font-size: 1.5rem;\n}\n\n.hover\\:underline:hover {\n  text-decoration: underline;\n}\n\n.w-full {\n  width: 100%;\n}\n\n.transition-bg {\n  transition-property: background-color;\n  transition-duration: 250ms;\n  transition-duration: var(--transition-duration);\n}\n\n.transition-500 {\n  --transition-duration: 500ms;\n  transition-duration: 500ms;\n  transition-duration: var(--transition-duration);\n}\n',""]),module.exports=exports},625:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(22),__webpack_require__(102),__webpack_require__(16),__webpack_require__(38),__webpack_require__(160),__webpack_require__(65),__webpack_require__(607),__webpack_require__(608),__webpack_require__(31),__webpack_require__(17),__webpack_require__(609);var internal=__webpack_require__(2),svelte=__webpack_require__(270);class Tailwindcss_svelte_Tailwindcss extends internal.a{constructor(options){super(),Object(internal.i)(this,options,null,null,internal.l,{})}}var Tailwindcss_svelte=Tailwindcss_svelte_Tailwindcss;function create_fragment(ctx){let t,div,input,input_value_value,current;const tailwindcss=new Tailwindcss_svelte({});return{c(){Object(internal.e)(tailwindcss.$$.fragment),t=Object(internal.m)(),div=Object(internal.h)("div"),input=Object(internal.h)("input"),Object(internal.c)(input,"type","text"),input.value=input_value_value=ctx[0].text,Object(internal.c)(input,"class","w-full p-2"),Object(internal.c)(div,"class","bg-black")},m(target,anchor){Object(internal.k)(tailwindcss,target,anchor),Object(internal.j)(target,t,anchor),Object(internal.j)(target,div,anchor),Object(internal.b)(div,input),current=!0},p(ctx,[dirty]){(!current||1&dirty&&input_value_value!==(input_value_value=ctx[0].text)&&input.value!==input_value_value)&&(input.value=input_value_value)},i(local){current||(Object(internal.n)(tailwindcss.$$.fragment,local),current=!0)},o(local){Object(internal.o)(tailwindcss.$$.fragment,local),current=!1},d(detaching){Object(internal.f)(tailwindcss,detaching),detaching&&Object(internal.g)(t),detaching&&Object(internal.g)(div)}}}function instance($$self,$$props,$$invalidate){Object(svelte.a)();let{todo:todo={id:"",text:"",state:"",updated_at:new Date(2019,0,1,9,0)}}=$$props;return $$self.$set=$$props=>{"todo"in $$props&&$$invalidate(0,todo=$$props.todo)},[todo]}class Todo_svelte_Todo extends internal.a{constructor(options){super(),Object(internal.i)(this,options,instance,create_fragment,internal.l,{todo:0})}}var Todo_svelte=Todo_svelte_Todo,dist=__webpack_require__(166);function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var source,i=1;i<arguments.length;i++)source=null!=arguments[i]?arguments[i]:{},i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}));return target}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}__webpack_require__.d(__webpack_exports__,"actionsData",(function(){return actionsData})),__webpack_require__.d(__webpack_exports__,"todoData",(function(){return todoData})),__webpack_require__.d(__webpack_exports__,"Default",(function(){return Default})),__webpack_require__.d(__webpack_exports__,"Pinned",(function(){return Pinned})),__webpack_require__.d(__webpack_exports__,"Archived",(function(){return Archived}));__webpack_exports__.default={title:"Todo",excludeStories:/.*Data$/};var actionsData={onPinTask:Object(dist.action)("onPinTask"),onArchiveTask:Object(dist.action)("onArchiveTask")},todoData={id:"1",text:"Test Todo",state:"Task_INBOX",updated_at:new Date(2019,0,1,9,0)},Default=function(){return{Component:Todo_svelte,props:{todo:todoData},on:_objectSpread({},actionsData)}},Pinned=function(){return{Component:Todo_svelte,props:{todo:_objectSpread({},todoData,{state:"TODO_PINNED"})},on:_objectSpread({},actionsData)}},Archived=function(){return{Component:Todo_svelte,props:{todo:_objectSpread({},todoData,{state:"TODO_ARCHIVED"})},on:_objectSpread({},actionsData)}}}},[[271,1,2]]]);
//# sourceMappingURL=main.6d7bc8db126f2d1dfd61.bundle.js.map