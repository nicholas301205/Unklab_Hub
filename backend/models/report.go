package models

import "time"

type Report struct {
	ID         uint      `json:"id"`
	PostID     uint      `json:"post_id"`
	Post       Post      `json:"post"`
	ReporterID uint      `json:"reporter_id"`
	Reporter   User      `json:"reporter"`
	Reason     string    `json:"reason"`
	CreatedAt  time.Time `json:"created_at"`
}
