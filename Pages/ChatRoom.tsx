import { StyleSheet, TextInput, View, Text } from "react-native";
import Main from "../Component/Main";
import {useConfig} from "../Hook/useConfig";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useGetData from "../Hook/useGetData";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";

interface IRoom {
  description: string;
  id: number;
  name: string;
}

type RootFromMessageEchange = {
  MessageEchange: undefined;
  ChatRoom: undefined;
};
type openMessageEchange = NativeStackNavigationProp<RootFromMessageEchange>;

export default function ChatRoom() {
  const { serverUrl } = useConfig();
  const navigationMessageEchange = useNavigation<openMessageEchange>();

  const handleOpenMessageEchange = () => {
    navigationMessageEchange.navigate('MessageEchange');
  };

  const { data } = useGetData(`${serverUrl}/chat/rooms`);
  console.log(data);
  return (
    <Main styles={style.disposition}>
      <Text style={{ fontSize: 20 }}>Les classes</Text>
        <View>
            {data?.map((room: IRoom) => (
            <Text key={room.id} onPress={handleOpenMessageEchange}>{room.name}</Text>
            ))}
        </View>
    </Main>



  );
}

const style = StyleSheet.create({
  composantInput: {
    width: wp(100),
    borderRadius: 25,
    flexDirection: 'row',
    gap: hp(1),
    alignItems: 'center',
    padding: hp(1),
  },
  disposition: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',

    gap: hp(3),
  },
  inputProp: {
    flex: 1,
    height: hp(8),
    backgroundColor: '#dcdcdc',
    borderRadius: 100,
    fontSize: hp(2),
    padding: 10,
  },
  buttonEnvoyer: {
    backgroundColor: '#A3298B',
    width: wp(20),
    height: hp(8),
    borderRadius: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: hp(2.5),
    color: 'white',
  },

  messageLeft: {
    backgroundColor: '#dcdcdc',
    marginTop: hp(0.8),
    marginStart: hp(1),
    padding: hp(1),
    fontSize: hp(2.5),
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#dcdcdc',
    marginTop: hp(0.8),
    marginEnd: hp(1),
    padding: hp(1),
    fontSize: hp(2.5),
    borderRadius: 15,
    alignSelf: 'flex-end',
  },
});
