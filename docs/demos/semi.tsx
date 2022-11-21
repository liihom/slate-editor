/**
 * defaultShowCode: true
 */
import React, { useEffect, useRef, useState } from 'react';
import type { Descendant } from 'slate';
import DSlate from '@cslate/semi';
import type { DSlateRef } from '@cslate/core';

import { Button, Form, Space } from '@douyinfe/semi-ui';

export default () => {
  const [value, setValue] = useState<Descendant[]>([
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ]);

  const ref = useRef<DSlateRef>(null);

  const switchMode = () => {
    const doc = document.documentElement;
    const attrName = 'data-prefers-color';
    if (!doc.hasAttribute(attrName) || doc.getAttribute(attrName) === 'dark') {
      doc.setAttribute(attrName, 'light');
    } else {
      doc.setAttribute(attrName, 'dark');
    }
  };

  const watch = (mutationsList: any[]) => {
    const attrName = 'data-prefers-color';
    for (const mutation of mutationsList) {
      if (mutation.attributeName === attrName) {
        document.body.setAttribute(
          'theme-mode',
          document.documentElement.getAttribute(attrName) ?? 'light',
        );
      }
    }
  };

  useEffect(() => {
    let observer: any;
    if (MutationObserver) {
      observer = new MutationObserver(watch);
      // 以上述配置开始观察目标节点
      observer.observe(document.documentElement, { attributes: true });
      // 之后，可停止观察
    }
    return () => observer?.disconnect?.();
  }, []);

  const toggleTheme = () => {
    //@ts-ignore
    if (window.setSemiThemeSwitcherVisible) {
      //@ts-ignore
      window.setSemiThemeSwitcherVisible();
    } else {
      const scriptUrl =
        'https://unpkg.byted-static.com/latest/ies/semi-theme-switcher-opensource/dist/semi-theme-switcher.js';
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.onload = function () {
        //@ts-ignore
        setTimeout(() => window.setSemiThemeSwitcherVisible(), 1000);
      };
      script.src = scriptUrl;
      document.getElementsByTagName('head')[0].appendChild(script);
    }
  };

  return (
    <div>
      <Form>
        <Form.Input field="input" label="普通输入框" />
        <DSlate ref={ref} value={value} onChange={setValue} showCount />
        <br />
        <Space>
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
          <Button onClick={toggleTheme}>切换主题</Button>
          <Button onClick={switchMode}>暗色模式</Button>
        </Space>
      </Form>
    </div>
  );
};
