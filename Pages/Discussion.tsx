import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  Image,
} from 'react-native';
import Main from '../Component/Main';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import React, {useEffect, useState} from 'react';
import Discussion from '../Component/widgetDiscussion';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useConfig} from '../Hook/useConfig.tsx';
import {useLoggedStore} from '../StateManager/userStore.ts';
import {IDiscussion} from '../Types/discussions';
import {COLORS} from "../Styles/constants.tsx";

type RootFromMessageEchange = {
  Salle: undefined;
};
type openMessageEchange = NativeStackNavigationProp<RootFromMessageEchange>;

export default function ListDiscussion() {
  const navigationMessageEchange = useNavigation<openMessageEchange>();
  const {serverUrl} = useConfig();
  const {userId, token} = useLoggedStore();
  console.log('userId for Discussions ??', userId);
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
  // const handleOpenMessageEchange = () => {
  //   navigationMessageEchange.navigate('Salle');
  // };

  const [image, setImage] = useState<string>('');
  const imageUrl =
    'https://images.pexels.com/photos/3937272/pexels-photo-3937272.jpeg';

  useEffect(() => {
    if (image) {
      setImage(
        'https://images.pexels.com/photos/3937272/pexels-photo-3937272.jpeg',
      );
    } else {
      setImage(imageUrl);
    }
  }, [image]);

  const handleClick = async (dataRoom: IDiscussion) => {
    try {
      // @ts-ignore
      navigationMessageEchange.navigate('Salle', {
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
      {dataDiscussion.map(discussion => (
        <TouchableOpacity
            style={style.discussionContainer}
          key={discussion.room.id}
          onPress={() => handleClick(discussion)}>
          <Discussion styles={style.discussionStyle}>
            <View style={style.imageContainer}>
              <ImageBackground
                style={{width: 50, height: 50, borderRadius: 50 / 2}}
                source={{
                  uri: `${image}`,
                }}
              />
            </View>
            <View>
              {/* eslint-disable-next-line react-native/no-inline-styles */}
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
  disposition: {
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  discussionContainer: {
    minWidth: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 5,
  },
  imageContainer: {
    width: 50,
    height: 50,
  },
  discussionStyle: {
    minWidth: '100%',
    margin: 2,
    backgroundColor: COLORS.darkLavender,
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    padding: 10,
  },
});
