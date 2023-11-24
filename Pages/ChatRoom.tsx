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
import {useState} from "react";
import RoomCard from "../Component/RoomCard";
import {IRoom} from "../Types/chat";
import {useLoggedStore} from "../StateManager/userStore";


export default function ChatRoom() {
  const { serverUrl } = useConfig();
  const { token } = useLoggedStore();

  const [inputName, setInputName] = useState("");
  const [inputTheme, setInputTheme] = useState("");

  const createRoom = async () => {

    if (inputName !== '' && inputTheme !== '') {
      try {
        const response = await fetch(`${serverUrl}/chat/create`, {
          method: 'POST',
          body: new URLSearchParams({
            'roomName': inputName,
            'description': inputTheme,
          }).toString(),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: `Bearer ${token}`,
          },
          credentials: 'same-origin'
        });

        if (response.ok) {
          console.log('room created');
          const data = await response.json();
          console.log("data",data)
          if(data.id && data.name && data.description) {
            const newRoom ={id: data.id, name: data.name, description: data.description} as IRoom;
            console.log('new room created', newRoom)
             // setRoomsList([...roomsList, newRoom]);
          } else {
            console.log('échec de votre requête: élèments manquants');
          }
        } else {
          console.log('échec de la création de room');
        }

      } catch (error) {
        console.error('log failed:', error);
      }
    }else{
      console.log('veuillez remplir tous les champs');
    }
  };

  const handleChangeName = (name: string) => {
    setInputName(name)
  };

  const handleChangeTheme = (theme: string) => {
    setInputTheme(theme)
  };

  const { data } = useGetData(`${serverUrl}/chat/rooms`);
  console.log(data);
  return (
    <Main styles={style.disposition}>
      <View style={style.composantInput}>
        <TextInput
            keyboardType="default"
            onChangeText={(text) => handleChangeName(text)}
            style={style.inputProp}
            placeholderTextColor="black"
            placeholder="Nom de la salle"
        />
        <TextInput
            keyboardType="default"
            onChangeText={(text) => handleChangeTheme(text)}
            style={style.inputProp}
            placeholderTextColor="black"
            placeholder="Thème"
        />
        <Text onPress={createRoom}  style={style.buttonEnvoyer}>Créer</Text>
      </View>
      <Text style={{ fontSize: 20, textAlign:"center", marginVertical:20}}> Salles de chat </Text>
        <View>
            {data?.map((room: IRoom) => (
              <RoomCard name={room.name} description={room.description} id={room.id} />
            ))}
        </View>

    </Main>



  );
}

const style = StyleSheet.create({
  composantInput: {
    width: wp(100),
    borderRadius: 25,
    flexDirection: "row",
    gap: hp(1),
    alignItems: "center",
    padding: hp(1),
  },
  disposition: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    justifyContent: "flex-start",
    gap: hp(3)
  },
  inputProp: {
    flex: 1,
    height: hp(6),
    backgroundColor: "#dcdcdc",
    borderRadius: 10,
    fontSize: hp(2),
    padding: 10
  },
  buttonEnvoyer: {
    backgroundColor: "#A3298B",
    width: wp(20),
    height: hp(6),
    borderRadius: 10,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: hp(2.5),
    color: "white"
  },

  messageLeft: {
    backgroundColor: "#dcdcdc",
    marginTop: hp(0.8),
    marginStart: hp(1),
    padding: hp(1),
    fontSize: hp(2.5),
    borderRadius: 15,
    alignSelf: "flex-start", // Alignez le message à gauche
  },
  messageRight: {
    backgroundColor: "#dcdcdc",
    marginTop: hp(0.8),
    marginEnd: hp(1),
    padding: hp(1),
    fontSize: hp(2.5),
    borderRadius: 15,
    alignSelf: "flex-end", // Alignez le message à droite
  }
});
