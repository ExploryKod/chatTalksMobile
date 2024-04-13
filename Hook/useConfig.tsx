export const useConfig = () => {
  const serverUrl: string = 'https://go-chat-docker.onrender.com';
  const wsUrl: string = 'wss://go-chat-docker.onrender.com/ws';
  //const serverUrl: string = 'http://10.0.2.2:8000';
  // const wsUrl: string = 'ws://10.0.2.2:8000/ws';
  return {serverUrl, wsUrl};
};
