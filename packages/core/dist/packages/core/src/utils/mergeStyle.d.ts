import type { CSSProperties } from 'react';
import type { Descendant, Editor } from 'slate';
import type { DSlatePlugin } from '../typing';
export declare const mergeStyle: (
  node: Descendant,
  plugins: DSlatePlugin[],
  nodeType: string,
  editor: Editor,
) => {};
export declare function splitCamel(str: string): string;
export declare const style2string: (style: CSSProperties) => string;
