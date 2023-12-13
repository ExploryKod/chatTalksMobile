package main

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"net/http"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Message struct {
	Message string `json:"message"`
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Error upgrading to WebSocket connection:", err)
		return
	}
	defer conn.Close()

	fmt.Println("New WebSocket connection established.")

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			return
		}

		fmt.Printf("Message received from client: %s\n", string(p))

		if p[0] == '{' {
			// Assume it's a JSON message
			var msg Message
			if err := json.Unmarshal(p, &msg); err != nil {
				fmt.Println("Error decoding JSON:", err)
				continue
			}

			fmt.Println("Decoded JSON Message:", msg.Message)

			// Do something with the decoded JSON message
			// ...

			if err := conn.WriteMessage(messageType, p); err != nil {
				fmt.Println("Error writing message:", err)
				return
			}
		} else {
			// Handle non-JSON message (e.g., 'Hello, Server!')
			fmt.Println("Non-JSON Message:", string(p))
		}
	}
}

func main() {
	http.HandleFunc("/ws", handleConnections)

	fmt.Println("Server listening on :9090")
	err := http.ListenAndServe(":9090", nil)
	if err != nil {
		fmt.Println("Error starting server:", err)
		return
	}
}
