import { StyleSheet, TextInput, View, Text } from "react-native";
import Main from "../Component/Main";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from "react";

export default function MessageEchange() {
  const ListMessage = [
    { username: "khalifa", message: "salut" },
    { username: "Autre", message: "comment tu vas" },
    { username: "Khalifa", message: "Je vais bien et toi" },
    { username: "Khalifa", message: "Je vais bien et toi" },
    { username: "Autre", message: "Je vais bien et toi" }
  ];
  const [inputText, setInputText] = useState<{ [key: string]: string }>({});

  const handleChange = (name: string, value: string) => {
    setInputText((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Message envoyé :");
  }

  return (
    <Main styles={style.disposition}>
      <View>
        {ListMessage.map((message, index) =>
          <Text key={index} style={[message.username === "Autre" ? style.messageLeft : style.messageRight]}>
            {message.message}
          </Text>
        )}
      </View>

      <View style={style.composantInput}>
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={(text) => handleChange('Password', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="message"
          value={inputText.Password}
        />
        <Text onPress={handleSubmit} style={style.buttonEnvoyer}>envoyer</Text>
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
    justifyContent: "flex-end",
    gap: hp(3)
  },
  inputProp: {
    flex: 1,
    height: hp(8),
    backgroundColor: "#dcdcdc",
    borderRadius: 100,
    fontSize: hp(2),
    padding: 10
  },
  buttonEnvoyer: {
    backgroundColor: "#A3298B",
    width: wp(20),
    height: hp(8),
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
