/**
 * defaultShowCode: true
 */
/**
 * 回帖编辑器实现
 */
import React, { useRef } from 'react';
// import DSlate from '@cslate/cslate';
import type { Editor } from 'slate';
// import { ConfigProvider, defaultConfig } from '@cslate/core';

// import type { UploadRequestOption } from 'rc-upload/lib/interface';

// import { ClubEditor } from '@cslate/core';
import { ClubEditor } from '@cslate/cslate';

import './demo.less';

const PLACEHOLDER_TEXT =
  '汽车之家温馨提示您：回复中请不要恶意攻击论坛用户与工作人员，不要发布任何广告性质的回复，我们会第一时间处理违规用户与内容';

export default () => {
  const ref = useRef<{
    serialize: () => string;
    getEditor: () => Editor;
  }>(null);

  return (
    <div className="reply_bottom_editor">
      <div className="editor_container">
        <div className="bbs_subtitle">
          <a
            className="bbs_subtitle_link"
            href="//club.autohome.com.cn/Help/UserHelpRlue#rule"
            target="_blank"
            rel="noreferrer"
          >
            汽车之家论坛规范公示&gt;
          </a>
          <h4 className="bbs_subtitle_name">回复主楼</h4>
        </div>
        <ClubEditor
          ref={ref}
          content={'啊哈哈哈'}
          // toolbar={['emotion']}
          placeholder={PLACEHOLDER_TEXT}
          uploadImgServer="/frontapi/upload/uptoalbum"
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
