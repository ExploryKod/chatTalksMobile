import {StyleSheet, Button} from 'react-native';
import Main from '../Component/Main';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React from "react";
import {useLoggedStore} from "../StateManager/userStore";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {useNavigation} from "@react-navigation/native";


export type RootFromLogin = {
    Login: undefined;
};

export type ProfileScreenProp = NativeStackNavigationProp<RootFromLogin>;


export default function Logout() {

    const navigation = useNavigation<ProfileScreenProp>();

    const handleLogout = () => {
        removeToken();
        removeUsername();
        removeAdminStatus();
        // Redirect to the login page or any other desired page after logout
        navigation.navigate('Login');
    };

    const { removeToken, removeUsername, removeAdminStatus } = useLoggedStore();

    return (
        <Main styles={style.disposition}>
            <Button
                onPress={handleLogout}
                title="Se déconnecter"
                color="#841584"
                accessibilityLabel="Se déconnecter"
            />
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
    buttonEnvoyer: {
        backgroundColor: '#A3298B',
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
