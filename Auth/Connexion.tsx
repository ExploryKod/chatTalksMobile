import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Main from "../Component/Main";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { useState } from "react";
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

//const {height, width} = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
};

type ConnexionScreenProp = NativeStackNavigationProp<RootStackParamList>;

function Connexion() {
  const data = {
    user: 'amaury',
    password: 'password',
  };
  const [inputText, setInputText] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation<ConnexionScreenProp>();

  const handleChange = (name: string, value: string) => {
    setInputText((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    const username = inputText.Username;
    const password1 = inputText.Password;
    const password2 = inputText.ConfirmPassword;

    console.log('Username :', username);
    console.log('Password1 :', password1);
    console.log('Password2 :', password2);
  };

  const handleLogin = () => {
    navigation.navigate('Login');
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
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          onChangeText={(text) => handleChange('ConfirmPassword', text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="Confirm Password"
          value={inputText.ConfirmPassword}
        />

        <Text style={style.buttonCreate} onPress={handleSubmit}>
          Create Account
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: wp(40),
          }}
        >
          <Text
            onPress={handleLogin}
            style={{ color: '#A3298B', fontSize: hp(2) }}
          >
            Login to App
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
export default Connexion;
