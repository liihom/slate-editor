import { Editor } from 'slate';
export declare const isBlockActive: (editor: Editor, format: string) => boolean;
export declare const toggleBlock: (editor: Editor, format: string) => void;
export declare const getBlockProps: (editor: Editor, format: string, defaultValue: any) => any;
export declare const setBlockProps: (editor: Editor, format: string, value: any) => void;
export declare const clearBlockProps: (editor: Editor, format: string | string[]) => void;
