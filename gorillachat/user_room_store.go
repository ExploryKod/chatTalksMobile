package main

import (
	"log"
)

func (t *UserStore) GetUserDiscussions(id int) ([]DiscussionItem, error) {
	rows, err := t.Query("SELECT * FROM User_Room JOIN Users ON user_id = Users.id JOIN Rooms ON room_id = Rooms.id WHERE Users.id = ?", id)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var discussions []DiscussionItem

	for rows.Next() {
		var discussion DiscussionItem
		err := rows.Scan(&discussion.ID, &discussion.UserID, &discussion.RoomID, &discussion.JoinDate, &discussion.User.ID, &discussion.User.Username, &discussion.User.Password, &discussion.User.Admin, &discussion.User.Email, &discussion.Room.ID, &discussion.Room.Name, &discussion.Room.Description, &discussion.Room.Private)
		if err != nil {
			log.Println("ERREUR OCCURRED:", err)
			return nil, err
		}
		discussions = append(discussions, discussion)
	}

	return discussions, nil
}
