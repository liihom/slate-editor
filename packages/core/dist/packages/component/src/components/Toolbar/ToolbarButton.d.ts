import React from 'react';
export type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  className?: string;
  children?: React.ReactNode;
};
declare const ToolbarButton: React.FC<ToolbarButtonProps>;
export default ToolbarButton;
