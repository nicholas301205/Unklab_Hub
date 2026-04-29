package config

import (
	"fmt"

	"github.com/nicholas301205/Unklab_Hub/tree/master/backend/models"
)

func MigrateDB() {
	err := DB.AutoMigrate(
		&models.User{},
		&models.Post{},
		&models.Bookmark{},
		&models.Comment{},
		&models.Report{},
	)
	if err != nil {
		fmt.Println("Migrasi gagal:", err)
		return
	}
	fmt.Println("Migrasi database berhasil!")
}
