import React from 'react';
import { Transforms } from 'slate';
import { useSlate } from 'slate-react';

import Upload from 'rc-upload';

import Img from './img';
import { promiseUploadFunc, usePluginHelper, useConfig } from '@cslate/core';

import type { Descendant } from 'slate';
import type { CSSProperties } from 'react';
import type { UploadRequestOption } from 'rc-upload/lib/interface';

import type { DSlatePlugin, RenderElementPropsWithStyle } from '@cslate/core';
import { Locales } from '@cslate/core';

import './index.less';

const TYPE = 'img';

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
  const { setPercent } = usePluginHelper();
  const { customUploadRequest } = useConfig();
  const editor = useSlate();

  const insertImg = async (option: UploadRequestOption) => {
    const { url } = await promiseUploadFunc(option, customUploadRequest, setPercent);
    Transforms.insertNodes(editor, { type: TYPE, url, children: [{ text: '' }] });
  };

  return (
    <Upload accept="image/*" customRequest={(option) => insertImg(option)}>
      <div className="editor_menu_item">
        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
          <g>
            <path
              d="M5,2.5 C3.61928813,2.5 2.5,3.61928813 2.5,5 L2.5,17 C2.5,18.3807119 3.61928813,19.5 5,19.5 L17,19.5 C18.3807119,19.5 19.5,18.3807119 19.5,17 L19.5,5 C19.5,3.61928813 18.3807119,2.5 17,2.5 L5,2.5 Z M5,1 L17,1 C19.209139,1 21,2.790861 21,5 L21,17 C21,19.209139 19.209139,21 17,21 L5,21 C2.790861,21 1,19.209139 1,17 L1,5 C1,2.790861 2.790861,1 5,1 Z M6.5,8 C5.67157288,8 5,7.32842712 5,6.5 C5,5.67157288 5.67157288,5 6.5,5 C7.32842712,5 8,5.67157288 8,6.5 C8,7.32842712 7.32842712,8 6.5,8 Z M18.2302491,10.5759131 C18.6269911,10.6949454 18.8521192,11.1130631 18.7330868,11.5098051 C18.6140545,11.906547 18.1959368,12.1316751 17.7991948,12.0126427 C17.2209155,11.8391447 16.6168492,11.75 16,11.75 C12.5482203,11.75 9.75,14.5482203 9.75,18 C9.75,18.4142136 9.41421356,18.75 9,18.75 C8.58578644,18.75 8.25,18.4142136 8.25,18 C8.25,13.7197932 11.7197932,10.25 16,10.25 C16.7632422,10.25 17.512504,10.3605718 18.2302491,10.5759131 Z"
              id="合并形状"
            />
          </g>
        </svg>
      </div>
    </Upload>
  );
};

const ImgPlugin: DSlatePlugin = {
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

export { ImgPlugin };
