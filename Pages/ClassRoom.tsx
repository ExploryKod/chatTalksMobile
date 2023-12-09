import { StyleSheet, TextInput, View, Text } from "react-native";
import Main from "../Component/Main";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from "react";
import ListClassRoom from './ListClassRoom';

export default function ClassRoom() {
  const dataClassRoomName :string [] = [];
  const [dataClassRoom, setDataClassRoom] = useState(dataClassRoomName)
  
  const [inputText, setInputText] = useState("");

  const handleChange = (name: string) => {
    setInputText(name)
  };

  const handleAddGroup = () => {
    let cpyDataClassRoom = [...dataClassRoom];
    cpyDataClassRoom.push(inputText);
    setDataClassRoom(cpyDataClassRoom);
    console.log("Groupe ajouter");
  }

  return (
    <Main styles={style.disposition}>
      <View style={style.composantInput}>
         <TextInput
           keyboardType="default"
           onChangeText={(text) => handleChange(text)}
           style={style.inputProp}
           placeholderTextColor="black"
           placeholder="Nom de la classe"
           value={inputText}
         />  
        <Text onPress={handleAddGroup}  style={style.buttonEnvoyer}>Créer</Text>
      </View>
      <ListClassRoom dataClassRoom={dataClassRoom} />
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
