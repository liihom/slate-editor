import type { Editor, NodeEntry } from 'slate';
import { nanoid } from 'nanoid';
import type { DSlatePlugin } from '../typing';

export const withPlugins = (editor: Editor, plugins: DSlatePlugin[]) => {
  return plugins.reduce<Editor>((preEditor, plugin) => {
    if (!plugin.uuid) plugin.uuid = `${plugin.type}_${nanoid()}`;
    const { isVoid, isInline, normalizeNode } = preEditor;

    if (plugin.isDefaultElement) preEditor.defaultElement = plugin.type;

    if ('isVoid' in plugin) {
      preEditor.isVoid = (element) => {
        if (element.type === plugin.type) {
          if (!plugin.isVoid) return false;
          return typeof plugin.isVoid === 'function' ? plugin.isVoid(element) : plugin.isVoid;
        }
        return isVoid(element);
      };
    }

    if ('isInline' in plugin) {
      preEditor.isInline = (element) => {
        if (element.type === plugin.type) {
          if (!plugin.isInline) return false;
          return typeof plugin.isInline === 'function' ? plugin.isInline(element) : plugin.isInline;
        }
        return isInline(element);
      };
    }

    if ('normalizeNode' in plugin) {
      preEditor.normalizeNode = (entry: NodeEntry) => {
        if (plugin.normalizeNode) {
          plugin.normalizeNode(entry, editor, normalizeNode);
          return;
        }
        normalizeNode(entry);
      };
    }

    if (typeof plugin?.withPlugin === 'function') {
      return plugin?.withPlugin(preEditor);
    }

    return preEditor;
  }, editor);
};
