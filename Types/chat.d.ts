declare module 'react-native-websocket';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export interface IRoom {
    id: string;
    name: string;
    description: string;
}

export interface IWordLength {
    num: number,
    max: number,
    text: string,
    endMessage: string
}

type RootFromMessageEchange = {
    MessageEchange: undefined;
    ChatRoom: undefined;
};

export type openMessageEchange = NativeStackNavigationProp<RootFromMessageEchange>;

export interface SenderMessage {
    sendername: string | null;
    sendermessage: string | null;
    action: string | null;
}

export interface ISavedMessage extends SenderMessage {
    id: string | null;
    user_id: string | null;
    room_id: string | null;
    created_at: string | null;
    username: string | null;
    content: string | null;
}

export type Target = {
    id: string;
    name: string|undefined;
}

export type Message = {
    action: string;
    message: string;
    target: Target;
}

export type IUser = {
    id: string;
    username: string;
    email: string;
    password: string;
    admin: boolean;
}