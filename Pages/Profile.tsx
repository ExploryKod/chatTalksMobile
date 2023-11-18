import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import Discussion from "../Component/widgetDiscussion";
import {widthPercentageToDP as wp, heightPercentageToDP as hp,} from "react-native-responsive-screen";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Importez le type NativeStackNavigationProp
import { NavigationContainer } from '@react-navigation/native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwesomeIcone from 'react-native-vector-icons/FontAwesome';
import MenuOption from "../Component/MenuOption";
import {LoginScreenProp} from './Login'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ClassRoom from "./ClassRoom";
import ListDiscussion from "./Discussion";
import Settings from "./Settings";

//const {height, width} = Dimensions.get('window');

export default function Profile() {

  const Tab = createMaterialTopTabNavigator();

  return (
    
        <Tab.Navigator>
          <Tab.Screen 
            options={{
               tabBarIcon :(()=><FontAwesomeIcone name="comment" style={style.iconeCss}/>),
               tabBarIconStyle : {
                  width: wp(10),
                  height: hp(4)
               }
            }}
          name="ListDiscussion" component={ListDiscussion} />
  
          <Tab.Screen 
            options={{
              tabBarIcon :(()=><MaterialIcon name="group" style={style.iconeCss}/>),
              tabBarIconStyle : {
                 width: wp(10),
                 height: hp(4)
              },
           }}
           name="ClassRoom" component={ClassRoom} />

          <Tab.Screen 
            options={{
              tabBarIcon :(()=><MaterialIcon name="settings" style={style.iconeCss} />),
              tabBarIconStyle : {
                width: wp(10),
                height: hp(4)
              }
          }}
          name="Settings" component={Settings} />
        </Tab.Navigator>
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
    gap : hp(1),
    alignItems: "center", // Align the items vertically in the discussion
    padding: hp(0.5), // Add padding for spacing
  },

  disposition: {
    flexDirection: "column", // Organize discussions vertically
    backgroundColor: "white",
  },

  iconeCss :{
    fontSize: hp(4),
    color: "#A3298B",
    
 
  },
  iconeDisplayed : {
    flexDirection: "row",
    alignItems: "center", // Align the items vertically in the discussion
    justifyContent: "center", 
    padding: hp(1), // Add padding for spacing
  },
  textIconCss : {
    width: wp(31),
    textAlign: "center",
    marginLeft: hp(0.5),
    marginRight: hp(0.5),
    backgroundColor: "#dcdcdc",
    borderRadius: 50
  },


});
