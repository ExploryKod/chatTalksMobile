import { useEffect, useState, useRef } from "react";
import {StyleSheet, TextInput, View, Text, TouchableOpacity} from "react-native";
// @ts-ignore
import { v4 as uuidv4 } from 'uuid';

// @ts-ignore
import { WS } from 'react-native-websocket';
import Main from "../Component/Main";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import {useLoggedStore} from "../StateManager/userStore";
import Toast from "react-native-toast-message";
import type {ISavedMessage, MessageInput } from "../Types/chat";
import {useConfig} from "../Hook/useConfig";



export default function MessageEchange() {
  const { serverUrl } = useConfig();
  const { token, username } = useLoggedStore();
  const [inputText, setInputText] = useState<{ [key: string]: string }>({});
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [messageInput, setMessageInput] = useState<MessageInput>({action: "send-message", message: "", target: {id: "", name: ""}});
  const [messages, setMessages] = useState<ISavedMessage[]>([]);
  const socketUrl = `wss://go-chat-docker.onrender.com/ws?name=${username ? username : "unknown"}`;
  const [serverResponse, setServerResponse] = useState<string>('');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

  useEffect(() => {
      if (ws) {
          ws.onmessage = (e: any) => {
              const receivedMessage = e.data;
              setServerResponse(receivedMessage);
              setMessageHistory((prevHistory) => [...prevHistory, receivedMessage]);
              handleJsonMessage(receivedMessage); // Call the JSON handling method
          };
      }
  }, [ws]);

  const connectWebSocket = () => {
      const newWs = new WebSocket('ws://10.0.2.2:9090/ws');

      newWs.onopen = () => {
          // Connection opened
          newWs.send('Hello, Server!'); // Send a message
      };

      newWs.onerror = (e: Event) => {
          // An error occurred
          console.log('Error:', e);
          setServerResponse('Error connection: ' + e);
      };

      newWs.onclose = (e: any) => {
          // Connection closed
          console.log('Connection closed:', e.code, e.reason);
          setServerResponse('Connection closed');
      };

      setWs(newWs);
  };

  // const sendMessage = async () => {
  //   try {
  //     if (!messageInput.message) {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Veuillez écrire un message',
  //       });
  //       return;
  //     }

  //   } catch (error) {
  //     console.error('Error:', error);
  //     // Handle the error
  //   }
  // };


  const sendMessage = () => {
      if (ws) {
          const jsonMessage = JSON.stringify({ message: inputMessage }); // Convert to JSON
          ws.send(jsonMessage); // Send the JSON message
          setInputMessage('');
      }
  };

  // Method to handle incoming JSON messages
  const handleJsonMessage = (jsonString: string) => {
      try {
          const jsonMessage = JSON.parse(jsonString);
          // Handle the JSON message object as needed
          console.log('Received JSON Message:', jsonMessage);
      } catch (error) {
          console.error('Error parsing JSON:', error);
      }
  };

  const handleMessageChange = (text: string) => {

    setMessageInput({
      action: "send-message",
      message: text,
      target: {
        id: "989996dd-f092-479e-a1b6-192c0a7d19f1",
        name: "1", // Adjust the room name as needed
      },
    });

  };

  useEffect(() => {

    console.log("Message Input ==> :", messageInput);

    ws.onopen = () => {
      // connection opened
      ws.send(JSON.stringify(messageInput)); // send a message
    };

    ws.onmessage = (e) => {
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
            id: null,
            content: null,
            username: null,
            room_id: "1",
            user_id: null,
            created_at: null,

          }
        ]);

      })

    };

    ws.onerror = (e) => {
      // an error occurred
      console.log(e.message);
    };

    ws.onclose = (e) => {
      // connection closed
      console.log(e.code, e.reason);
    };

    return () => {
      ws.close();
    };

  }, []);


  const onMessageAction = (action: string, personName: string) => {
    console.log('action ', action)
    console.log('personName ', personName)

    if(action) {
      if(action === "hub-joined") {
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

console.log("messages", messages)
  return (
    <Main styles={style.disposition}>
      <View>
        {messages.map((message, index) => (
          <Text
            key={index}
            style={style.messageLeft}
          >
            {message.sendermessage}
          </Text>
        ))}
      </View>

      <View style={style.composantInput}>
        <TextInput
          keyboardType="default"
          value={messageInput.message}
          onChangeText={(text) => handleMessageChange(text)}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="message"

        />
        <TouchableOpacity onPress={sendMessage}>
          <Text>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </Main>
  );
}

const style = StyleSheet.create({
  composantInput: {
    width: wp(100),
    borderRadius: 25,
    flexDirection: 'row',
    gap: hp(1),
    alignItems: 'center',
    padding: hp(1),
  },
  disposition: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    gap: hp(3),
  },
  inputProp: {
    flex: 1,
    height: hp(8),
    backgroundColor: '#dcdcdc',
    borderRadius: 100,
    fontSize: hp(2),
    padding: 10,
  },
  buttonEnvoyer: {
    backgroundColor: '#A3298B',
    width: wp(20),
    height: hp(8),
    borderRadius: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: hp(2.5),
    color: 'white',
  },

  messageLeft: {
    backgroundColor: '#dcdcdc',
    marginTop: hp(0.8),
    marginStart: hp(1),
    padding: hp(1),
    fontSize: hp(2.5),
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  messageRight: {
    backgroundColor: '#dcdcdc',
    marginTop: hp(0.8),
    marginEnd: hp(1),
    padding: hp(1),
    fontSize: hp(2.5),
    borderRadius: 15,
    alignSelf: 'flex-end',
  },
});
