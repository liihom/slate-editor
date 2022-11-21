import React from 'react';
import { Locales } from '@cslate/core';
import type { DSlatePlugin } from '@cslate/core';
import { usePlugin } from '@cslate/core';

import { useSlate } from 'slate-react';
import { Toolbar } from '@cslate/component';
import { useMessage, getTextProps, setTextProps } from '@cslate/core';
import type { Descendant } from 'slate';

const DEFAULT_FONT_SIZE = 14;
const TYPE = 'font-size';

const renderStyle = (text: Descendant) => {
  if (text[TYPE]) {
    return { fontSize: text?.[TYPE] };
  }
  return {};
};

const DefaultSizes = [12, 13, 14, 15, 16, 19, 22, 24, 29, 32, 40, 48];

const ToolbarButton = () => {
  const editor = useSlate();
  const getMessage = useMessage();

  const { props } = usePlugin();

  const onChange = (size: number) => {
    setTextProps(editor, TYPE, size);
  };

  return (
    <Toolbar.Select<number>
      width={38}
      placeholder="14px"
      onChange={onChange}
      options={(props?.sizes ?? DefaultSizes).map((size: number) => ({
        label: `${size}px`,
        value: size,
      }))}
      tooltip={getMessage('tooltip', '字体大小')}
      value={getTextProps(editor, TYPE, DEFAULT_FONT_SIZE)}
    />
  );
};

const FontSizePlugin: DSlatePlugin = {
  type: 'font-size',
  nodeType: 'text',
  toolbar: <ToolbarButton />,
  renderStyle,
  locale: [
    { locale: Locales.zhCN, tooltip: '字体大小' },
    { locale: Locales.enUS, tooltip: 'font size' },
  ],
  props: {
    sizes: DefaultSizes,
  },
};

export { FontSizePlugin };
