package models

import "time"

type Bookmark struct {
	ID        uint      `json:"id"`
	UserID    uint      `json:"user_id"`
	PostID    uint      `json:"post_id"`
	Post      Post      `json:"post"`
	CreatedAt time.Time `json:"created_at"`
}
