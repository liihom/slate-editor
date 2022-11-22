import React, { useCallback, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import type { Descendant } from 'slate';
import DSlate from './DSlate';
import type { DSlateRef } from '@cslate/core';
import { ConfigProvider, defaultConfig } from '@cslate/core';

import type { UploadRequestOption } from 'rc-upload/lib/interface';
import { htmlToContent } from '@cslate/core/src/utils/deserialize';

interface IProps {
  content?: string;
  placeholder?: string;
  toolbar?: ('img' | 'emotion')[];
  uploadImgServer: string;
}

const PLACEHOLDER_TEXT =
  '汽车之家温馨提示您：回复中请不要恶意攻击论坛用户与工作人员，不要发布任何广告性质的回复，我们会第一时间处理违规用户与内容';

const ClubEditor = forwardRef(
  (
    {
      content,
      placeholder = PLACEHOLDER_TEXT,
      toolbar = ['img', 'emotion'],
      uploadImgServer,
    }: IProps,
    ref,
  ) => {
    const initValue = htmlToContent(content || '');
    const [value, setValue] = useState<Descendant[]>(initValue as Descendant[]);

    const slateRef = useRef<DSlateRef>(null);

    const uploadRq = useCallback(
      (options: UploadRequestOption<any>) => {
        if (!uploadImgServer) {
          console.warn('请配置上传图片服务地址！');
          return;
        }
        const { file, filename = '', onSuccess, onError } = options;
        // 添加图片数据
        const formdata = new FormData();
        formdata.append(filename, file);

        // 定义 xhr
        const xhr = new XMLHttpRequest();
        xhr.open('POST', uploadImgServer);

        // 设置超时
        xhr.timeout = 50000;
        xhr.ontimeout = () => {
          alert('上传图片超时');
        };

        // 返回数据
        xhr.onreadystatechange = () => {
          let result;
          if (xhr.readyState === 4 && xhr.status === 200) {
            result = xhr.responseText;
            if (typeof result !== 'object') {
              try {
                result = JSON.parse(result);
              } catch (ex) {
                console.log('上传图片失败', '上传图片返回结果错误，返回结果是: ' + result);
                return;
              }
            }
            console.log('图片上传结果 result ==', result);
            if (result.returncode === 0) {
              const url = result.result?.[0];
              console.log('url', url);
              onSuccess?.({
                url,
              });
            } else {
              onError?.(result);
            }
          }
        };

        // 自定义 headers
        // objForEach(uploadImgHeaders, (key, val) => {
        //   xhr.setRequestHeader(key, val);
        // });

        // 跨域传 cookie
        xhr.withCredentials = true;

        // 发送请求
        xhr.send(formdata);
      },
      [uploadImgServer],
    );

    useImperativeHandle(
      ref,
      () => ({
        serialize: () =>
          slateRef.current?.serialize({
            children: value,
          }),
        getEditor: slateRef.current?.getEditor,
      }),
      [value],
    );

    return (
      <ConfigProvider
        value={{
          ...defaultConfig,
          customUploadRequest: uploadRq,
        }}
      >
        <DSlate
          ref={slateRef}
          placeholder={placeholder}
          renderPlaceholder={({ attributes }) => (
            <span
              {...attributes}
              style={{
                position: 'absolute',
                right: '15px',
                left: '15px',
                lineHeight: 2,
                color: '#999CAB',
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              {placeholder}
            </span>
          )}
          value={value}
          onChange={setValue}
          toolbar={toolbar}
        />
      </ConfigProvider>
    );
  },
);

export { ClubEditor };
