import classnames from 'classnames';
import React from 'react';
import { usePlugin, usePluginHelper } from '@auto/cslate-core';

export type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  tooltip?: string;
  className?: string;
  children?: React.ReactNode;
};

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  children,
  disabled = false,
  active = false,
  onClick,
  className,
}) => {
  const { disabled: globalDisabled } = usePlugin();
  const { getPrefixCls } = usePluginHelper();
  const prefixCls = getPrefixCls?.('toolbar-button');
  const isDisabled = disabled || globalDisabled;

  const Button = (
    <div
      className={classnames(`${prefixCls}`, className, {
        active,
        disabled: isDisabled,
      })}
      onClick={() => {
        if (!isDisabled) onClick?.();
      }}
    >
      {children}
    </div>
  );

  return Button;
};

export default ToolbarButton;
