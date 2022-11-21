import type { SizeType } from 'antd/lib/config-provider/SizeContext';
import type { DSlateProps } from '@cslate/core';
import type { ProgressProps, ShowCountProps } from '@cslate/core';
import type { RenderPlaceholderProps } from 'slate-react';

export interface AntdStyleDSlateProps extends Omit<DSlateProps, 'prefixCls'> {
  toolbar?: string[];
  bordered?: boolean;
  size?: SizeType;
  showCount?: boolean | ShowCountProps;
  disabled?: boolean;
  placeholder?: string;
  renderPlaceholder?: (props: RenderPlaceholderProps) => JSX.Element;
  progress?: ProgressProps;
  className?: string;
}
