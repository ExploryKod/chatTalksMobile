import {IRoom, ISavedMessage, IUser} from './chat';

export interface IDiscussion {
  id: number;
  join_date: string;
  room: IRoom;
  room_id: number;
  user: IUser;
  user_id: number;
  last_message: ISavedMessage
}
