import { StyleSheet, TextInput, View, Text } from "react-native";
import WS from 'react-native-websocket';
import Main from "../Component/Main";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useEffect, useState} from "react";
import {useLoggedStore} from "../StateManager/userStore";
import Toast from "react-native-toast-message";
import type {ISavedMessage} from "../Types/chat";

export default function MessageEchange() {
  const ListMessage = [
    { username: 'khalifa', message: 'salut' },
    { username: 'Autre', message: 'comment tu vas' },
    { username: 'Khalifa', message: 'Je vais bien et toi' },
    { username: 'Khalifa', message: 'Je vais bien et toi' },
    { username: 'Autre', message: 'Je vais bien et toi' },
  ];
  const { token, username } = useLoggedStore();
  const [inputText, setInputText] = useState<{ [key: string]: string }>({});
  const [messageInput, setMessageInput] = useState<any>({});
  const [messages, setMessages] = useState<ISavedMessage[]>([]);

  const handleChange = (name: string, value: string) => {
    setInputText((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log('Message envoyé :');

  };


  // useEffect(() => {
  //
  //   const socketUrl = `:wss//go-chat-docker.onrender.com/ws?name=${username ? username : "unknown"}`;
  //
  //   return (
  //       <WS
  //           ref={ref => {this.ws = ref}}
  //           url={socketUrl}
  //           onOpen={() => {
  //             console.log('WebSocket connected');
  //             setSocket(this.ws);
  //           }}
  //           onClose={(event) => {
  //             console.log('WebSocket closed:', event);
  //             setSocket(null);
  //           }}
  //           onMessage={(event) => {
  //             let data = event.nativeEvent.data;
  //             data = data.split(/\r?\n/);
  //             console.log('WebSocket data:', data)
  //             data.forEach((element: string) => {
  //               console.log('WebSocket element:', element)
  //               let msg = JSON.parse(element);
  //               console.log('WebSocket msg:', msg.message)
  //               console.log('WebSocket action:', msg.action)
  //
  //               if (msg.action &&
  //                   msg?.action !== "send-message" &&
  //                   msg?.sender?.name != "" &&
  //                   msg?.sender?.name != undefined) {
  //
  //                 onMessageAction(msg?.action, msg?.sender?.name);
  //               }
  //
  //               if(msg.action && msg?.action === "hub-joined") {
  //                 onMessageAction(msg?.action, msg?.sender?.name);
  //               }
  //
  //               setMessages((prevMessages) => [...prevMessages,
  //                 {
  //                   sendername: msg?.sender?.name,
  //                   sendermessage: msg?.message,
  //                   action : msg?.action,
  //                   id: null,
  //                   content: null,
  //                   username: null,
  //                   room_id: null,
  //                   user_id: null,
  //                   created_at: null,
  //                 }
  //               ]);
  //             })
  //           }}
  //           onError={(error: any) => {
  //             console.error('WebSocket error:', error);
  //           }}
  //           reconnect // Will try to reconnect onClose
  //       />
  //   );
  // }, []);

  const sendMessage = () => {

    if (!messageInput) {
      return;
    }

    if (messageInput.message === '') {
      Toast.show({
        type: 'error',
        text1: "Veuillez écrit un message"
      });
      return;
    }
    // socket.send(JSON.stringify(messageInput));
    console.log('username', username)
    const response: Promise<Response> = fetch('http://localhost:8000/send-message', {
      method: 'POST',
      mode: "cors",
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      // @ts-ignore
      body: new URLSearchParams({
        "username": username,
        "content": messageInput.message,
        "roomID": 1,
      }),
    })

    console.log('response', response)

    setMessageInput({
      action: "send-message", message: "", target: {
        id: "",
        name: 1
      }
    });
  };

  return (
    <Main styles={style.disposition}>
      <View>
        {ListMessage.map((message, index) => (
          <Text
            key={index}
            style={[
              message.username === 'Autre'
                ? style.messageLeft
                : style.messageRight,
            ]}
          >
            {message.message}
          </Text>
        ))}
      </View>

      <View style={style.composantInput}>
        <TextInput
          keyboardType="default"
          secureTextEntry={true}
          // onChangeText={(text) => handleChange('Password', text)}
          value={messageInput.message}
          onChange={(e) => setMessageInput({
            action: "send-message",
            message: e.nativeEvent.text,
            target: {
              id: "989996dd-f092-479e-a1b6-192c0a7d19f1",
              name: 1,
            }
          })}
          style={style.inputProp}
          placeholderTextColor="black"
          placeholder="message"

        />
        <Text onPress={handleSubmit} style={style.buttonEnvoyer}>
          envoyer
        </Text>
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
