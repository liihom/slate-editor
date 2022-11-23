export declare enum NodeType {
  ELEMENT_NODE = 1,
  TEXT_NODE = 3,
  CDATA_SECTION_NODE = 4,
  PROCESSING_INSTRUCTION_NODE = 7,
  COMMENT_NODE = 8,
  DOCUMENT_NODE = 9,
  DOCUMENT_TYPE_NODE = 10,
  DOCUMENT_FRAGMENT_NODE = 11,
}
export declare enum StyleNodeTags {
  STRONG = 'STRONG',
  EM = 'EM',
  DEL = 'DEL',
  U = 'U',
  SUB = 'SUB',
  SUP = 'SUP',
  CODE = 'CODE',
  SPAN = 'SPAN',
}
export declare const parseStyles: (styles: string) => {} | null;
export declare const emptyNodes: {
  type: string;
  children: {
    text: string;
  }[];
}[];
export declare const htmlToContent: (
  str?: string,
) => any[] | import('..').DSlateCustomText | import('..').DSlateCustomElement | null;
