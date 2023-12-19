import React, {useState, useEffect} from 'react';
import {View, Text, TextInput, Button, ScrollView} from 'react-native';
import {useConfig} from "../Hook/useConfig";
import {useLoggedStore} from "../StateManager/userStore";
import Toast from "react-native-toast-message";
import type {ISavedMessage, Message} from "../Types/chat";


const MessageEchange: React.FC = ({  navigation, route }) => {
    const { roomId } = route.params || {};
    console.log("TYPE ROOMID", typeof roomId)
        // console.log("room id ==> ", route.params.roomId)
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
    const newWs = new WebSocket(`ws://10.0.2.2:8000/ws?name=nass`);
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

            if (msg.action &&
                msg?.action !== "send-message" &&
                msg?.sender?.name != "" &&
                msg?.sender?.name != undefined) {

                onMessageAction(msg?.action, msg?.sender?.name);
            }

            if (msg.action && msg?.action === "hub-joined") {
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
                    room_id: roomId ? roomId : null,
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
        <TextInput
            placeholder="Enter message"
            value={messageInput.message}
            onChangeText={(text) => handleMessageChange(text)}
        />
        <Button title="Envoyer" onPress={sendMessage}/>
        <Text>Server Response: {serverResponse}</Text>
        <Text>Message History:</Text>
        <ScrollView>
            {messages
                .filter((message) => message.action === "send-message" && message.room_id.toString() === roomId.toString())
                .map((message, index) => (
                <View>
                    <Text key={index + Math.random()}>{message.sendermessage}</Text>
                </View>
            ))}
        </ScrollView>
    </View>
);

}
;

export default MessageEchange;