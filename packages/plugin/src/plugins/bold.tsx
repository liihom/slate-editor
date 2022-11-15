import React from 'react';
import { useSlate } from 'slate-react';
import { Locales } from '@dslate/core';

import { IconFont, Toolbar } from '@dslate/component';
import type { DSlatePlugin } from '@dslate/core';
import { getTextProps, toggleTextProps, useMessage } from '@dslate/core';

const TYPE = 'bold';

const ToolbarButton = () => {
  const editor = useSlate();

  const getMessage = useMessage();

  return (
    <Toolbar.Button
      onClick={() => {
        toggleTextProps(editor, TYPE);
      }}
      active={getTextProps(editor, TYPE)}
      tooltip={getMessage('tooltip', '加粗')}
    >
      <IconFont type="icon-bold" />
    </Toolbar.Button>
  );
};

const BoldPlugin: DSlatePlugin = {
  type: TYPE,
  nodeType: 'text',
  toolbar: <ToolbarButton />,
  renderStyle: { fontWeight: 'bold' },
  locale: [
    { locale: Locales.zhCN, tooltip: '加粗' },
    { locale: Locales.enUS, tooltip: 'bold' },
  ],
};

export { BoldPlugin };
