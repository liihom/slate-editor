import React from 'react';
import { Editor, Text, Transforms } from 'slate';
import { Locales } from '@cslate/core';
import { useSlate } from 'slate-react';
import { Toolbar } from '@cslate/component';
import type { DSlatePlugin } from '@cslate/core';
import { useMessage } from '@cslate/core';

const clearStyle = (editor: Editor) => {
  if (!editor.selection) return;

  const texts = Array.from(
    Editor.nodes(editor, {
      match: (n) => Text.isText(n) && Object.keys(n).length > 1,
    }),
  );

  let clearMarks = [];
  for (const text of texts) {
    clearMarks.push(...Object.keys(text[0]).filter((i) => !['text'].includes(i)));
  }

  clearMarks = Array.from(new Set(clearMarks));

  if (clearMarks.length > 0) {
    Transforms.unsetNodes(editor, clearMarks, {
      match: Text.isText,
      split: true,
    });
  }
};

const ToolbarButton = () => {
  const editor = useSlate();
  const getMessage = useMessage();

  return (
    <Toolbar.Button
      onClick={() => {
        clearStyle(editor);
      }}
      tooltip={getMessage('tooltip', '清理格式')}
    >
      {/* <IconFont type="icon-empty" /> */}
    </Toolbar.Button>
  );
};

const ClearPlugin: DSlatePlugin = {
  type: 'clear',
  nodeType: 'tool',
  toolbar: <ToolbarButton />,
  locale: [
    { locale: Locales.zhCN, tooltip: '清理格式' },
    { locale: Locales.enUS, tooltip: 'clear style' },
  ],
};

export { ClearPlugin };
