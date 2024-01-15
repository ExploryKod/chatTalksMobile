import React, {useEffect, useState} from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet, ImageBackground} from 'react-native';
import {IRoom} from '../Types/chat';
import {useConfig} from '../Hook/useConfig';
import {useLoggedStore} from "../StateManager/userStore";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {openMessageEchange} from "../Types/chat";
import * as url from "url";

const RoomCard = ({name, description, id}: IRoom) => {

    const [image, setImage] = useState<string>("");
    const imageUrl = "https://images.pexels.com/photos/3937272/pexels-photo-3937272.jpeg"
    const navigationMessageEchange = useNavigation<openMessageEchange>();

    useEffect(() => {
        if (image) {
            setImage(`https://source.unsplash.com/200x200/?${name.split(' ')[0]}`);
        } else {
            setImage(imageUrl);
        }

    }, [image]);


    const handleClick = async () => {
        try {
            // @ts-ignore
            navigationMessageEchange.navigate('MessageEchange', {
                roomId: id.toString(),
                roomName: name,
                roomDescription: description
            });
        } catch (error) {
            console.error('log failed:', error);
        }
    };

    return (
        <View style={styles.container}>

            <View style={styles.body}>
                {image ?
                    (<ImageBackground source={{uri: image}} style={styles.image}>
                        <View style={styles.body__text}>
                            <Text style={styles.name}>{name}</Text>
                        </View>
                    </ImageBackground>) :
                    (<View style={styles.body__text}>
                        <Text style={styles.name}>{name}</Text>
                    </View>)}

            </View>
            <View style={styles.wrapperDescription}>
                <Text style={styles.description}>{description}</Text>
            </View>
            <TouchableOpacity
                onPress={handleClick}
            >
                <View style={styles.link}>
                    <Text style={{
                        color: '#fff',
                        textAlign: 'center',
                        textTransform: "uppercase",
                        fontWeight: "bold"
                    }}>Rejoindre</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '90%',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        backgroundColor: '#F2F3F7',
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 30,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',

    },

    image: {
        width: '100%',
        minHeight: 300,
        borderRadius: 5,
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 10,
    },
    body__text: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(163, 41, 139, 0.8)',
        marginBottom: 0,
    },
    wrapperDescription: {
        marginTop: 30,
        marginBottom: 0,
        paddingLeft: 0,
        display: 'flex',
        flexDirection: 'column',
    },
    body__img: {
        marginBottom: 10,
    },
    description: {
        textAlign: 'left',
        padding: 0,
        fontSize: 16,
        color: '#A3298B',
    },
    name: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        paddingVertical: 10,
    },
    link: {
        maxWidth: 250,
        marginTop: 20,
        paddingHorizontal: 25,
        paddingVertical: 15,
        backgroundColor: '#A3298B',
        color: '#fff',
        borderRadius: 5,
    },
});

export default RoomCard