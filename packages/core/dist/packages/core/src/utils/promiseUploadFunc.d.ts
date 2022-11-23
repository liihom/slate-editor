import type { UploadFunc } from '../typing';
import type { UploadRequestOption } from 'rc-upload/lib/interface';
export declare const promiseUploadFunc: (
  options: UploadRequestOption,
  func?: UploadFunc,
  setPercent?: ((p: number) => void) | undefined,
) => Promise<{
  url?: string | undefined;
}>;
