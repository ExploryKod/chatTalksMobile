import React from 'react';
import Register from './Auth/Register.tsx';
import Discussion from './Pages/Discussion.tsx';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Auth/Login.tsx';
import Profile from './Pages/Profile';
import ErrorBoundary from 'react-native-error-boundary';
import {StyleSheet, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import MessageEchange from './Pages/MessageEchange';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

const Stack = createNativeStackNavigator();

const ErrorFallback = (props: {error: Error; resetError: Function}) => (
  <View style={styles.container}>
    <Text style={styles.title}> Oups ...</Text>
    <Text style={styles.text}>
      Une erreur est survenue: cela peut-être dû au réseau où à l'appel du
      serveur, veuillez contacter administration.chat@yumail.eu
    </Text>
    <Text style={styles.text}>{props.error.toString()}</Text>
    <Text style={styles.buttonReset} onPress={() => props.resetError()}>
      Réessayer
    </Text>
  </View>
);

export default function Connex() {
  return (
    <>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Inscription" component={Register} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="Salle" component={MessageEchange} />
          </Stack.Navigator>
        </NavigationContainer>
        <Toast />
      </ErrorBoundary>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    backgroundColor: '',
    padding: 8,
    textAlign: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icon: {
    fontSize: 48,
  },
  text: {
    textAlign: 'center',
    marginVertical: 16,
  },
  buttonReset: {
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
