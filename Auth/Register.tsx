import {StyleSheet, TextInput, View, Text, Image} from 'react-native';
import Main from '../Component/Main';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useConfig} from '../Hook/useConfig';

type RootStackParamList = {
  Login: undefined;
};

type ConnexionScreenProp = NativeStackNavigationProp<RootStackParamList>;

function Register() {
  const [errorAuthe, setErrorAuthe] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState<{[key: string]: string}>({});
  const navigation = useNavigation<ConnexionScreenProp>();
  const {serverUrl} = useConfig();

  const handleChange = (name: string, value: string) => {
    setInputText(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (inputText.Username === undefined || inputText.Password === undefined) {
      setErrorAuthe('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    if (inputText.Username === '' || inputText.Password === '') {
      setErrorAuthe('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    if (inputText.Password !== inputText.ConfirmPassword) {
      setErrorAuthe('Les mots de passe ne correspondent pas');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${serverUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: inputText.Username,
          password: inputText.ConfirmPassword,
          email: 'waiting@email.com',
        }).toString(),
      });
      console.log('response login ', response);
      if (response.ok) {
        console.log('réponse bien reçu');
        setIsLoading(false);
        const data = await response.json();
        console.log('data ====>', data);
        setErrorAuthe('' + data.message);
        navigation.navigate('Login');
      } else {
        const errorData = await response.json();
        setIsLoading(false);
        setErrorAuthe('' + errorData.message);
      }
    } catch (error) {
      console.error('log failed:', error);
      setIsLoading(false);
      setErrorAuthe('Il y a eu une erreur dans la requête');
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Main styles={style.disposition}>
      <View style={style.imageContainer}>
        <Image
          style={{
            resizeMode: 'cover',
            height: 100,
            width: 100,
            tintColor: '#A3298B',
          }}
          source={require('./assets/black-cat.png')}
        />
      </View>
      <View style={style.composantInput}>
        <TextInput
          keyboardType="default"
          onChangeText={text => handleChange('Username', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="Votre pseudo"
          value={inputText.Username}
        />
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={text => handleChange('Password', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="Mot de passe"
          value={inputText.Password}
        />
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={text => handleChange('ConfirmPassword', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="Confirmer le mot de passe"
          value={inputText.ConfirmPassword}
        />

        {errorAuthe !== '' && (
          <Text style={{color: 'red', fontSize: hp(2.2)}}>{errorAuthe}</Text>
        )}

        <Text style={style.buttonCreate} onPress={handleSubmit}>
          {isLoading ? 'Création ...' : 'Créer un compte'}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: wp(40),
          }}>
          <Text onPress={handleLogin} style={{color: 'white', fontSize: hp(2)}}>
            Se connecter
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
  imageContainer: {
    width: wp(100),
    alignItems: 'flex-start',
    marginTop: hp(10),
    marginBottom: -30,
    paddingLeft: 10,
  },
  disposition: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp(0),
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

  buttonCreate: {
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
export default Register;
