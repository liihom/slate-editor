/* eslint-disable react/no-array-index-key */
import React, { useContext, useMemo } from 'react';
import type { DSlatePlugin } from '@cslate/core';
import { usePluginHelper, ConfigContext } from '@cslate/core';

import ToolbarItem from './ToolbarItem';

import ToolbarButton from './ToolbarButton';

import type { ToolbarButtonProps } from './ToolbarButton';

export interface ToolbarProps {
  toolbar?: string[];
}

const Toolbar = ({ toolbar }: ToolbarProps) => {
  const { plugins } = useContext(ConfigContext);
  const { getPrefixCls } = usePluginHelper();
  const prefixCls = getPrefixCls?.('toolbar');

  const ToolbarItems = useMemo(() => {
    return toolbar?.map((type, index) => {
      const plugin = plugins.find((i: DSlatePlugin) => i.type === type);
      if (plugin && plugin.toolbar) {
        return (
          <ToolbarItem plugin={plugin} key={`${type}-${index}`}>
            {plugin.toolbar}
          </ToolbarItem>
        );
      }
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolbar]);

  return <div className={prefixCls}>{ToolbarItems}</div>;
};

export { ToolbarButton };

export type { ToolbarButtonProps };

Toolbar.Button = ToolbarButton;

export default Toolbar;
