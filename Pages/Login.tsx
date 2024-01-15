import {StyleSheet, TextInput, View, Text} from 'react-native';
import Main from '../Component/Main';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {useLoggedStore} from '../StateManager/userStore';
import Toast from 'react-native-toast-message';
import React from 'react';
import {useConfig} from '../Hook/useConfig';

export type RootFromProfile = {
  Profile: undefined;
  Inscription: undefined;
};

export type LoginScreenProp = NativeStackNavigationProp<RootFromProfile>;

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState<{[key: string]: string}>({});
  const [errorAuthe, setErrorAuthe] = useState('');
  const {setToken, setUsername, setAdminStatus, username} = useLoggedStore();
  const {serverUrl} = useConfig();
  const navigation = useNavigation<LoginScreenProp>();

  const handleChange = (name: string, value: string) => {
    setInputText(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    if (inputText.Username === undefined || inputText.Password === undefined) {
      Toast.show({
        type: 'error',
        text1: "Vous n'avez pas rempli tous les champs",
      });
      setIsLoading(false);
      return;
    }

    if (inputText.Username === '' || inputText.Password === '') {
      Toast.show({
        type: 'error',
        text1: "Vous n'avez pas rempli tous les champs",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/auth/logged`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: inputText.Username,
          password: inputText.Password,
        }).toString(),
      });
      console.log('response login ', response);
      if (response.ok) {
        console.log('réponse bien reçu');
        const data = await response.json();
        if (data.token) {
          console.log('data ====>', data);
          console.log('token bien reçu ====>', data.token);
          setIsLoading(false);
          setToken(data.token);
          setUsername(data.username);
          setAdminStatus(data.admin);
          setTimeout(() => {
            Toast.show({
              type: 'success',
              text1: 'Bienvenue sur Chat Talks',
            });
          }, 500);

          navigation.navigate('Profile');
        } else {
          console.log('data ====> no token');
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'There is no token',
          });
          setToken('');
        }
      } else {
        setIsLoading(false);
        const errorData = await response.json();
        setErrorAuthe('Il y a eu une erreur: ' + errorData.message);
      }
    } catch (error) {
      setIsLoading(false);
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
          onChangeText={text => handleChange('Username', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="Username"
          value={inputText.Username}
        />
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={text => handleChange('Password', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="Password"
          value={inputText.Password}
        />

        {errorAuthe !== '' && (
          <Text style={{color: 'red', fontSize: hp(2.2)}}>{errorAuthe}</Text>
        )}

        <Text style={style.buttonLogin} onPress={handleSubmit}>
          {isLoading ? 'Connexion ...' : 'Se connecter'}
        </Text>
        <View style={{display: 'flex', flexDirection: 'row', gap: wp(40)}}>
          <Text
            style={{color: 'white', fontSize: hp(2)}}
            onPress={handleRegister}>
            Créer un compte
          </Text>
        </View>
      </View>
    </Main>
  );
}

const style = StyleSheet.create({
  composantInput: {
    width: wp(95),
    alignItems: 'center',
  },
  disposition: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(30),
    backgroundColor: '#161C3D',
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
