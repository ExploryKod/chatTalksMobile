import {StyleSheet, TextInput, View, Text, ScrollView} from "react-native";
import Main from "../Component/Main";
import {useConfig} from "../Hook/useConfig";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useGetData from "../Hook/useGetData";
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
            const newRoom ={id: data.id.toString(), name: data.name, description: data.description} as IRoom;
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
  console.log("rooms", data);
  return (
    <Main styles={style.disposition}>
        <ScrollView style={style.containerRooms}>
            {data?.map((room: IRoom, index: number) => (
                <View key={index}>
                  <RoomCard name={room.name} description={room.description} id={room.id.toString()} />
                </View>
            ))}
        </ScrollView>
      <View style={style.separator}></View>
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
        <Text onPress={createRoom}  style={style.buttonEnvoyer}>Créer une salle</Text>
      </View>

    </Main>



  );
}

const style = StyleSheet.create({
  containerRooms: {
    flex: 1,
    backgroundColor: "#161C3D",
    width: wp(100),
    height: hp(100),
    padding: 10
  },
    separator: {
        height: 10,
        width: "100%",
        backgroundColor: "#161C3D",
        opacity: 0.8,
    },
  composantInput: {
    width: wp(80),
    borderRadius: 25,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 20,
    gap: 10,
  },
  disposition: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "white",
    justifyContent: "flex-start"
  },
  inputProp: {
    width: wp(80),
    height: hp(5),
    backgroundColor: "#dcdcdc",
    borderRadius: 10,
    fontSize: hp(2),
    padding: 10
  },
  buttonEnvoyer: {
    backgroundColor: "#A3298B",
    minWidth: 150,
    maxWidth: wp(80),
    height: hp(6),
    borderRadius: 8,
    marginVertical: 10,
    paddingVertical: 2,
    paddingHorizontal: 15,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: hp(2.5),
    color: "#fff"
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
