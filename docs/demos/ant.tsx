/**
 * defaultShowCode: true
 */
import React, { useRef, useState } from 'react';
import type { Descendant } from 'slate';
import DSlate from '@dslate/dslate';
import type { DSlateRef } from '@dslate/core';
import { Button } from 'antd';

const emptyNodes = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

export default () => {
  const [value, setValue] = useState<Descendant[]>(emptyNodes);

  const ref = useRef<DSlateRef>(null);

  return (
    <div>
      <h2>编辑器 Demo</h2>
      <DSlate ref={ref} value={value} onChange={setValue} />
      <br />
      <Button
        onClick={() => {
          console.log(value);
          console.log(
            ref.current?.serialize({
              children: value,
            }),
          );
        }}
      >
        转内容为HTML
      </Button>
    </div>
  );
};
