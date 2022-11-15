import { Editor, Node } from 'slate';

export const isEmpty = (editor: Editor) => {
  if (!editor.selection) return false;
  const block = Editor.above(editor)?.[0];
  if (!block) return false;
  return Node.string(block) === '' && !block.children.some((n) => Editor.isInline(editor, n));
};
