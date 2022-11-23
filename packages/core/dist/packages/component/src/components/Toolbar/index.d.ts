import React from 'react';
import ToolbarButton from './ToolbarButton';
import type { ToolbarButtonProps } from './ToolbarButton';
export interface ToolbarProps {
  toolbar?: string[];
}
declare const Toolbar: {
  ({ toolbar }: ToolbarProps): JSX.Element;
  Button: React.FC<ToolbarButtonProps>;
};
export { ToolbarButton };
export type { ToolbarButtonProps };
export default Toolbar;
