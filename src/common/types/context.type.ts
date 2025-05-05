import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';

export type ContextType = Context &
  SceneContext & {
    reply_to_message_id?: any;
    session: {
      key: string;
      adding: boolean;
      deleting: boolean;
      isEditing: boolean;
      lastMessage: any;
      lastText: any;
      media_type: string;
    };
  };
