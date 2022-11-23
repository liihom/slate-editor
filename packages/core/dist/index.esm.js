import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import _toConsumableArray from '@babel/runtime/helpers/esm/toConsumableArray';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useMemo,
  useImperativeHandle,
} from 'react';
import {
  Editor,
  Transforms,
  Range,
  Element,
  Point,
  Node as Node$1,
  createEditor,
  Text,
} from 'slate';
import { withReact, Slate } from 'slate-react';
import escapeHtml from 'escape-html';
import _typeof from '@babel/runtime/helpers/esm/typeof';
import _createForOfIteratorHelper from '@babel/runtime/helpers/esm/createForOfIteratorHelper';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import { nanoid } from 'nanoid';
import _objectWithoutProperties from '@babel/runtime/helpers/esm/objectWithoutProperties';
import { jsx } from 'slate-hyperscript';

var defaultConfig = {
  plugins: [],
  locales: [
    {
      locale: 'default',
    },
  ],
  locale: 'default',
};

var mergeStyle = function mergeStyle(node, plugins, nodeType, editor) {
  var targetPlugins = plugins.filter(function (i) {
    return i.nodeType === nodeType;
  });
  return targetPlugins.reduce(function (preStyle, plugin) {
    var style = _objectSpread({}, preStyle);
    if (!plugin.renderStyle) return _objectSpread({}, style);
    var gstyle = {};
    if (typeof plugin.renderStyle === 'function') {
      gstyle = plugin.renderStyle(node, editor, plugin.props);
    } else if (!!node[plugin.type]) {
      gstyle = plugin.renderStyle;
    }
    return _objectSpread(_objectSpread({}, style), gstyle);
  }, {});
};
function splitCamel(str) {
  return str
    .replace(/([A-Z])/g, function (s) {
      return '-' + s.toLowerCase();
    })
    .trim();
}
var style2string = function style2string(style) {
  if (_typeof(style) !== 'object') return '';
  return Object.keys(style)
    .map(function (key) {
      var value = style[key];
      if (typeof value === 'number') value = value + 'px';
      return ''.concat(splitCamel(key), ':').concat(value, ';');
    })
    .join('');
};

/**
 * this method code from
 * https://github.com/ant-design/pro-components/blob/8e5fb7f1c0a027c68465406ed915d90f33267b07/packages/provider/src/index.tsx#L96
 */
var get = function get(source, path, defaultValue) {
  // a[3].b -> a.3.b
  var paths = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  var result = source;
  var message = defaultValue;
  // eslint-disable-next-line no-restricted-syntax
  var _iterator = _createForOfIteratorHelper(paths),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var p = _step.value;
      message = Object(result)[p];
      result = Object(result)[p];
      if (message === undefined) {
        return defaultValue;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return message;
};

var getTextProps = function getTextProps(editor, format) {
  var _marks$format;
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var marks = Editor.marks(editor);
  return (_marks$format = marks === null || marks === void 0 ? void 0 : marks[format]) !== null &&
    _marks$format !== void 0
    ? _marks$format
    : defaultValue;
};
var setTextProps = function setTextProps(editor, format, value) {
  Editor.addMark(editor, format, value);
};
var toggleTextProps = function toggleTextProps(editor, format) {
  var active = getTextProps(editor, format);
  if (active) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

var isBlockActive = function isBlockActive(editor, format) {
  var selection = editor.selection;
  if (!selection) return false;
  var _Array$from = Array.from(
      Editor.nodes(editor, {
        match: function match(n) {
          return !Editor.isEditor(n) && Editor.isBlock(editor, n) && n.type === format;
        },
      }),
    ),
    _Array$from2 = _slicedToArray(_Array$from, 1),
    match = _Array$from2[0];
  return !!match;
};
var toggleBlock = function toggleBlock(editor, format) {
  var isActive = isBlockActive(editor, format);
  Transforms.setNodes(
    editor,
    {
      type: isActive ? editor.defaultElement : format,
    },
    {
      hanging: true,
      match: function match(n) {
        return (
          !Editor.isEditor(n) &&
          Editor.isBlock(editor, n) &&
          n.type === (isActive ? format : editor.defaultElement)
        );
      },
    },
  );
};
var getBlockProps = function getBlockProps(editor, format, defaultValue) {
  var _node$format;
  var selection = editor.selection;
  if (!selection) {
    return defaultValue;
  }
  var _Editor$nodes = Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: function match(n) {
        return !Editor.isEditor(n) && Editor.isBlock(editor, n) && format in n;
      },
    }),
    _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
    match = _Editor$nodes2[0];
  if (!match) return defaultValue;
  var _match = _slicedToArray(match, 1),
    node = _match[0];
  return (_node$format = node[format]) !== null && _node$format !== void 0
    ? _node$format
    : defaultValue;
};
var setBlockProps = function setBlockProps(editor, format, value) {
  var selection = editor.selection;
  if (!selection) return;
  Transforms.setNodes(editor, _defineProperty({}, format, value), {
    match: function match(n) {
      return !Editor.isEditor(n) && Editor.isBlock(editor, n);
    },
  });
};
var clearBlockProps = function clearBlockProps(editor, format) {
  var selection = editor.selection;
  if (!selection) return;
  Transforms.unsetNodes(editor, format, {
    match: function match(n) {
      return !Editor.isEditor(n) && Editor.isBlock(editor, n);
    },
  });
};

var withPlugins = function withPlugins(editor, plugins) {
  return plugins.reduce(function (preEditor, plugin) {
    if (!plugin.uuid) plugin.uuid = ''.concat(plugin.type, '_').concat(nanoid());
    var isVoid = preEditor.isVoid,
      isInline = preEditor.isInline,
      normalizeNode = preEditor.normalizeNode;
    if (plugin.isDefaultElement) preEditor.defaultElement = plugin.type;
    if ('isVoid' in plugin) {
      preEditor.isVoid = function (element) {
        if (element.type === plugin.type) {
          if (!plugin.isVoid) return false;
          return typeof plugin.isVoid === 'function' ? plugin.isVoid(element) : plugin.isVoid;
        }
        return isVoid(element);
      };
    }
    if ('isInline' in plugin) {
      preEditor.isInline = function (element) {
        if (element.type === plugin.type) {
          if (!plugin.isInline) return false;
          return typeof plugin.isInline === 'function' ? plugin.isInline(element) : plugin.isInline;
        }
        return isInline(element);
      };
    }
    if ('normalizeNode' in plugin) {
      preEditor.normalizeNode = function (entry) {
        if (plugin.normalizeNode) {
          plugin.normalizeNode(entry, editor, normalizeNode);
          return;
        }
        normalizeNode(entry);
      };
    }
    if (typeof (plugin === null || plugin === void 0 ? void 0 : plugin.withPlugin) === 'function') {
      return plugin === null || plugin === void 0 ? void 0 : plugin.withPlugin(preEditor);
    }
    return preEditor;
  }, editor);
};

var isStart = function isStart(editor, type) {
  var selection = editor.selection;
  if (selection && Range.isCollapsed(selection)) {
    var _Editor$nodes = Editor.nodes(editor, {
        match: function match(n) {
          return !Editor.isEditor(n) && Element.isElement(n) && n.type === type;
        },
      }),
      _Editor$nodes2 = _slicedToArray(_Editor$nodes, 1),
      match = _Editor$nodes2[0];
    if (match) {
      var _match = _slicedToArray(match, 2),
        path = _match[1];
      var start = Editor.start(editor, path);
      if (Point.equals(selection.anchor, start)) {
        return true;
      }
    }
  }
  return false;
};

var promiseUploadFunc = function promiseUploadFunc(options, func, setPercent) {
  var RcOnProgress = options.onProgress,
    _onError = options.onError,
    _onSuccess = options.onSuccess;
  return new Promise(function (resolve, reject) {
    var args = _objectSpread(
      _objectSpread({}, options),
      {},
      {
        onProgress: function onProgress(e) {
          var _e$percent;
          RcOnProgress === null || RcOnProgress === void 0 ? void 0 : RcOnProgress(e);
          setPercent === null || setPercent === void 0
            ? void 0
            : setPercent(
                (_e$percent = e === null || e === void 0 ? void 0 : e.percent) !== null &&
                  _e$percent !== void 0
                  ? _e$percent
                  : 0,
              );
        },
        onError: function onError(e) {
          reject(e);
          _onError === null || _onError === void 0 ? void 0 : _onError(e);
          setPercent === null || setPercent === void 0 ? void 0 : setPercent(-1);
        },
        onSuccess: function onSuccess(body) {
          _onSuccess === null || _onSuccess === void 0 ? void 0 : _onSuccess(body);
          setPercent === null || setPercent === void 0 ? void 0 : setPercent(0);
          resolve(body);
        },
      },
    );
    if (func) {
      func(args);
    } else {
      base64file(args);
    }
  });
};

var base64file = function base64file(option) {
  var reader = new FileReader();
  reader.addEventListener(
    'load',
    function () {
      var _option$onSuccess;
      (_option$onSuccess = option.onSuccess) === null || _option$onSuccess === void 0
        ? void 0
        : _option$onSuccess.call(option, {
            url: reader.result,
          });
    },
    false,
  );
  reader.readAsDataURL(option.file);
};

var _excluded = ['locale'];
var mergeLocalteFromPlugins = function mergeLocalteFromPlugins(locales, plugins) {
  var newLocales = _toConsumableArray(locales);
  var _iterator = _createForOfIteratorHelper(plugins),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done; ) {
      var plugin = _step.value;
      if (!plugin.locale) continue;
      var _iterator2 = _createForOfIteratorHelper(plugin.locale),
        _step2;
      try {
        var _loop = function _loop() {
          var _ref = _step2.value;
          var locale = _ref.locale,
            languages = _objectWithoutProperties(_ref, _excluded);
          var target = newLocales.find(function (i) {
            return i.locale === locale;
          });
          if (target) {
            var preLanguages = _objectSpread({}, target[plugin.type] || {});
            // 合并规则 ConfigProvider 优于 插件的语言包
            target[plugin.type] = _objectSpread(_objectSpread({}, languages), preLanguages);
          } else {
            newLocales.push(
              _defineProperty(
                {
                  locale: locale,
                },
                plugin.type,
                _objectSpread({}, languages),
              ),
            );
          }
        };
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done; ) {
          _loop();
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return newLocales;
};

var isEmpty = function isEmpty(editor) {
  var _Editor$above;
  if (!editor.selection) return false;
  var block =
    (_Editor$above = Editor.above(editor)) === null || _Editor$above === void 0
      ? void 0
      : _Editor$above[0];
  if (!block) return false;
  return (
    Node$1.string(block) === '' &&
    !block.children.some(function (n) {
      return Editor.isInline(editor, n);
    })
  );
};

// import { Text } from 'slate';
var NodeType;
(function (NodeType) {
  NodeType[(NodeType['ELEMENT_NODE'] = 1)] = 'ELEMENT_NODE';
  NodeType[(NodeType['TEXT_NODE'] = 3)] = 'TEXT_NODE';
  NodeType[(NodeType['CDATA_SECTION_NODE'] = 4)] = 'CDATA_SECTION_NODE';
  NodeType[(NodeType['PROCESSING_INSTRUCTION_NODE'] = 7)] = 'PROCESSING_INSTRUCTION_NODE';
  NodeType[(NodeType['COMMENT_NODE'] = 8)] = 'COMMENT_NODE';
  NodeType[(NodeType['DOCUMENT_NODE'] = 9)] = 'DOCUMENT_NODE';
  NodeType[(NodeType['DOCUMENT_TYPE_NODE'] = 10)] = 'DOCUMENT_TYPE_NODE';
  NodeType[(NodeType['DOCUMENT_FRAGMENT_NODE'] = 11)] = 'DOCUMENT_FRAGMENT_NODE';
})(NodeType || (NodeType = {}));
var StyleNodeTags;
(function (StyleNodeTags) {
  StyleNodeTags['STRONG'] = 'STRONG';
  StyleNodeTags['EM'] = 'EM';
  StyleNodeTags['DEL'] = 'DEL';
  StyleNodeTags['U'] = 'U';
  StyleNodeTags['SUB'] = 'SUB';
  StyleNodeTags['SUP'] = 'SUP';
  StyleNodeTags['CODE'] = 'CODE';
  StyleNodeTags['SPAN'] = 'SPAN';
})(StyleNodeTags || (StyleNodeTags = {}));
var StyleNodes = ['STRONG', 'EM', 'DEL', 'U', 'SUB', 'SUP', 'CODE', 'SPAN'];
var getAttributes = function getAttributes(el) {
  return el.getAttributeNames().reduce(function (acc, name) {
    return _objectSpread(
      _objectSpread({}, acc),
      {},
      _defineProperty({}, name, el.getAttribute(name)),
    );
  }, {});
};
// // const Reg_Element = /^(body|table|thead|tbody|tfoot|tr|td|th|div|p)$/i;
// // https://github.com/remarkablemark/style-to-js
// eslint-disable-next-line @typescript-eslint/no-unused-vars
var parseStyles = function parseStyles(styles) {
  if (!styles) return null;
  return styles
    .split(';')
    .filter(function (style) {
      return style.split(':')[0] && style.split(':')[1];
    })
    .map(function (style) {
      return [
        style
          .split(':')[0]
          .trim()
          .replace(/-./g, function (c) {
            return c.substr(1).toUpperCase();
          }),
        style.split(':')[1].trim(),
      ];
    })
    .reduce(function (styleObj, style) {
      return _objectSpread(
        _objectSpread({}, styleObj),
        {},
        _defineProperty({}, style[0], style[1]),
      );
    }, {});
};
var emptyNodes = [
  {
    type: 'paragraph',
    children: [
      {
        text: '',
      },
    ],
  },
];
/**
 * 反序列化 html to slate node
 * 将 html 字符串转化为 slate 编辑器识别的 node 节点结构
 * 注意要符合 slate 内建约束 @see https://rain120.github.io/athena/zh/slate/concepts/10-normalizing.html#%E5%86%85%E5%BB%BA%E7%BA%A6%E6%9D%9F-built-in-constraints
 * @return - slate node
 */
var deserialize = function deserialize(el) {
  var markAttributes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  // console.log('el=', el);
  if (el.nodeType === NodeType.TEXT_NODE) {
    // ! 是文本节点内容，直接返回文本
    return jsx('text', {}, el.textContent);
    // return { text: el.textContent };
  }

  if (el.nodeType !== NodeType.ELEMENT_NODE) {
    return null;
  }
  var nodeAttributes = _objectSpread({}, markAttributes);
  // define attributes for text nodes
  // ! 查看样式标签 strong、span 等
  switch (el.nodeName) {
    case 'STRONG':
      nodeAttributes['bold'] = true;
      break;
    case 'EM':
      nodeAttributes['italic'] = true;
      break;
    case 'DEL':
      nodeAttributes['strikethrough'] = true;
      break;
    case 'U':
      nodeAttributes['underline'] = true;
      break;
    case 'SUB':
      nodeAttributes['subscript'] = true;
      break;
    case 'SUP':
      nodeAttributes['superscript'] = true;
      break;
    case 'CODE':
      nodeAttributes['code'] = true;
      break;
    case 'SPAN':
      nodeAttributes['style'] = el.getAttribute('style');
      break;
  }
  var hasElement = el.children.length > 0;
  var temp = Array.from(el.childNodes);
  if (hasElement) {
    // TODO 是否有更安全的判断办法过滤掉无意义的 text node
    // TODO 判断文本节点不为空的逻辑是否安全
    temp = temp.filter(function (node) {
      var _node$textContent;
      return (
        node['nodeType'] !== Node.TEXT_NODE ||
        ((_node$textContent = node['textContent']) === null || _node$textContent === void 0
          ? void 0
          : _node$textContent.replace(/\n\s*/g, '')) !== ''
      );
    });
  } else if (StyleNodes.indexOf(el.nodeName) > -1) {
    // ! span strong 等包纯文本的标签
    // console.log(el);
    return jsx('text', nodeAttributes, el.textContent);
  }
  // todo 精确 children 类型
  var children = Array.from(temp)
    .map(function (n) {
      return deserialize(n, nodeAttributes);
    })
    .flat();
  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''));
  }
  var attrs = getAttributes(el);
  if (attrs.class) {
    attrs.className = attrs.class;
    delete attrs.class;
  }
  if (attrs.colspan) {
    attrs.colSpan = attrs.colspan;
    delete attrs.colspan;
  }
  if (attrs.rowspan) {
    attrs.rowSpan = attrs.rowspan;
    delete attrs.rowspan;
  }
  if (attrs.cellspacing) {
    attrs.cellSpacing = attrs.cellspacing;
    delete attrs.cellspacing;
  }
  if (attrs.cellpadding) {
    attrs.cellPadding = attrs.cellpadding;
    delete attrs.cellpadding;
  }
  if (attrs.style) {
    attrs.style = parseStyles(attrs.style);
  }
  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children);
    case 'BR':
      return {
        text: '\n',
      };
    case 'BLOCKQUOTE':
      return jsx(
        'element',
        {
          type: 'quote',
        },
        children,
      );
    case 'DIV':
    case 'P': {
      return jsx(
        'element',
        {
          type: 'paragraph',
          attrs: attrs,
        },
        children,
      );
    }
    case 'A':
      return jsx(
        'element',
        {
          type: 'link',
          url: el.getAttribute('href'),
          target: el.getAttribute('target'),
          attrs: attrs,
        },
        children,
      );
    case 'IMG':
      // console.log('image = ', children);
      return jsx(
        'element',
        {
          type: 'img',
          url: el.getAttribute('src'),
          attrs: attrs,
        },
        children,
      );
    default:
      return children;
  }
};
var htmlToContent = function htmlToContent() {
  var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var html = str;
  // 空白内容
  if (!html) {
    html = '<p><br></p>';
  }
  // 非 HTML 格式，文本格式，用 <p> 包裹
  if (html.indexOf('<') !== 0) {
    // html = html
    //   .split(/\n/)
    //   .map((line) => `<p>${line}</p>`)
    //   .join('');
    html = '<p>'.concat(html, '</p>');
  }
  // console.log('html', html);
  var document = new DOMParser().parseFromString(html, 'text/html');
  var toSlateJSON = deserialize(document.body);
  return toSlateJSON;
};

var PluginUuidContext = /*#__PURE__*/ React.createContext({
  uuid: undefined,
  type: undefined,
});
var usePluginUuid = function usePluginUuid() {
  return useContext(PluginUuidContext);
};
var GlobalPluginContext = /*#__PURE__*/ React.createContext({});
var GlobalPluginConsumer = GlobalPluginContext.Consumer,
  GlobalPluginProvider = GlobalPluginContext.Provider;
var usePluginHelper = function usePluginHelper() {
  return React.useContext(GlobalPluginContext);
};
var usePlugin = function usePlugin() {
  var _matchPlugin$props, _pluginProps;
  var _usePluginUuid = usePluginUuid(),
    uuid = _usePluginUuid.uuid,
    type = _usePluginUuid.type;
  var _React$useContext = React.useContext(ConfigContext),
    plugins = _React$useContext.plugins,
    pluginProps = _React$useContext.pluginProps;
  var globalPluginHelper = usePluginHelper();
  var setVisibleKey = globalPluginHelper.setVisibleKey;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    visible = _useState2[0],
    setVisible = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    disabled = _useState4[0],
    setDisabled = _useState4[1];
  useEffect(
    function () {
      setVisible(globalPluginHelper.visibleKey === uuid);
    },
    [globalPluginHelper.visibleKey, uuid],
  );
  useEffect(
    function () {
      var _globalPluginHelper$d, _globalPluginHelper$d2;
      setDisabled(
        (_globalPluginHelper$d =
          (_globalPluginHelper$d2 = globalPluginHelper.disabledTypes) === null ||
          _globalPluginHelper$d2 === void 0
            ? void 0
            : _globalPluginHelper$d2.includes(type)) !== null && _globalPluginHelper$d !== void 0
          ? _globalPluginHelper$d
          : false,
      );
    },
    [globalPluginHelper.disabledTypes, type],
  );
  var matchPlugin =
    plugins === null || plugins === void 0
      ? void 0
      : plugins.find(function (plugin) {
          return plugin.uuid === uuid;
        });
  var toggleVisible = useCallback(
    function (v) {
      if (v) {
        setVisibleKey === null || setVisibleKey === void 0
          ? void 0
          : setVisibleKey(
              matchPlugin === null || matchPlugin === void 0 ? void 0 : matchPlugin.uuid,
            );
      } else {
        setVisibleKey === null || setVisibleKey === void 0 ? void 0 : setVisibleKey(undefined);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uuid],
  );
  return {
    visible: visible,
    setVisible: toggleVisible,
    props: _objectSpread(
      _objectSpread(
        {},
        (_matchPlugin$props =
          matchPlugin === null || matchPlugin === void 0 ? void 0 : matchPlugin.props) !== null &&
          _matchPlugin$props !== void 0
          ? _matchPlugin$props
          : {},
      ),
      (_pluginProps =
        pluginProps === null || pluginProps === void 0
          ? void 0
          : pluginProps[type !== null && type !== void 0 ? type : '']) !== null &&
        _pluginProps !== void 0
        ? _pluginProps
        : {},
    ),
    uuid: uuid,
    type: matchPlugin === null || matchPlugin === void 0 ? void 0 : matchPlugin.type,
    disabled: disabled,
  };
};

var ConfigContext = /*#__PURE__*/ React.createContext(defaultConfig);
var ConfigConsumer = ConfigContext.Consumer,
  ConfigProvider = ConfigContext.Provider;
var useConfig = function useConfig() {
  return React.useContext(ConfigContext);
};
var useMessage = function useMessage() {
  var _usePlugin = usePlugin(),
    type = _usePlugin.type;
  var _useConfig = useConfig(),
    locales = _useConfig.locales,
    locale = _useConfig.locale;
  return function (id, defaultMessage) {
    var _locales$find;
    var targetLocale =
      (_locales$find = locales.find(function (i) {
        return i.locale === locale;
      })) !== null && _locales$find !== void 0
        ? _locales$find
        : {
            locale: 'default',
          };
    return (
      get(targetLocale, ''.concat(type ? ''.concat(type, '.').concat(id) : id), defaultMessage) ||
      defaultMessage
    );
  };
};

var DSlate = /*#__PURE__*/ forwardRef(function (_ref, ref) {
  var value = _ref.value,
    onChange = _ref.onChange,
    _ref$prefixCls = _ref.prefixCls,
    prefixCls = _ref$prefixCls === void 0 ? 'cslate' : _ref$prefixCls,
    children = _ref.children;
  var _useConfig = useConfig(),
    _useConfig$plugins = _useConfig.plugins,
    plugins = _useConfig$plugins === void 0 ? [] : _useConfig$plugins,
    pluginProps = _useConfig.pluginProps;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  var editor = useMemo(function () {
    return withPlugins(withReact(createEditor()), plugins);
  }, []);
  var _useState = useState(undefined),
    _useState2 = _slicedToArray(_useState, 2),
    visibleKey = _useState2[0],
    setVisibleKey = _useState2[1];
  var _useState3 = useState(0),
    _useState4 = _slicedToArray(_useState3, 2),
    percent = _useState4[0],
    setPercent = _useState4[1];
  var getPrefixCls = useCallback(
    function (key) {
      return ''.concat(prefixCls).concat(key ? '-'.concat(key) : '');
    },
    [prefixCls],
  );
  var _useState5 = useState([]),
    _useState6 = _slicedToArray(_useState5, 2),
    disabledTypes = _useState6[0],
    setDisabledTypes = _useState6[1];
  var enablePluginByType = useCallback(
    function (type) {
      var types = Array.isArray(type) ? type : [type];
      setDisabledTypes(
        disabledTypes.filter(function (i) {
          return !types.includes(i);
        }),
      );
    },
    [disabledTypes],
  );
  var disablePluginByType = useCallback(
    function (type) {
      var types = Array.isArray(type) ? type : [type];
      setDisabledTypes(
        Array.from(
          new Set([].concat(_toConsumableArray(disabledTypes), _toConsumableArray(types))),
        ),
      );
    },
    [disabledTypes],
  );
  var serialize = useCallback(
    function (node) {
      if (Text.isText(node)) {
        var _style = mergeStyle(node, plugins, 'text', editor);
        return '<span style="'
          .concat(style2string(_style), '">')
          .concat(escapeHtml(node.text), '</span>');
      }
      var childrenHtml = node.children.map(function (n) {
        return serialize(n);
      });
      var style = mergeStyle(node, plugins, 'element', editor);
      var match = Object.values(plugins).find(function (i) {
        return i.type === node.type && i.nodeType === 'element';
      });
      if (match && match.serialize) {
        var _match$props, _pluginProps, _match$type;
        var matchPluginProps = _objectSpread(
          _objectSpread(
            _objectSpread(
              {},
              (_match$props = match === null || match === void 0 ? void 0 : match.props) !== null &&
                _match$props !== void 0
                ? _match$props
                : {},
            ),
            (_pluginProps =
              pluginProps === null || pluginProps === void 0
                ? void 0
                : pluginProps[
                    (_match$type = match.type) !== null && _match$type !== void 0 ? _match$type : ''
                  ]) !== null && _pluginProps !== void 0
              ? _pluginProps
              : {},
          ),
          {},
          {
            style: style2string(style),
          },
        );
        return match.serialize(node, matchPluginProps, childrenHtml);
      }
      return childrenHtml.join('').replace(/ style=\"\"/gi, '');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [plugins, pluginProps],
  );
  var getEditor = useCallback(
    function () {
      return editor;
    },
    [editor],
  );
  useImperativeHandle(
    ref,
    function () {
      return {
        serialize: serialize,
        getEditor: getEditor,
      };
    },
    [serialize, getEditor],
  );
  return /*#__PURE__*/ React.createElement(
    GlobalPluginProvider,
    {
      value: {
        getPrefixCls: getPrefixCls,
        visibleKey: visibleKey,
        setVisibleKey: setVisibleKey,
        disabledTypes: disabledTypes,
        enablePluginByType: enablePluginByType,
        disablePluginByType: disablePluginByType,
        setPercent: setPercent,
        percent: percent,
      },
    },
    /*#__PURE__*/ React.createElement(
      Slate,
      {
        editor: editor,
        value: value,
        onChange: onChange,
      },
      children,
    ),
  );
});

var Locales = {
  zhCN: 'zh-cn',
  enUS: 'en',
};

export default DSlate;
export {
  ConfigConsumer,
  ConfigContext,
  ConfigProvider,
  GlobalPluginConsumer,
  GlobalPluginContext,
  GlobalPluginProvider,
  Locales,
  PluginUuidContext,
  base64file,
  clearBlockProps,
  defaultConfig,
  emptyNodes,
  get,
  getBlockProps,
  getTextProps,
  htmlToContent,
  isBlockActive,
  isEmpty,
  isStart,
  mergeLocalteFromPlugins,
  mergeStyle,
  parseStyles,
  promiseUploadFunc,
  setBlockProps,
  setTextProps,
  style2string,
  toggleBlock,
  toggleTextProps,
  useConfig,
  useMessage,
  usePlugin,
  usePluginHelper,
  usePluginUuid,
  withPlugins,
};
