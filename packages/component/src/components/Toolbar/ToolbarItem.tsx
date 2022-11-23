import React from 'react';
import { PluginUuidContext, usePluginHelper } from '@auto/cslate-core';
import type { DSlatePlugin } from '@auto/cslate-core';

interface ToolbarItemProps {
  plugin: DSlatePlugin;
  children: React.ReactNode;
}

const ToolbarItem: React.FC<ToolbarItemProps> = ({ children, plugin }) => {
  const { getPrefixCls } = usePluginHelper();

  if (!children) return null;
  return (
    <PluginUuidContext.Provider
      value={{
        uuid: plugin.uuid,
        type: plugin.type,
      }}
    >
      <div
        className={getPrefixCls?.('toolbar-item')}
        onMouseDown={(event) => {
          const target: any = event.target;
          if (target && target?.nodeName === 'INPUT') return;
          event.preventDefault();
        }}
      >
        {children}
      </div>
    </PluginUuidContext.Provider>
  );
};

export default React.memo<React.PropsWithChildren<ToolbarItemProps>>(ToolbarItem);
