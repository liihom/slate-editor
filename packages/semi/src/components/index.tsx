import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { useFocused } from 'slate-react';
import type { DSlateRef } from '@cslate/core';
import DSlate, { usePluginHelper } from '@cslate/core';
import { Toolbar, Progress, Editable, Counter } from '@cslate/component';

import type { SemiStyleDSlateProps } from '../typing';

import './index.less';
import './index.scss';

const SemiStyleEditor = ({
  bordered = true,
  showCount = false,
  disabled = false,
  placeholder,
  toolbar,
  className,
}: Omit<SemiStyleDSlateProps, 'value' | 'onChange'>) => {
  const focused = useFocused();
  const { getPrefixCls } = usePluginHelper();
  const prefixCls = getPrefixCls?.('');

  return (
    <div
      className={classNames(`${prefixCls}`, className, {
        [`${prefixCls}-disabled`]: disabled,
        [`${prefixCls}-borderless`]: !bordered,
        [`${prefixCls}-focused`]: focused,
      })}
    >
      <Toolbar toolbar={toolbar} />
      <div className={getPrefixCls?.('main-container')}>
        <Progress />
        <Editable disabled={disabled} placeholder={placeholder} />
        <Counter showCount={showCount} />
      </div>
    </div>
  );
};

export default forwardRef<DSlateRef, SemiStyleDSlateProps>(({ value, onChange, ...rest }, ref) => {
  return (
    <DSlate ref={ref} value={value} onChange={onChange} prefixCls={'semi-dslate'}>
      <SemiStyleEditor {...rest} />
    </DSlate>
  );
});
