import { StyleSheet, TextInput, View, Text } from "react-native";
import Main from "../Component/Main";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import React from "react";
import Discussion from "../Component/widgetDiscussion";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


type RootFromMessageEchange = {
    MessageEchange: undefined;
};
type openMessageEchange = NativeStackNavigationProp<RootFromMessageEchange>;



export default function ListDiscussion() {

    const navigationMessageEchange = useNavigation<openMessageEchange>();
    const handleOpenMessageEchange = () => {
        navigationMessageEchange.navigate('MessageEchange');
    }


    return (
        <Main styles={style.disposition}>
            <Discussion styles={style.discussionStyle} onPress={handleOpenMessageEchange}>
                <Text style={style.csspp}><MaterialIcon name="person" size={40} /></Text>
                <View>
                    <Text style={{ fontSize: 20 }}>Username</Text>
                    <Text>Last Message</Text>
                </View>
            </Discussion>
            <Discussion styles={style.discussionStyle} onPress={handleOpenMessageEchange}>
                <Text style={style.csspp}><MaterialIcon name="person" size={40} /></Text>
                <View>
                    <Text style={{ fontSize: 20 }}>Username</Text>
                    <Text>Last Message</Text>
                </View>
            </Discussion>
        </Main>
    );
}

const style = StyleSheet.create({
    csspp: {
        margin: hp(0.3),
        backgroundColor: "blue",
        height: hp(8),
        width: wp(15),
        textAlign: "center",
        textAlignVertical: "center",
        borderRadius: hp(100),
    },

    discussionStyle: {
        margin: hp(0.2),
        backgroundColor: "#dcdcdc",
        flexDirection: "row",
        gap: hp(1),
        alignItems: "center",
        padding: hp(0.5),
    },

    disposition: {
        flexDirection: "column",
        backgroundColor: "white",
    }

});
