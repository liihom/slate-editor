import React from 'react';
import { useSlate } from 'slate-react';
import { withHistory } from 'slate-history';
import { Locales } from '@auto/cslate-core';

import type { DSlatePlugin } from '@auto/cslate-core';
import { useMessage } from '@auto/cslate-core';
import { Toolbar } from '@auto/cslate-component';

const ToolbarButton = () => {
  const editor = useSlate();
  const getMessage = useMessage();

  const undo = () => {
    editor?.undo();
  };

  const redo = () => {
    editor?.redo();
  };

  return (
    <>
      <Toolbar.Button
        onClick={undo}
        tooltip={getMessage('undo.tooltip', '撤消')}
        disabled={editor.history.undos.length === 0}
      >
        {/* <IconFont type="icon-undo1" /> */}
      </Toolbar.Button>
      <Toolbar.Button
        onClick={redo}
        tooltip={getMessage('redo.tooltip', '重做')}
        disabled={editor.history.redos.length === 0}
      >
        {/* <IconFont type="icon-redo1" /> */}
      </Toolbar.Button>
    </>
  );
};

const HistoryPlugin: DSlatePlugin = {
  type: 'history',
  nodeType: 'tool',
  toolbar: <ToolbarButton />,
  withPlugin: withHistory,
  locale: [
    {
      locale: Locales.zhCN,
      undo: {
        tooltip: '撤销',
      },
      redo: {
        tooltip: '重做',
      },
    },
    {
      locale: Locales.enUS,
      undo: {
        tooltip: 'undo',
      },
      redo: {
        tooltip: 'redo',
      },
    },
  ],
};

export { HistoryPlugin };
