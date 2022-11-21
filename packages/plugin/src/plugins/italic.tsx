import React from 'react';
import { useSlate } from 'slate-react';
import { Locales } from '@cslate/core';

import { IconFont, Toolbar } from '@cslate/component';
import type { DSlatePlugin } from '@cslate/core';

import { useMessage, getTextProps, toggleTextProps } from '@cslate/core';

const ToolbarButton = () => {
  const editor = useSlate();
  const getMessage = useMessage();

  return (
    <Toolbar.Button
      active={getTextProps(editor, 'italic')}
      onClick={() => {
        toggleTextProps(editor, 'italic');
      }}
      tooltip={getMessage('tooltip', '斜体')}
    >
      <IconFont type="icon-italic" />
    </Toolbar.Button>
  );
};

const ItalicPlugin: DSlatePlugin = {
  type: 'italic',
  nodeType: 'text',
  toolbar: <ToolbarButton />,
  renderStyle: { fontStyle: 'italic' },
  locale: [
    { locale: Locales.zhCN, tooltip: '斜体' },
    { locale: Locales.enUS, tooltip: 'italic' },
  ],
};

export { ItalicPlugin };
