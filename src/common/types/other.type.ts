import { ContextType } from './context.type';

export interface LocationI {
  latitude: number;
  longitude: number;
}
export interface CallbackContextType extends ContextType {
  match: RegExpExecArray | null;
}
