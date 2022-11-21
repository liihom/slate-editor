import React, { forwardRef } from 'react';
import type { DSlateRef } from '@cslate/core';
import { ConfigProvider, ConfigConsumer, mergeLocalteFromPlugins } from '@cslate/core';

import DefaultPlugin from '@cslate/plugin';

import DSlate from './components';
import type { SemiStyleDSlateProps } from './typing';

import ZH_CN from './locale/zh_CN';
import EN_US from './locale/en_US';

export const DefaultLocales = [ZH_CN, EN_US];

export { DefaultPlugin };
export const DefaultToolbar = [
  'history',
  'clear',
  'divider',
  'paragraph',
  'font-size',
  'bold',
  'italic',
  'decoration',
  'color',
  'background-color',
  'divider',
  'text-align',
  'list',
  'todo-list',
  'text-indent',
  'line-height',
  'divider',
  'img',
  'link',
  'blockquote',
  'hr',
];
export default forwardRef<DSlateRef, SemiStyleDSlateProps>(
  ({ toolbar = DefaultToolbar, ...props }, ref) => {
    return (
      <ConfigConsumer>
        {(value) => {
          const plugins =
            !value.plugins || value.plugins.length === 0
              ? Object.values(DefaultPlugin)
              : value.plugins;
          const locales = value.locales ? value.locales : DefaultLocales;

          return (
            <ConfigProvider
              value={{
                ...value,
                locales: mergeLocalteFromPlugins(locales, plugins),
                plugins,
                iconScriptUrl: '//at.alicdn.com/t/c/font_3062978_atuqwazgoap.js',
              }}
            >
              <DSlate {...props} toolbar={toolbar} ref={ref} />
            </ConfigProvider>
          );
        }}
      </ConfigConsumer>
    );
  },
);
