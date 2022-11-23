/**
 * defaultShowCode: true
 */

import React, { useRef } from 'react';
import type { Editor } from 'slate';

import { ClubEditor } from '@auto/cslate';

import '@auto/cslate/es/components/DSlate/index.css';
import './demo.less';

export default () => {
  const ref = useRef<{
    serialize: () => string;
    getEditor: () => Editor;
  }>(null);

  return (
    <div className="reply_bottom_editor">
      <div className="editor_container">
        <div className="subtitle">
          <a className="subtitle_link" href="###" target="_blank" rel="noreferrer">
            标题标题标题
          </a>
          <h4 className="subtitle_name">回复</h4>
        </div>
        <ClubEditor
          ref={ref}
          content={'啊哈哈哈'}
          // toolbar={['emotion']}
          uploadImgServer="###"
        />
        <div className="btn_group">
          <div className="btn btn_blue_outline">取消修改</div>
          <div
            className="btn btn_blue"
            onClick={() => {
              console.log('发表富文本=', ref.current?.serialize());
            }}
          >
            发表回复
          </div>
        </div>
      </div>
    </div>
  );
};
