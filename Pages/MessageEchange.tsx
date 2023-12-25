import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TextInput, Button, ScrollView, StyleSheet} from 'react-native';
import {useConfig} from "../Hook/useConfig";
import {useLoggedStore} from "../StateManager/userStore";
import Toast from "react-native-toast-message";
import type {ISavedMessage, Message} from "../Types/chat";


const MessageEchange: React.FC = ({  navigation, route }: any) => {
    const { roomId } = route.params || {};
    const {serverUrl} = useConfig();
    const {token, username} = useLoggedStore();
    // const socketUrl = `wss://go-chat-docker.onrender.com/ws?name=nass`;
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [serverResponse, setServerResponse] = useState<string>('');
    const [messageInput, setMessageInput] = useState<Message>({
        action: "send-message",
        message: "",
        target: {id: "989996dd-f092-479e-a1b6-192c0a7d19f1", name: roomId ? roomId : null}
    });

    const [messageHistory, setMessageHistory] = useState<string[]>([]);
    const [messages, setMessages] = useState<ISavedMessage[]>([]);
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
    const [sendername, setSendername] = useState<string>('')
    const [sendermessage, setSendermessage] = useState<string>('')
    const [action, setAction] = useState<string>('')
    const scrollViewRef = useRef<ScrollView>(null);

    const handleJoinRoom = () => {
        if(!ws) {
            return;
        }
        ws.send(JSON.stringify({
            action: "join-hub",
            message: roomId,
        }));
    }

    useEffect(() => {
        if (!ws) {
            return;
        }
        handleJoinRoom();
    } , [ws])


    const handleMessageChange = (text: string) => {
        console.log(text)
        setMessageInput({
            action: "send-message",
            message: text,
            target: {
                id: "989996dd-f092-479e-a1b6-192c0a7d19f1",
                name: roomId ? roomId : null
            }
        })
        setMessageInput((prevState) => {
            console.log('prevState', prevState)
            return prevState
        })

        setSendername(username)
        setSendermessage(text)
        setAction('send-message')
    }


useEffect(() => {

    // const newWs = new WebSocket('ws://10.0.2.2:9090/ws');
    const newWs = new WebSocket(`ws://10.0.2.2:8000/ws?name=nass&roomId=${roomId ? roomId : "0"}`);
    // const newWs = new WebSocket(`wss://go-chat-docker.onrender.com/ws?name=nass`);

    newWs.onopen = () => {
        // Connection opened
        console.log('Connection opened');
        setWs(newWs);
    };

    newWs.onmessage = (e: any) => {
        // a message was received
        let data = e.data;
        data = data.split(/\r?\n/);

        data.forEach((element: string) => {
            console.log('WebSocket element:', element)
            let msg = JSON.parse(element);
            console.log('WebSocket msg:', msg.message)
            console.log('WebSocket action:', msg.action)
            console.log("Websocker SENDER", msg?.sender?.roomId)

            if (msg.action &&
                msg?.action !== "send-message" &&
                msg?.sender?.name != "" &&
                msg?.sender?.roomId != "" &&
                msg?.sender?.roomId !== undefined &&
                msg?.sender?.roomId === roomId &&
                msg?.sender?.name != undefined) {

                onMessageAction(msg?.action, msg?.sender?.name);
            }

            if ((msg.action && msg?.action === "hub-joined") &&
                (msg?.sender?.roomId && msg?.sender?.roomId === roomId)) {
                onMessageAction(msg?.action, msg?.sender?.name);
            }

            setMessages((prevMessages) => [...prevMessages,
                {
                    sendername: msg?.sender?.name,
                    sendermessage: msg?.message,
                    action: msg?.action,
                    id: "989996dd-f092-479e-a1b6-192c0a7d19f1",
                    content: sendermessage ? sendermessage : null,
                    username: sendername ? sendername : null,
                    room_id: msg?.sender?.roomId ? roomId : null,
                    user_id: null,
                    created_at: null,

                }
            ]);

        })

    };

    newWs.onerror = (e: Event) => {
        // An error occurred
        console.log('Error:', e);
        setServerResponse('Error connection: ' + e);
    };

    newWs.onclose = (e: any) => {
        // Connection closed
        console.log('Connection closed:', e.code, e.reason);
        setWs(null);
        setServerResponse('Connection closed');
    };

}, []);

const sendMessage = () => {
    console.log('sendmessage')
    if (!ws || !messageInput) {
        console.log('!ws', '!message')
        return;
    }

    if (messageInput.message === '') {
        Toast.show({type: 'error', text1: 'Veuillez écrire un message'});
        return;
    }
    console.log('messageInput.message')
    ws.send(JSON.stringify(messageInput));
    console.log('messageInput', messageInput)
    if(scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });

    }

    setMessageInput({
        action: "send-message",
        message: "",
        target: {
            id: "989996dd-f092-479e-a1b6-192c0a7d19f1",
            name: "1"
        }
    })

};


const onMessageAction = (action: string, personName: string) => {
    console.log('action ', action)
    console.log('personName ', personName)

    if (action) {
        if (action === "hub-joined") {
            Toast.show(
                {
                    type: 'success',
                    text1: `Bienvenue dans la salle`,
                }
            );
            setConnectedUsers((prevConnectedUsers) => [...prevConnectedUsers, personName]);
        }
    }

    if (personName && action) {
        if (personName != "" && (action === "user-join")) {
            Toast.show(
                {
                    type: 'info',
                    text1: `${personName} vient de rejoindre la salle`,
                }
            );
            setConnectedUsers((prevConnectedUsers) => [...prevConnectedUsers, personName]);
        }
        if (personName != "" && action === "user-left") {
            Toast.show(
                {
                    type: 'info',
                    text1: `${personName} vient de quitter la salle`,
                }
            );

            setConnectedUsers((prevConnectedUsers) => prevConnectedUsers.filter((user) => user !== personName));
        }
    }
}


console.log("messages =======> ", messages.filter((message) => message.action === "send-message"))


// console.log("Message Input ==> :", messageInput);
return (
    <View>
        <Text>TCP Client Example {roomId}</Text>
        {/*<Button title="Connect to Server" onPress={connectWebSocket}/>*/}

        <Text>Server Response: {serverResponse}</Text>
        <Text>Message History:</Text>
        <ScrollView ref={scrollViewRef as React.RefObject<ScrollView>} onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}>
            {messages
                .filter((message) => message.action === "send-message")
                .map((message, index) => (
                <View key={index} style={message.sendername === "nass" ? style.bubbleLeft : style.bubbleRight}>
                    <View style={style.bubbleMessage}>
                        <Text>{message.sendermessage}</Text>
                    </View>
                    <View style={style.bubbleUsername}>
                        <Text>{message.sendername}</Text>
                    </View>
                </View>

            ))}
        </ScrollView>
        <TextInput
            placeholder="Ecrivez ici"
            value={messageInput.message}
            onChangeText={(text) => handleMessageChange(text)}
        />
        <Button title="Envoyer" onPress={sendMessage}/>
    </View>
);

};

export default MessageEchange;

const style = StyleSheet.create({
    bubbleLeft : {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        margin: 10,
    },
    bubbleRight : {
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        margin: 10,
    },
    bubbleMessage: {
        backgroundColor: '#A6A8C9',
        padding: 10,
        borderRadius: 20,
        borderTopLeftRadius: 0,
    },
    bubbleUsername: {
        marginTop: 2,
        padding: 5,
        fontSize: 10,
        color: '#999',
    }

})