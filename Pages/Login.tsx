import { StyleSheet, TextInput, View, Text } from "react-native";
import Main from "../Component/Main";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {useLoggedStore} from "../StateManager/userStore";
import React from "react";

//const {height, width} = Dimensions.get('window');

export type RootFromProfile = {
  Profile: undefined;
  Inscription: undefined;
};

export type LoginScreenProp = NativeStackNavigationProp<RootFromProfile>;

export default function Login() {
  const [inputText, setInputText] = useState<{ [key: string]: string }>({});
  const [errorAuthe, setErrorAuthe] = useState('');
  const serverHost: string = "https://go-chat-docker.onrender.com"
  const { setToken, setUsername, setAdminStatus } = useLoggedStore();

  const navigation = useNavigation<LoginScreenProp>();

  // const handleChange = (name: string, value: string) => {
  //   setInputText((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const handleChange = (name: string, value: string) => {
    setInputText((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = async () => {

    if(inputText.Username === undefined || inputText.Password === undefined) {
        setErrorAuthe('Veuillez remplir tous les champs');
        return;
    }

    if(inputText.Username === '' || inputText.Password === '') {
        setErrorAuthe('Veuillez remplir tous les champs');
        return;
    }

    try {
      const response = await fetch(`${serverHost}/auth/logged`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: inputText.Username,
          password: inputText.Password
        }).toString()
      });
      console.log('response login ', response)
      if (response.ok) {
        console.log('réponse bien reçu');

        const data = await response.json();
        if(data.token) {
          console.log("data ====>", data)
          console.log('token bien reçu ====>', data.token)
          setToken(data.token);
          setUsername(data.username);
          setAdminStatus(data.admin);
          navigation.navigate('Profile');
        } else {
          console.log("data ====> no token")
          setToken('');
        }

      } else {
        const errorData = await response.json();
        setErrorAuthe('' + errorData.message);
      }
    } catch (error) {
      console.error('log failed:', error);
      setErrorAuthe('Il y a eu une erreur dans la requête');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Inscription');
  };

  return (
    <Main styles={style.disposition}>
      <View style={style.composantInput}>
        <TextInput
          keyboardType="default"
          onChangeText={(text) => handleChange('Username', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="Username"
          value={inputText.Username}
        />
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={(text) => handleChange('Password', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="Password"
          value={inputText.Password}
        />

        {errorAuthe !== '' && (
          <Text style={{ color: 'red', fontSize: hp(2.2) }}>{errorAuthe}</Text>
        )}

        <Text style={style.buttonLogin} onPress={handleSubmit}>
          Login
        </Text>
        <View style={{ display: 'flex', flexDirection: 'row', gap: wp(40) }}>
          <Text style={{ color: '#A3298B', fontSize: hp(2) }} onPress={handleRegister}>
            Create Account
          </Text>
          <Text style={{ color: '#A3298B', fontSize: hp(2) }}>Need Help</Text>
        </View>
      </View>
    </Main>
  );
}

const style = StyleSheet.create({
  composantInput: {
    borderLeftWidth: wp(2),
    borderLeftColor: '#A3298B',
    borderRightWidth: wp(2),
    borderRightColor: '#A3298B',
    width: wp(95),
    alignItems: 'center',
    borderRadius: 25,
  },
  disposition: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(30),
    backgroundColor: 'white',
  },

  inputProp: {
    width: wp(85),
    height: hp(8),
    backgroundColor: '#dcdcdc',
    borderRadius: 10,
    fontSize: hp(2.5),
    margin: hp(1.5),
    padding: 10,
  },

  buttonLogin: {
    fontSize: hp(3),
    backgroundColor: '#A3298B',
    textAlign: 'center',
    textAlignVertical: 'center',
    height: hp(8),
    width: wp(50),
    borderRadius: 10,
    margin: hp(3),
    color: 'white',
  },
});
