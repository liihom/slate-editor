import React from 'react';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
import type { DSlatePlugin, Locale } from '../typing';
export type ConfigContextType = {
  plugins: DSlatePlugin[];
  locales: Locale[];
  locale: string;
  pluginProps?: Record<string, any>;
  iconScriptUrl?: string | string[];
  customUploadRequest?: (options: UploadRequestOption) => void;
};
declare const ConfigContext: React.Context<ConfigContextType>;
declare const ConfigConsumer: React.Consumer<ConfigContextType>,
  ConfigProvider: React.Provider<ConfigContextType>;
export { ConfigConsumer, ConfigProvider };
export { ConfigContext };
export declare const useConfig: () => ConfigContextType;
export declare const useMessage: () => (id: string, defaultMessage: string) => string;
