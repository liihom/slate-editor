import React from 'react';
interface IProps {
  content?: string;
  placeholder?: string;
  toolbar?: ('img' | 'emotion')[];
  uploadImgServer: string;
}
/**
 * 判断是否是 Server 端
 * 根据 `window` 对象是否存在来判断
 */
export declare function isServer(): boolean;
declare const ClubEditor: React.ForwardRefExoticComponent<IProps & React.RefAttributes<unknown>>;
export { ClubEditor };
