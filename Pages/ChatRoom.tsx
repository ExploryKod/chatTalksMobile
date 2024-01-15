import {StyleSheet, TextInput, View, Text, ScrollView, Modal, Pressable, Alert} from "react-native";
import Main from "../Component/Main";
import { COLORS } from "../Styles/constants.tsx";
import {useConfig} from "../Hook/useConfig";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import useGetData from "../Hook/useGetData";
import {useEffect, useState} from "react";
import RoomCard from "../Component/RoomCard";
import {IRoom} from "../Types/chat";
import {useLoggedStore} from "../StateManager/userStore";
import { X } from 'lucide-react-native';
import Toast from "react-native-toast-message";


export default function ChatRoom() {
  const { serverUrl } = useConfig();
  const { token } = useLoggedStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [inputName, setInputName] = useState("");
  const [inputTheme, setInputTheme] = useState("");
  const [roomList, setRoomList] = useState<IRoom[]>([]);


  const { data } = useGetData(`${serverUrl}/chat/rooms`);
  useEffect(() => {
    if (data) {
      setRoomList(data);
    }
  }, [data]);

  const createRoom = async () => {

    if(inputName.length > 30) {
      setModalVisible(!modalVisible)
      Toast.show({type: 'error', text1: `Le nom de la salle ne doit pas dépasser 30 caractères`});
      return;
    }

    if(inputTheme.length > 50) {
        setModalVisible(!modalVisible)
        Toast.show({type: 'error', text1: `Le thème de la salle ne doit pas dépasser 50 caractères`});
        return;
    }

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
          const data = await response.json();
          if(data.id && data.name && data.description) {
            const newRoom ={id: data.id, name: data.name, description: data.description} as IRoom;
            setRoomList([...roomList, newRoom]);
            setInputName("")
            setInputTheme("")
            setModalVisible(!modalVisible);
            Toast.show({type: 'success', text1: `La salle ${data.name} a été créé`});
          } else {
            setModalVisible(!modalVisible)
            setInputName("")
            setInputTheme("")
            Toast.show({type: 'error', text1: `Echec de votre requête: élèments manquants`});
          }
        } else {
          setModalVisible(!modalVisible)
          setInputName("")
          setInputTheme("")
          Toast.show({type: 'error', text1: `Echec de votre requête: la salle n'a pu être créé`});
          Toast.show({type: 'error', text1: `${data.message}`});
        }

      } catch (error) {
        setModalVisible(!modalVisible)
        setInputName("")
        setInputTheme("")
        Toast.show({type: 'error', text1: `Echec de votre requête: la salle n'a pu être créé`});
      }
    }else{
      setModalVisible(!modalVisible)
      setInputName("")
      setInputTheme("")
      Toast.show({type: 'error', text1: `Êtes-vous sûr d'avoir rempli tous les champs ?`});
    }
  };

  const handleChangeName = (name: string) => {
    setInputName(name)
  };

  const handleChangeTheme = (theme: string) => {
    setInputTheme(theme)
  };

  const { data } = useGetData(`${serverUrl}/chat/rooms`);
  // console.log("rooms", data);
  return (
    <Main styles={style.disposition}>
        <ScrollView style={style.containerRooms}>
            {roomList?.map((room: IRoom, index:number) => (
                <View key={index} style={[index === roomList.length -1 && {marginBottom: 30}]}>
                  <RoomCard name={room.name} description={room.description} id={room.id.toString()} />
                </View>
            ))}
        </ScrollView>
      <View>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(!modalVisible);
            }}>
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <View style={style.modalHeader}>
                <Pressable
                    style={({ pressed }) => [{opacity: pressed ? 0.5 : 1}]}
                    onPress={() => setModalVisible(!modalVisible)}>
                  <X color={COLORS.darkBlue} size={hp(6)} />
                </Pressable>
              </View>
              <View style={style.modalContent}>
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
                    placeholder="Thème du chat"
                />
                <Pressable
                    onPress={createRoom}
                    style={({ pressed }) => [
                      style.buttonCreateRoom,
                      {backgroundColor: pressed ? COLORS.darkpink : COLORS.darkLavender},
                    ]}>
                  <Text style={style.textButtonStyle}>Valider</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <View style={style.OpenModalContainer}>
          <Pressable
              style={style.buttonOpenModal}
              onPress={() => setModalVisible(true)}>
            <Text style={style.textButtonStyle}>Créer une salle</Text>
          </Pressable>
        </View>
      </View>
    </Main>
  );
}

const style = StyleSheet.create({
  containerRooms: {
    flex: 1,
    width: wp(100),
    height: hp(100),
    padding: 10,
    backgroundColor: COLORS.darkBlue
  },
  disposition: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: COLORS.darkBlue,
    justifyContent: "flex-start"
  },
  // Open Modal elements
  OpenModalContainer: {
    paddingVertical: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: 65,
    backgroundColor: '#A3298B'
  },
  buttonOpenModal: {
    width: "33%",
    height: 50,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.darkBlue,
    borderRadius: 10,
  },
  textButtonStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: "100%",
    height: "103%",
    margin: 0,
    backgroundColor: 'white',
    borderRadius: 0,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  modalHeader: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 10,
  },
  modalContent: {
    width: "100%",
    height: "80%",
    borderRadius: 25,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingTop: 20,
    gap: 20,
  },
  inputProp: {
    width: "80%",
    height: 50,
    backgroundColor: "#dcdcdc",
    borderRadius: 10,
    fontSize: 14,
    padding: 10
  },
  buttonCreateRoom: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: 150,
    minHeight: 50,
    borderRadius: 8,
    marginVertical: 10,
    paddingVertical: 2,
    paddingHorizontal: 15,
    textAlign: "center",
    textAlignVertical: "center",
  },
});
