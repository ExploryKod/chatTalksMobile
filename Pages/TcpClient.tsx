import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView } from 'react-native';

const TcpClient: React.FC = () => {
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

    return (
        <View>
            <Text>TCP Client Example</Text>
            <Button title="Connect to Server" onPress={connectWebSocket}/>
            <TextInput
                placeholder="Enter message"
                value={inputMessage}
                onChangeText={(text) => setInputMessage(text)}
            />
            <Button title="Send Message" onPress={sendMessage}/>
            <Text>Server Response: {serverResponse}</Text>
            <Text>Message History:</Text>
            <ScrollView>
                {messageHistory.map((message, index) => (
                    <Text key={index}>{message}</Text>
                ))}
            </ScrollView>
        </View>
    );

};

export default TcpClient;