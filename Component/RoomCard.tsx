import React, {useEffect, useState} from 'react';
import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { IRoom } from '../Types/chat';
import { useConfig } from '../Hook/useConfig';
import {useLoggedStore} from "../StateManager/userStore";
import {useNavigation} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import type {openMessageEchange} from "../Types/chat";



const RoomCard = ({ name, description, id }: IRoom) => {
const { serverUrl } = useConfig();
const { token } = useLoggedStore();
const [image, setImage] = useState<string>("");
const queryChat: string = `?id=${id.toString()}&name=${name}&description=${description}`
const imageUrl = "https://images.pexels.com/photos/3937272/pexels-photo-3937272.jpeg"
const navigationMessageEchange = useNavigation<openMessageEchange>();

useEffect(() => {
    setImage(`https://source.unsplash.com/200x200/?${name.split(' ')[0]}`);
}, []);


    const handleClick = async () => {
        try {
            const response = await fetch(`${serverUrl}/chat/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                console.log("chatroom DATA :", data)
                navigationMessageEchange.navigate('MessageEchange');
            } else {
                console.log('échec de la réponse chatroom');
            }

        } catch (error) {
            console.error('log failed:', error);
        }
    };

return (
    <View style={styles.container}>

        <View  style={styles.body}>
            <View style={styles.body__text}>
                <Text style={styles.description}>{name}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
            <View style={styles.body__img}>
                <Image
                    style={styles.image}
                    source={image ? { uri: image } : { uri: imageUrl }}
                    alt={`${name}`}
                />
            </View>

        </View>
        <TouchableOpacity
            onPress={handleClick}
        >
            <View style={styles.link}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>Rejoindre le chat</Text>
            </View>
        </TouchableOpacity>
    </View>
);

}

const styles = StyleSheet.create({
    container: {
        width: 250,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        marginTop: 10,
        marginLeft: 'auto',
        marginRight: 'auto',
    },

    image: {
        width: '100%',
        minHeight: 150,
        maxHeight: 200,
        borderRadius: 5,
    },
    body: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 10,
    },
    body__text: {
        marginBottom: 10,
    },
    body__img: {
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#000',
    },
    link: {
        maxWidth: 250,
        marginTop: 10,
        padding: 10,
        backgroundColor: '#007BFF',
        borderRadius: 5,
    },
});

export default RoomCard