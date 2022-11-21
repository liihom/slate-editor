/**
 * @file - 表情工具
 */

import React, { useState } from 'react';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';
import clns from 'classnames';

import { Toolbar } from '@cslate/component';

import Img from './img';
import { useMessage } from '@cslate/core';

import type { Descendant } from 'slate';
import type { CSSProperties } from 'react';

import type { DSlatePlugin, RenderElementPropsWithStyle } from '@cslate/core';
import { Locales } from '@cslate/core';

import { emotions } from './data';
import './index.less';

const TYPE = 'emotion';

const renderElement = (props: RenderElementPropsWithStyle) => {
  return <Img {...props} />;
};

const renderStyle = (node: Descendant) => {
  if (node.type === TYPE) {
    const style: CSSProperties = {};
    if (node.imgWidth) style.width = node.imgWidth;
    if (node.imgHeight) style.height = node.imgHeight;
    return style;
  }
  return {};
};

const ToolbarButton = () => {
  const [emotionVisible, setEmotionVisible] = useState(false);

  const editor = useSlate();
  const getMessage = useMessage();

  const insertImg = (url: string) => {
    Transforms.insertNodes(editor, { type: TYPE, url, children: [{ text: '' }] });
  };

  return (
    <div className="editor_menu_item">
      <svg
        width="22px"
        height="22px"
        viewBox="0 0 22 22"
        version="1.1"
        onClick={() => {
          setEmotionVisible(true);
        }}
      >
        <g>
          <path
            d="M11,20.5 C16.2467051,20.5 20.5,16.2467051 20.5,11 C20.5,5.75329488 16.2467051,1.5 11,1.5 C5.75329488,1.5 1.5,5.75329488 1.5,11 C1.5,16.2467051 5.75329488,20.5 11,20.5 Z M11,22 C4.92486775,22 0,17.0751322 0,11 C0,4.92486775 4.92486775,0 11,0 C17.0751322,0 22,4.92486775 22,11 C22,17.0751322 17.0751322,22 11,22 Z M7.46511838,16.4104631 C7.18834668,16.1022906 7.21380206,15.6280996 7.52197458,15.3513279 C7.83014709,15.0745562 8.30433807,15.1000116 8.58110978,15.4081841 C9.19435465,16.0910039 10.064349,16.487538 11,16.487538 C11.929126,16.487538 12.7935946,16.0965667 13.4063793,15.4220348 C13.6849034,15.1154452 14.1592318,15.0926937 14.4658214,15.3712179 C14.772411,15.649742 14.7951625,16.1240704 14.5166384,16.43066 C13.6224592,17.414941 12.3564019,17.987538 11,17.987538 C9.63405066,17.987538 8.35994972,17.4068165 7.46511838,16.4104631 Z M16,11.5 C16.8284271,11.5 17.5,10.8284271 17.5,10 C17.5,9.17157288 16.8284271,8.5 16,8.5 C15.1715729,8.5 14.5,9.17157288 14.5,10 C14.5,10.8284271 15.1715729,11.5 16,11.5 Z M16,13 C14.3431458,13 13,11.6568542 13,10 C13,8.34314575 14.3431458,7 16,7 C17.6568542,7 19,8.34314575 19,10 C19,11.6568542 17.6568542,13 16,13 Z M4.69190667,8.25177093 C4.41650539,7.94237312 4.44406502,7.46829978 4.75346283,7.1928985 C5.06286064,6.91749721 5.53693398,6.94505684 5.81233527,7.25445465 L7.81233527,9.50134186 C8.06531359,9.78554873 8.06539162,10.2141552 7.81251679,10.4984541 L5.81251679,12.7469893 C5.53722818,13.0564874 5.0631649,13.0842196 4.75366684,12.808931 C4.44416877,12.5336424 4.41643653,12.0595791 4.69172515,11.750081 L6.2482036,10.0001828 L4.69190667,8.25177093 Z"
            id="合并形状"
          />
        </g>
      </svg>
      {emotionVisible && (
        <div className={'menu_panel_container'}>
          <i
            className={'menu_panel_close'}
            onClick={() => {
              setEmotionVisible(false);
            }}
          >
            <svg viewBox="0 0 1024 1024" version="1.1" width="16" height="16">
              <path
                d="M960.2 110.3l-46.5-46.5-401.3 401.3L116.9 69.6l-46.5 46.5 395.5 395.5L63.8 913.7l46.5 46.5 402.1-402.1 395.5 395.5 46.5-46.5-395.5-395.5z"
                p-id="3911"
              />
            </svg>
          </i>
          <ul className={'menu_panel_tab_title'}>
            <li className={clns('menu_panel_item', 'menu_panel_item_active')}>默认</li>
          </ul>
          <div className={'menu_panel_tab_content'}>
            <div className={'menu_panel_emoticon_container'}>
              {emotions[0].content.map((item) => (
                <span
                  key={item.alt}
                  className="item"
                  onClick={() => {
                    insertImg(item.src);
                    setEmotionVisible(false);
                  }}
                >
                  <img src={item.src} alt={item.alt} />
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EmotionPlugin: DSlatePlugin = {
  type: TYPE,
  nodeType: 'element',
  toolbar: <ToolbarButton />,
  isVoid: true,
  isInline: true,
  renderElement,
  renderStyle,
  props: {
    loadingStyle: {
      minHeight: 150,
      minWidth: 300,
    } as CSSProperties,
    maxWidth: false,
    defaultWidth: undefined,
    loadingText: '图片加载中...',
  },
  locale: [
    {
      locale: Locales.zhCN,
      tooltip: '上传图片',
      change: '修改图片',
      confirm: '确认',
      height: '高',
      width: '宽',
      loading: '图片加载中',
      remove: '删除',
    },
    {
      locale: Locales.enUS,
      tooltip: 'upload image',
      change: 'change image',
      confirm: 'confirm',
      height: 'height',
      width: 'width',
      loading: 'loading',
      remove: 'remove',
    },
  ],
  serialize: (element, props) => {
    const style = [];
    if (props?.style) style.push(props.style);
    if (props?.maxWidth) style.push(`max-width: ${props.maxWidth}; height: auto;`);
    return `<img style="${style.join('')}" src="${element.url}" />`;
  },
};

export { EmotionPlugin };
