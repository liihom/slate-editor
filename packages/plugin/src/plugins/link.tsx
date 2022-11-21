import React from 'react';
import { Editor, Node, Path, Point, Range, Text, Transforms } from 'slate';
import { Locales } from '@dslate/core';
import { useSlate } from 'slate-react';
import { IconFont, Toolbar } from '@dslate/component';
import { isBlockActive, useMessage } from '@dslate/core';
import type { NodeEntry } from 'slate';
import type { DSlatePlugin, NormalizeNode, RenderElementPropsWithStyle } from '@dslate/core';

const TYPE = 'link';

const ToolbarButton = () => {
  const editor = useSlate();
  const getMessage = useMessage();

  const toggle = () => {
    if (!editor.selection) return;
    const active = isBlockActive(editor, TYPE);

    if (active) {
      Transforms.unwrapNodes(editor, {
        match: (n) => n.type === TYPE,
        split: true,
      });
    } else {
      if (Range.isCollapsed(editor.selection)) {
        Transforms.insertNodes(editor, {
          type: TYPE,
          children: [{ text: getMessage('link', '链接') }],
        });
      } else {
        Transforms.wrapNodes(
          editor,
          {
            type: TYPE,
            children: [],
          },
          {
            at: editor.selection,
            match: (n) => Text.isText(n),
            split: true,
          },
        );
      }
    }
  };
  return (
    <Toolbar.Button
      tooltip={getMessage('link', '链接')}
      active={isBlockActive(editor, TYPE)}
      onClick={toggle}
    >
      <IconFont type="icon-link1" />
    </Toolbar.Button>
  );
};

const Link = ({ attributes, element, children }: RenderElementPropsWithStyle) => {
  return (
    <a {...attributes} href={element.href}>
      {children}
    </a>
  );
};

const renderElement = (props: RenderElementPropsWithStyle) => {
  return <Link {...props} />;
};

const normalizeNode = (entry: NodeEntry, editor: Editor, next: NormalizeNode) => {
  const [node, path] = entry;
  if (node.type === TYPE) {
    const isEmpty = Node.string(node).length === 0;
    if (isEmpty) {
      Transforms.unwrapNodes(editor, {
        at: path,
        match: (n) => !Editor.isEditor(n) && n.type === TYPE,
        split: true,
      });
      return;
    }
  }

  next(entry);
};

const withPlugin = (editor: Editor) => {
  const { insertText, insertBreak } = editor;

  editor.insertBreak = () => {
    const { selection } = editor;
    if (selection) {
      const [link] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && n.type === TYPE,
      });

      if (link) {
        return;
      }
    }

    insertBreak();
  };
  editor.insertText = (text) => {
    const { selection } = editor;

    if (selection && Range.isCollapsed(selection)) {
      const [link] = Editor.nodes(editor, {
        match: (n) => !Editor.isEditor(n) && n.type === TYPE,
      });

      if (link) {
        const [, linkPath] = link;
        const end = Editor.end(editor, linkPath);
        if (Point.equals(selection.anchor, end)) {
          Transforms.select(editor, Path.next(linkPath));
        }
      }
    }

    insertText(text);
  };

  return editor;
};
const LinkPlugin: DSlatePlugin = {
  type: TYPE,
  nodeType: 'element',
  isInline: true,
  renderElement,
  toolbar: <ToolbarButton />,
  withPlugin,
  normalizeNode,
  locale: [
    { locale: Locales.zhCN, link: '链接', clear: '清除链接' },
    { locale: Locales.enUS, link: 'link', clear: 'clear link' },
  ],
  serialize: (element, props, children) =>
    `<a style="${props.style ?? ''}" href="${element.href}">${children.join('')}</a>`,
};

export { LinkPlugin };
