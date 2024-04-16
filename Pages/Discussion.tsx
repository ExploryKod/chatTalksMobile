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
                    console.log("LAST MESS", data)
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
                roomId: dataRoom.room.id.toString(),
                roomName: dataRoom.room.name,
                roomDescription: dataRoom.room.description,
            });
        } catch (error) {
            console.error('log failed:', error);
        }
    };

    const handleDeleteDiscussion = async (roomId: string) => {
        try {
            await fetch(`${serverUrl}/user/discussion/delete/${userId}/${roomId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'same-origin',
            });
            const newDiscussion = dataDiscussion.filter(
                discussion => discussion.room.id !== roomId,
            );
            setDataDiscussion(newDiscussion);
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
                            <Text style={{fontWeight: 'bold'}}>{discussion.last_message.username ? discussion.last_message.username + ": " : "" }
                                <Text style={{fontWeight: 'normal'}}>
                                    {discussion.last_message.content ? discussion.last_message.content : "Envoyez un message en premier !"}
                                </Text>
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={style.deleteButton}
                            onPress={() => handleDeleteDiscussion(discussion.room.id)}>
                            <Text style={{ color: 'purple' }}>X</Text>
                        </TouchableOpacity>
                    </Discussion>
                </TouchableOpacity>
            ))}
        </Main>
    );
}

const style = StyleSheet.create({
    disposition: {
        paddingTop: 30,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    discussionContainer: {
        minWidth: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    imageContainer: {
        width: 50,
        height: 50,
    },
    discussionStyle: {
        borderRadius: 5,
        minWidth: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 10,
        marginBottom: 0,
        backgroundColor: COLORS.darkLavender,
        display: 'flex',
        flexDirection: 'row',
        gap: 25,
        padding: 10,
    },
    deleteButton: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
        backgroundColor: 'white',
        marginLeft: 'auto',
    },
});
