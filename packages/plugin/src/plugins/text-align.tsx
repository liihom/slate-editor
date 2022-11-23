import { Locales } from '@auto/cslate-core';
import type { DSlatePlugin } from '@auto/cslate-core';

import type { Descendant } from 'slate';

const TYPE = 'text-align';
const renderStyle = (text: Descendant) => {
  if (text[TYPE]) {
    return { textAlign: text?.[TYPE] };
  }
  return {};
};

// const ToolbarButton = () => {
//   const editor = useSlate();
//   const getMessage = useMessage();

//   const onChange = (align: string) => {
//     setBlockProps(editor, TYPE, align);
//   };

//   return (
//     <Toolbar.Select<string>
//       onChange={onChange}
//       direction="horizontal"
//       options={[
//         {
//           tooltip: getMessage('left', '左对齐'),
//           label: <>左对齐</>,
//           value: 'left',
//         },
//         {
//           tooltip: getMessage('center', '居中对齐'),
//           label: <>居中对齐</>,
//           value: 'center',
//         },
//         {
//           tooltip: getMessage('right', '右对齐'),
//           label: <>右对齐</>,
//           value: 'right',
//         },
//         {
//           tooltip: getMessage('justify', '两端对齐'),
//           label: <>两端对齐</>,
//           value: 'justify',
//         },
//       ]}
//       tooltip={getMessage('tooltip', '对齐方式')}
//       value={getBlockProps(editor, TYPE, DEFAULT_VALUE)}
//     />
//   );
// };

const TextAlignPlugin: DSlatePlugin = {
  type: TYPE,
  nodeType: 'element',
  // toolbar: <ToolbarButton />,
  renderStyle,
  locale: [
    {
      locale: Locales.zhCN,
      tooltip: '对齐方式',
      left: '左对齐',
      center: '居中对齐',
      right: '右对齐',
      justify: '两端对齐',
    },
    {
      locale: Locales.enUS,
      tooltip: 'text align',
      left: 'align left',
      center: 'align center',
      right: 'align right',
      justify: 'align justify',
    },
  ],
};

export { TextAlignPlugin };
