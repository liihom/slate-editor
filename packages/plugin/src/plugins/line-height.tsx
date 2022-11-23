import type { CSSProperties } from 'react';
import type { Descendant } from 'slate';
import { Locales } from '@auto/cslate-core';
import type { DSlatePlugin } from '@auto/cslate-core';

const TYPE = 'line-height';

const renderStyle = (text: Descendant) => {
  if (text[TYPE]) {
    return { lineHeight: text?.[TYPE] } as CSSProperties;
  }
  return {};
};

const DefaultLineHeight = [1, 2, 2.5, 3];

// const ToolbarButton = () => {
//   const editor = useSlate();
//   const getMessage = useMessage();

//   const { props } = usePlugin();

//   const onChange = (lineHeight: number | undefined) => {
//     setTextProps(editor, TYPE, lineHeight);
//   };

//   return (
//     <Toolbar.Select<number | undefined>
//       placeholder={<>placeholdersss</>}
//       onChange={onChange}
//       options={[
//         {
//           label: getMessage('default', '默认'),
//           value: undefined,
//           placeholder: <>placeholdersss</>,
//         },
//         ...(props?.heights ?? DefaultLineHeight).map((height: number | undefined) => ({
//           label: `${height}`,
//           value: height,
//           placeholder: <>placeholdersss</>,
//         })),
//       ]}
//       tooltip={getMessage('tooltip', '行高')}
//       value={getTextProps(editor, TYPE, undefined)}
//     />
//   );
// };

const LineHeightPlugin: DSlatePlugin = {
  type: 'line-height',
  nodeType: 'text',
  // toolbar: <ToolbarButton />,
  renderStyle,
  locale: [
    { locale: Locales.zhCN, tooltip: '行高', default: '默认' },
    { locale: Locales.enUS, tooltip: 'line height', default: 'default' },
  ],
  props: {
    heights: DefaultLineHeight,
  },
};

export { LineHeightPlugin };
