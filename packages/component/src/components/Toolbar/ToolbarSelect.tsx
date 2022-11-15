import classNames from 'classnames';
import React, { useMemo } from 'react';
import { usePlugin, usePluginHelper } from '@dslate/core';
import IconFont from '../IconFont';
import Popover from '../Popover';
import Tooltip from '../Tooltip';
import ToolbarButton from './ToolbarButton';

export type ToolbarSelectProps<T> = {
  options: { label: React.ReactNode; value: T; placeholder?: string; tooltip?: string }[];
  placeholder?: React.ReactNode;
  width?: number;
  value: T;
  disabled?: boolean;
  tooltip?: string;
  onChange: (value: T) => void;
  direction?: 'vertical' | 'horizontal';
  color?: string;
};

const ToolbarSelect: <T>(props: ToolbarSelectProps<T>) => JSX.Element = ({
  options,
  value,
  disabled,
  tooltip,
  onChange,
  direction = 'vertical',
  placeholder = '',
  width = 'max-content',
}) => {
  const { visible, setVisible } = usePlugin();
  const { getPrefixCls } = usePluginHelper();

  const prefixCls = getPrefixCls?.('toolbar-select');

  const ActiveValue = useMemo(() => {
    const selected = options.find((i) => i.value === value);

    let dom: React.ReactNode = placeholder;
    if (selected) {
      dom = selected.placeholder ?? selected.label;
    }
    return (
      <div
        style={{
          width,
        }}
      >
        {dom}
      </div>
    );
  }, [options, placeholder, width, value]);

  const toggle = () => {
    setVisible?.(!visible);
  };

  return (
    <div className={classNames(`${prefixCls}`)}>
      <Popover
        trigger={[]}
        visible={visible}
        placement="bottom"
        overlay={
          <div className={classNames(`${prefixCls}-content`, direction)}>
            {options.map((i) => {
              const optionDom = (
                <div
                  onClick={() => {
                    onChange(i.value);
                    setVisible?.(false);
                  }}
                  key={`${i.value}`}
                  className={classNames('item', {
                    active: value === i.value,
                  })}
                >
                  {i.label}
                </div>
              );
              return i.tooltip ? (
                <Tooltip tooltip={i.tooltip} key={`${i.value}`}>
                  {optionDom}
                </Tooltip>
              ) : (
                optionDom
              );
            })}
          </div>
        }
      >
        <ToolbarButton disabled={disabled} onClick={toggle} tooltip={tooltip}>
          <div className={classNames(`${prefixCls}-button`)}>
            <div className={`${prefixCls}-button-content`}>{ActiveValue}</div>
            <IconFont className="icon-down" type="icon-down" />
          </div>
        </ToolbarButton>
      </Popover>
    </div>
  );
};

export default ToolbarSelect;
