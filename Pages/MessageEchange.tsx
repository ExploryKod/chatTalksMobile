import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useConfig} from '../Hook/useConfig';
import {useLoggedStore} from '../StateManager/userStore';
import Toast from 'react-native-toast-message';
import type {ISavedMessage, Message} from '../Types/chat';
import {COLORS} from '../Styles/constants.tsx';
import {SendHorizontal} from 'lucide-react-native';

const MessageEchange: React.FC = ({navigation, route}: any) => {
  const {roomId} = route.params || {};
  const {wsUrl, serverUrl} = useConfig();
  const {token, username} = useLoggedStore();
  // const socketUrl = `wss://go-chat-docker.onrender.com/ws?name=nass`;
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [serverResponse, setServerResponse] = useState<string>('');
  const [messageInput, setMessageInput] = useState<Message>({
    action: 'send-message',
    message: '',
    target: {
      id: '989996dd-f092-479e-a1b6-192c0a7d19f1',
      name: roomId ? roomId : null,
    },
  });

  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [messages, setMessages] = useState<ISavedMessage[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [sendername, setSendername] = useState<string>('');
  const [sendermessage, setSendermessage] = useState<string>('');
  const [action, setAction] = useState<string>('');
  const scrollViewRef = useRef<ScrollView>(null);


  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${serverUrl}/chat/messages/${roomId}`,{
          method: 'GET',
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            Authorization: `Bearer ${token}`,
          }});
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        console.log("MESSAGE TEST NASS",data.messages)
        setMessages(data.messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [roomId, serverUrl]);

  const handleJoinRoom = () => {
    if (!ws) {
      return;
    }
    ws.send(
      JSON.stringify({
        action: 'join-hub',
        message: roomId,
      }),
    );
  };

  useEffect(() => {
    if (!ws) {
      return;
    }
    handleJoinRoom();
  }, [ws]);

  const handleMessageChange = (text: string) => {
    console.log(text);
    setMessageInput({
      action: 'send-message',
      message: text,
      target: {
        id: '989996dd-f092-479e-a1b6-192c0a7d19f1',
        name: roomId ? roomId : null,
      },
    });
    setMessageInput(prevState => {
      console.log('prevState', prevState);
      return prevState;
    });

    setSendername(username);
    setSendermessage(text);
    setAction('send-message');
  };

  useEffect(() => {
    console.log('usernameNASS', username);
    // const newWs = new WebSocket('ws://10.0.2.2:9090/ws');

      const newWs = new WebSocket(
          `${wsUrl}?name=${username}&roomId=${roomId ? roomId : '0'}`,
      );
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
        // console.log('WebSocket element:', element);
        let msg = JSON.parse(element);
        // console.log('WebSocket msg:', msg.message);
        // console.log('WebSocket action:', msg.action);
        // console.log('Websocker SENDER', msg?.sender?.roomId);

        if (
          msg.action &&
          msg?.action !== 'send-message' &&
          msg?.sender?.name !== '' &&
          msg?.sender?.roomId !== '' &&
          msg?.sender?.roomId !== undefined &&
          msg?.sender?.roomId === roomId &&
          msg?.sender?.name !== undefined
        ) {
          onMessageAction(msg?.action, msg?.sender?.name);
        }

        if (
          msg.action &&
          msg?.action === 'hub-joined' &&
          msg?.sender?.roomId &&
          msg?.sender?.roomId === roomId
        ) {
          onMessageAction(msg?.action, msg?.sender?.name);
        }

        setMessages(prevMessages => {
          const newMessage = {
            sendername: msg?.sender?.name,
            sendermessage: msg?.message,
            action: msg?.action,
            id: '989996dd-f092-479e-a1b6-192c0a7d19f1',
            content: msg?.message,
            username: msg?.sender?.name,
            room_id: msg?.sender?.roomId ? roomId : null,
            user_id: null,
            created_at: null,
          };

          if (!prevMessages || prevMessages.length === 0) {
            return [newMessage];
          }

          return [...prevMessages, newMessage];
        });
      });
    };

    newWs.onerror = (e: Event) => {
      console.log('Error:', e);
      setServerResponse('Error connection: ' + e);
    };

    newWs.onclose = (e: any) => {
      console.log('Connection closed:', e.code, e.reason);
      setWs(null);
      setServerResponse('Connection closed');
    };
  }, []);

  const sendMessage = () => {
    console.log('sendmessage');
    if (!ws || !messageInput) {
      console.log('!ws', '!message');
      return;
    }

    if (messageInput.message === '') {
      Toast.show({type: 'error', text1: 'Veuillez écrire un message'});
      return;
    }
    ws.send(JSON.stringify(messageInput));

    // send message to the server post request on /send-message route
    fetch(`${serverUrl}/send-message`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`,
      },
      body: new URLSearchParams({
        content: messageInput.message,
        roomID: roomId,
        username: username,
      }).toString(),
    })
      .then(response => {
        console.log("INFO IMPORTANT", roomId, messageInput.message, username)
        if (response.ok) {
          return response.json();
        } else {
          console.error('Failed to send message');
        }
      })
      .then(data => {
        console.log('data sned Message', data);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });

    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({animated: true});
    }

    setMessageInput({
      action: 'send-message',
      message: '',
      target: {
        id: '989996dd-f092-479e-a1b6-192c0a7d19f1',
        name: '1',
      },
    });
  };

  const onMessageAction = (action: string, personName: string) => {
    console.log('action ', action);
    console.log('personName ', personName);

    if (action) {
      if (action === 'hub-joined') {
        Toast.show({
          type: 'success',
          text1: 'Bienvenue dans la salle',
        });
        setConnectedUsers(prevConnectedUsers => [
          ...prevConnectedUsers,
          personName,
        ]);
      }
    }

    if (personName && action) {
      if (personName !== '' && action === 'user-join') {
        Toast.show({
          type: 'info',
          text1: `${personName} vient de rejoindre la salle`,
        });
        setConnectedUsers(prevConnectedUsers => [
          ...prevConnectedUsers,
          personName,
        ]);
      }
      if (personName !== '' && action === 'user-left') {
        Toast.show({
          type: 'info',
          text1: `${personName} vient de quitter la salle`,
        });

        setConnectedUsers(prevConnectedUsers =>
          prevConnectedUsers.filter(user => user !== personName),
        );
      }
    }
  };
  console.log('messages', messages);
  return (
    <View style={style.messageContainer}>
      <ScrollView
        ref={scrollViewRef as React.RefObject<ScrollView>}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd()}>
        {messages && messages
          .filter(message => message?.action === 'send-message')
          .map((message, index) => (
            <View
              key={index}
              style={
                message.username === username
                  ? style.bubbleUser
                  : style.bubbleOther
              }>
              <View style={style.bubbleUsername}>
                <Text
                  style={
                    message.username !== username
                      ? {color: COLORS.darkBlue}
                      : {color: COLORS.darkpink}
                  }>
                  {message.username}
                </Text>
              </View>
              <View
                style={
                  message.username !== username
                    ? style.bubbleMessageUser
                    : style.bubbleMessageOther
                }>
                <Text style={{color: COLORS.lightLavender}}>
                  {message.content}
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
      <View style={style.messageInfo}>
        <Text style={style.info}>Salle {roomId}</Text>
      </View>
      <View style={style.messageForm}>
        <TextInput
          placeholder="Ecrivez ici"
          value={messageInput.message}
          onChangeText={text => handleMessageChange(text)}
        />
        <TouchableOpacity onPress={sendMessage} style={style.sendMessageBtn}>
          <SendHorizontal color={COLORS.darkBlue} height={50} width={30} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MessageEchange;

const style = StyleSheet.create({
  messageContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: COLORS.darkLavender,
  },
  bubbleOther: {
    maxWidth: '100%',
    margin: 10,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  bubbleUser: {
    maxWidth: '100%',
    margin: 10,
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  bubbleMessageUser: {
    minWidth: 100,
    padding: 10,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    backgroundColor: COLORS.darkpink,
  },
  bubbleMessageOther: {
    minWidth: 100,
    padding: 10,
    borderRadius: 20,
    borderTopLeftRadius: 0,
    backgroundColor: COLORS.darkBlue,
  },
  bubbleUsername: {
    marginTop: 2,
    padding: 5,
    fontSize: 10,
    color: '#999',
  },
  messageForm: {
    minHeight: 50,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.lightLavender,
  },
  messageInfo: {
    minHeight: 30,
    maxWidth: '40%',
    borderTopRightRadius: 20,
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.darkBlue,
  },
  info: {
    color: COLORS.light,
  },
  sendMessageBtn: {
    padding: 10,
    backgroundColor: 'transparent',
  },
});
