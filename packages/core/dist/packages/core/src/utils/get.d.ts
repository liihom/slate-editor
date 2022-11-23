import type { Locale } from '../typing';
/**
 * this method code from
 * https://github.com/ant-design/pro-components/blob/8e5fb7f1c0a027c68465406ed915d90f33267b07/packages/provider/src/index.tsx#L96
 */
export declare const get: (
  source: Locale,
  path: string,
  defaultValue?: string,
) => string | undefined;
