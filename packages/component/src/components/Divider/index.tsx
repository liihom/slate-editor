import { usePluginHelper } from '@cslate/core';
import React from 'react';

export default () => {
  const { getPrefixCls } = usePluginHelper();
  return <div className={getPrefixCls?.('divider')} role="separator" />;
};
