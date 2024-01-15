import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import Main from '../Component/Main';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useEffect} from 'react';
import Discussion from '../Component/widgetDiscussion';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useConfig} from '../Hook/useConfig.tsx';
import {useLoggedStore} from '../StateManager/userStore.ts';
import {IDiscussion} from '../Types/discussions';

type RootFromMessageEchange = {
  Salle: undefined;
};
type openMessageEchange = NativeStackNavigationProp<RootFromMessageEchange>;

export default function ListDiscussion() {
  const navigationMessageEchange = useNavigation<openMessageEchange>();
  const {serverUrl} = useConfig();
  const {userId, token} = useLoggedStore();

  const [dataDiscussion, setDataDiscussion] = React.useState<IDiscussion[]>([]);

  useEffect(() => {
    if (!userId) {
      return;
    }
    fetch(`${serverUrl}/user/discussions/${userId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: 'same-origin',
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          console.error('échec de la récupération des discussions');
        }
      })
      .then(data => {
        if (data) {
          setDataDiscussion(data);
        }
      });
  }, []);
  const handleOpenMessageEchange = () => {
    navigationMessageEchange.navigate('MessageEchange');
  };

  const handleClick = async (dataRoom: IDiscussion) => {
    try {
      // @ts-ignore
      navigationMessageEchange.navigate('MessageEchange', {
        roomId: dataRoom.id.toString(),
        roomName: dataRoom.room.name,
        roomDescription: dataRoom.room.description,
      });
    } catch (error) {
      console.error('log failed:', error);
    }
  };

  return (
    <Main styles={style.disposition}>
      {dataDiscussion.map((discussion, index) => (
        <TouchableOpacity onPress={() => handleClick(discussion)}>
          <Discussion key={index} styles={style.discussionStyle}>
            <Text style={style.csspp}>
              <ImageBackground
                source={{
                  uri: `https://source.unsplash.com/200x200/?${
                    discussion.room.name.split(' ')[0]
                  }`,
                }}
              />
            </Text>
            <View>
              <Text style={{fontSize: 20}}>{discussion.room.name}</Text>
              <Text>Last Message</Text>
            </View>
          </Discussion>
        </TouchableOpacity>
      ))}
      {/*<Discussion*/}
      {/*    styles={style.discussionStyle}*/}
      {/*    onPress={handleOpenMessageEchange}*/}
      {/*>*/}
      {/*    <Text style={style.csspp}>*/}
      {/*        <MessagesSquare color="#A3298B" size={hp(4)}/>*/}
      {/*    </Text>*/}
      {/*    <View>*/}
      {/*        <Text style={{fontSize: 20}}>Username</Text>*/}
      {/*        <Text>Last Message</Text>*/}
      {/*    </View>*/}
      {/*</Discussion>*/}
      {/*<Discussion*/}
      {/*    styles={style.discussionStyle}*/}
      {/*    onPress={handleOpenMessageEchange}*/}
      {/*>*/}
      {/*    <Text style={style.csspp}>*/}
      {/*        <MessagesSquare color="#A3298B" size={hp(4)}/>*/}
      {/*    </Text>*/}
      {/*    <View>*/}
      {/*        <Text style={{fontSize: 20}}>Username</Text>*/}
      {/*        <Text>Last Message</Text>*/}
      {/*    </View>*/}
      {/*</Discussion>*/}
    </Main>
  );
}

const style = StyleSheet.create({
  csspp: {
    margin: hp(0.3),
    backgroundColor: 'white',
    height: hp(8),
    width: wp(15),
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: hp(100),
  },

  discussionStyle: {
    margin: hp(0.2),
    backgroundColor: '#dcdcdc',
    flexDirection: 'row',
    gap: hp(1),
    alignItems: 'center',
    padding: hp(0.5),
  },

  disposition: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
});
