import React from "react";
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from "react-native-responsive-screen";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Users } from 'lucide-react-native';
import { MessageCircle } from 'lucide-react-native';
import { Settings } from 'lucide-react-native';
import ChatRoom from "./ChatRoom";
import Discussion from "./Discussion.tsx"
import ListDiscussion from "./Discussion";
import Parameter from "./Settings";

export default function Profile() {

    const Tab = createMaterialTopTabNavigator();

    return (
        <Tab.Navigator>
            <Tab.Screen
                options={{
                    tabBarIcon: (() => <MessageCircle color="#A3298B" size={hp(4)}/>),
                    tabBarIconStyle: {
                        width: wp(10),
                        height: hp(4)
                    }
                }}
                name="discussions" component={Discussion}/>

            <Tab.Screen
                options={{
                    tabBarIcon: (() => <Users color="#A3298B" size={hp(4)}/>),
                    tabBarIconStyle: {
                        width: wp(10),
                        height: hp(4)
                    },
                }}
                name="Salles" component={ChatRoom}/>

            <Tab.Screen
                options={{
                    tabBarIcon: (() => <Settings color="#A3298B" size={hp(4)}/>),
                    tabBarIconStyle: {
                        width: wp(10),
                        height: hp(4)
                    }
                }}
                name="Paramètres" component={Parameter}/>

        </Tab.Navigator>

    );
}

