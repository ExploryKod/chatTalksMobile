import {StyleSheet, TextInput, View, Text, Button} from 'react-native';
import Main from '../Component/Main';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useLoggedStore} from "../StateManager/userStore";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import Toast from "react-native-toast-message";

export type RootFromLogin = {
  Login: undefined;
  TcpClient: undefined;
};

export type ProfileScreenProp = NativeStackNavigationProp<RootFromLogin>;

export default function Parameter() {
  const navigation = useNavigation<ProfileScreenProp>();


  const handleLogout = () => {
    removeToken();
    removeUsername();
    removeAdminStatus();
    Toast.show({
      type: 'error',
      text1: "Vous êtes bien déconnecté"
    });
    // Redirect to the login page or any other desired page after logout
    navigation.navigate('Login');
  };

  const handleTestDiscussion = () => {
    navigation.navigate('TcpClient');
  };

  const { removeToken, removeUsername, removeAdminStatus } = useLoggedStore();
  return (
    <Main styles={style.disposition}>
      <Text style={{ fontSize: 20, marginLeft: 10, marginTop: 30 }}>Paramètres</Text>
      <View style={{ maxWidth: 200, marginLeft: 10, marginTop: 5 }}>
        <Button
            onPress={handleLogout}
            title="Se déconnecter"
            color="#841584"
            accessibilityLabel="Se déconnecter"
        />
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
  button: {
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
