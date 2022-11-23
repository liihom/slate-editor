import type { Editor } from 'slate';
import type { DSlatePlugin } from '../typing';
export declare const withPlugins: (
  editor: Editor,
  plugins: DSlatePlugin[],
) => import('../typing').DSlateEditor;
