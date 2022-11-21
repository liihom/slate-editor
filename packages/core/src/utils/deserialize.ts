/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable no-console */
/**
 * @file - 反序列化
 * html to slate node to
 * TODO：优化内建约束
 */
import { jsx } from 'slate-hyperscript';
// import { Text } from 'slate';

export enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
}

export enum StyleNodeTags {
  STRONG = 'STRONG',
  EM = 'EM',
  DEL = 'DEL',
  U = 'U',
  SUB = 'SUB',
  SUP = 'SUP',
  CODE = 'CODE',
  SPAN = 'SPAN',
}

const StyleNodes = ['STRONG', 'EM', 'DEL', 'U', 'SUB', 'SUP', 'CODE', 'SPAN'];

const getAttributes = (el: HTMLElement) => {
  return el.getAttributeNames().reduce((acc, name) => {
    return { ...acc, [name]: el.getAttribute(name) };
  }, {});
};

// // const Reg_Element = /^(body|table|thead|tbody|tfoot|tr|td|th|div|p)$/i;

// // https://github.com/remarkablemark/style-to-js
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const parseStyles = (styles: string) => {
  if (!styles) return null;
  return styles
    .split(';')
    .filter((style) => style.split(':')[0] && style.split(':')[1])
    .map((style) => [
      style
        .split(':')[0]
        .trim()
        .replace(/-./g, (c) => c.substr(1).toUpperCase()),
      style.split(':')[1].trim(),
    ])
    .reduce(
      (styleObj, style) => ({
        ...styleObj,
        [style[0]]: style[1],
      }),
      {},
    );
};

export const emptyNodes = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

/**
 * 反序列化 html to slate node
 * 将 html 字符串转化为 slate 编辑器识别的 node 节点结构
 * 注意要符合 slate 内建约束 @see https://rain120.github.io/athena/zh/slate/concepts/10-normalizing.html#%E5%86%85%E5%BB%BA%E7%BA%A6%E6%9D%9F-built-in-constraints
 * @return - slate node
 */
const deserialize = (el: HTMLElement, markAttributes = {}) => {
  // console.log('el=', el);
  if (el.nodeType === NodeType.TEXT_NODE) {
    // ! 是文本节点内容，直接返回文本
    return jsx('text', {}, el.textContent);
    // return { text: el.textContent };
  }
  if (el.nodeType !== NodeType.ELEMENT_NODE) {
    return null;
  }

  const nodeAttributes = { ...markAttributes };

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
    default:
      break;
  }

  const hasElement = el.children.length > 0;
  let temp = Array.from(el.childNodes);
  if (hasElement) {
    // TODO 是否有更安全的判断办法过滤掉无意义的 text node
    // TODO 判断文本节点不为空的逻辑是否安全
    temp = temp.filter(
      (node) =>
        node['nodeType'] !== Node.TEXT_NODE || node['textContent']?.replace(/\n\s*/g, '') !== '',
    );
  } else if (StyleNodes.indexOf(el.nodeName) > -1) {
    // ! span strong 等包纯文本的标签
    // console.log(el);
    return jsx('text', nodeAttributes, el.textContent);
  }

  // todo 精确 children 类型
  const children: any[] = Array.from(temp)
    .map((n: any) => {
      return deserialize(n, nodeAttributes);
    })
    .flat();

  if (children.length === 0) {
    children.push(jsx('text', nodeAttributes, ''));
  } else {
    // const len = children.length;
    // const lastChild = children[len - 1];
    // if (!Text.isText(lastChild)) {
    //   children.push(jsx('text', nodeAttributes, ''));
    // }
  }

  const attrs: Record<string, any> = getAttributes(el);

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
      return { text: '\n' };
    case 'BLOCKQUOTE':
      return jsx('element', { type: 'quote' }, children);
    case 'DIV':
    case 'P': {
      return jsx('element', { type: 'paragraph', attrs }, children);
    }
    case 'A':
      return jsx(
        'element',
        {
          type: 'link',
          url: el.getAttribute('href'),
          target: el.getAttribute('target'),
          attrs,
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
          attrs,
        },
        children,
      );
    default:
      return children;
  }
};

export const htmlToContent = (str = '') => {
  let html = str;

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
    html = `<p>${html}</p>`;
  }

  // console.log('html', html);

  const document = new DOMParser().parseFromString(html, 'text/html');
  const toSlateJSON = deserialize(document.body);
  return toSlateJSON;
};
