import type { DSlatePlugin } from '@cslate/core';

import type { Descendant } from 'slate';

const TYPE = 'color';

const renderStyle = (text: Descendant) => {
  if (text[TYPE]) {
    return { color: text[TYPE] as string };
  }
  return {};
};

const ColorPlugin: DSlatePlugin = {
  type: 'color',
  nodeType: 'text',
  // toolbar: <ToolbarButton />,
  renderStyle,
  props: {
    colors: [
      '#000000',
      '#FF6900',
      '#FCB900',
      '#7BDCB5',
      '#00D084',
      '#8ED1FC',
      '#0693E3',
      '#EB144C',
      '#F78DA7',
      '#9900EF',
    ],
  },
};

export { ColorPlugin };
