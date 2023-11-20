import { StyleSheet, TextInput, View, Text } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React from "react";
import Discussion from "../Component/widgetDiscussion";
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

interface ListClassRoomProps {
  dataClassRoom: string[];
}

const ListClassRoom: React.FC<ListClassRoomProps> = ({ dataClassRoom }) => {
  return (
    <View>
      {dataClassRoom.map((discussion, index) => (
        <>
          <Discussion key={index} styles={style.discussionStyle}>
            <Text style={style.csspp}>
              <MaterialIcon name="group" size={40} />
            </Text>
            <View>
              <Text style={{ fontSize: 20 }}>{discussion}</Text>
              <Text>Last Message</Text>
            </View>
          </Discussion>
        </>
      ))}
    </View>
  );
};
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
    alignItems: "center", // Align the items vertically in the discussion
    padding: hp(0.5), // Add padding for spacing
  },
});

export default ListClassRoom;
