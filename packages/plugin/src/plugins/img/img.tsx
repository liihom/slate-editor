/* eslint-disable react-hooks/exhaustive-deps */
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { ReactEditor, useSelected, useSlate } from 'slate-react';
import { Rnd } from 'react-rnd';
import { usePluginHelper, useConfig, promiseUploadFunc, usePlugin } from '@cslate/core';
import type { RenderElementPropsWithStyle } from '@cslate/core';
import { Transforms } from 'slate';

type Draggable = {
  status: boolean;
  width?: number;
  height?: number;
};

const prefixCls = 'dslate-img-element';

type Size = { width: string; height: string };

const resize = (origin: Size, fixBy: 'width' | 'height', value: string): Size => {
  if (String(value).endsWith('%')) {
    return {
      width: fixBy === 'width' ? value : 'auto',
      height: fixBy === 'height' ? value : 'auto',
    };
  }

  const p = Number(origin.width) / Number(origin.height);

  if (isNaN(Number(value)) && Number(value) <= 0) return origin;

  const valueNumber = Number(value);

  return {
    width: String(fixBy === 'height' ? Math.floor(valueNumber * p) : valueNumber),
    height: String(fixBy === 'width' ? Math.floor(valueNumber / p) : valueNumber),
  };
};

const Img = ({ attributes, children, element, style }: RenderElementPropsWithStyle) => {
  const { setPercent } = usePluginHelper();
  const { customUploadRequest } = useConfig();
  const { props } = usePlugin();

  const image = useRef<HTMLImageElement>(null);
  const rnd = useRef<Rnd>(null);
  const [loading, setLoading] = useState(false);

  const [draggable, setDraggable] = useState<Draggable>({
    status: false,
  });

  const [editable, setEditable] = useState<{
    width: string;
    height: string;
  }>({
    width: '',
    height: '',
  });

  useEffect(() => {
    setLoading(true);
  }, [element.url]);

  const selected = useSelected();
  const editor = useSlate();
  const path = ReactEditor.findPath(editor, element);

  const updateSize = (target: any) => {
    const width = isNaN(Number(target.width)) ? target.width : Number(target.width);
    const height = isNaN(Number(target.height)) ? target.height : Number(target.height);
    Transforms.setNodes(
      editor,
      {
        imgHeight: height,
        imgWidth: width,
      },
      {
        at: path,
      },
    );
  };

  // const updateEditableSize = (key: 'width' | 'height', value: string) => {
  //   // 等比缩放
  //   const width = String(image.current?.naturalWidth ?? 1);
  //   const height = String(image.current?.naturalHeight ?? 1);
  //   const nSize = resize({ width, height }, key, value);
  //   setEditable(nSize);
  // };

  useEffect(() => {
    if (selected) {
      /**
       * 选中状态下，优先同步参数宽度，其次同步实际宽高到编辑框
       */
      const width = element.imgWidth ?? image.current?.width ?? '';
      const height = element.imgHeight ?? image.current?.height ?? '';
      setEditable({
        width: width,
        height: height,
      });
    }

    /**
     * 同步图片实际宽高到拖拽组件
     */
    setDraggable({
      status: false,
      width: image.current?.width,
      height: image.current?.height,
    });
  }, [selected, element.imgWidth, element.imgHeight]);

  /**
   * 图片加载完毕后初始化参数
   */
  const onImageLoad = () => {
    const defaultWidth = props?.defaultWidth;
    let width = String(image.current?.width ?? '');
    let height = String(image.current?.height ?? '');

    if (!width || !height) return;

    if (defaultWidth) {
      ({ width, height } = resize({ width, height }, 'width', defaultWidth));
    }

    if (element.imgWidth) width = element.imgWidth;
    if (element.imgHeight) height = element.imgHeight;

    setEditable({
      width: width,
      height: height,
    });

    setDraggable({
      ...draggable,
      width: Number(width),
      height: Number(height),
    });

    updateSize({
      width,
      height,
    });

    setLoading(false);
  };

  return (
    <span {...attributes}>
      {children}
      <span contentEditable={false}>
        <span
          className={classNames(prefixCls, {
            selected: selected,
          })}
          style={{
            ...style,
            maxWidth: props?.maxWidth ?? undefined,
          }}
        >
          {/* {loading ? (
            <div
              style={{
                ...(props?.loadingStyle || {}),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.1)',
                color: 'rgba(0,0,0,0.4)',
                fontSize: 12,
              }}
            >
              {props?.loadingText ?? 'loading...'}
            </div>
          ) : (
            <Rnd
              ref={rnd}
              className={classNames(`${prefixCls}-drag`, {
                selected: selected,
                draging: draggable.status,
              })}
              size={{
                width: draggable.width ?? 0,
                height: draggable.height ?? 0,
              }}
              resizeHandleWrapperClass="resize-handle-wrapper"
              lockAspectRatio
              disableDragging
            >
              <div className="size-content">
                {draggable.width}x{draggable.height}
              </div>
            </Rnd>
          )} */}
          <img
            ref={image}
            src={element.url}
            style={{
              width: '100%',
              visibility: loading ? 'hidden' : 'visible',
              boxShadow: selected ? 'rgb(180 213 255) 0px 0px 0px 3px' : 'none',
            }}
            onLoad={onImageLoad}
          />
        </span>
      </span>
    </span>
  );
};

export default Img;
