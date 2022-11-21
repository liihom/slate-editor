import type { DSlateProps } from '@cslate/core';
import type { ProgressProps, ShowCountProps } from '@cslate/core';

export interface SemiStyleDSlateProps extends Omit<DSlateProps, 'prefixCls'> {
  toolbar?: string[];
  bordered?: boolean;
  showCount?: boolean | ShowCountProps;
  disabled?: boolean;
  placeholder?: string;
  progress?: ProgressProps;
  className?: string;
}
