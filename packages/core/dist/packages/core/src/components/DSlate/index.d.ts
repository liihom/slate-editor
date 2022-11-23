import React from 'react';
import type { Descendant, Editor } from 'slate';
export interface DSlateProps {
  value: Descendant[];
  onChange: (value: Descendant[]) => void;
  prefixCls?: string;
}
export type DSlateRef = {
  serialize: (v: any) => string;
  getEditor: () => Editor;
};
declare const DSlate: React.ForwardRefExoticComponent<
  DSlateProps & {
    children?: React.ReactNode;
  } & React.RefAttributes<DSlateRef>
>;
export default DSlate;
