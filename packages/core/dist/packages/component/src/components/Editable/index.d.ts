import type { RenderPlaceholderProps } from 'slate-react';
interface EditableProps {
  disabled?: boolean;
  placeholder?: string;
  renderPlaceholder?: (props: RenderPlaceholderProps) => JSX.Element;
}
declare const _default: ({
  disabled,
  placeholder,
  renderPlaceholder,
}: EditableProps) => JSX.Element;
export default _default;
