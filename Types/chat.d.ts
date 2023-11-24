import {NativeStackNavigationProp} from "@react-navigation/native-stack";

export interface IRoom {
    id: number;
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