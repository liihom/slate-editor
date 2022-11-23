import React from 'react';
export type GlobalPluginContextType = {
  visibleKey?: React.Key;
  setVisibleKey?: (Key?: React.Key) => void;
  getPrefixCls?: (key: string) => string;
  disabledTypes?: string[];
  enablePluginByType?: (key: string | string[]) => void;
  disablePluginByType?: (key: string | string[]) => void;
  setPercent?: (percent: number) => void;
  percent?: number;
};
export type PluginContextType = {
  visible?: boolean;
  setVisible?: (visible: boolean) => void;
  props?: Record<string, any>;
  uuid?: React.Key;
  type?: string;
  disabled?: boolean;
};
export declare const PluginUuidContext: React.Context<{
  uuid?: React.Key | undefined;
  type?: string | undefined;
}>;
export declare const usePluginUuid: () => {
  uuid?: React.Key | undefined;
  type?: string | undefined;
};
declare const GlobalPluginContext: React.Context<GlobalPluginContextType>;
export { GlobalPluginContext };
declare const GlobalPluginConsumer: React.Consumer<GlobalPluginContextType>,
  GlobalPluginProvider: React.Provider<GlobalPluginContextType>;
export { GlobalPluginConsumer, GlobalPluginProvider };
export declare const usePluginHelper: () => GlobalPluginContextType;
export declare const usePlugin: () => PluginContextType;
