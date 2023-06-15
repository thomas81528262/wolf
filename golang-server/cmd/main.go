package main

import (
	"database/sql"
	"fmt"
	"net/http"

	_ "github.com/lib/pq"
	"github.com/thomas81528262/wolf/golang-server/router"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "test"
	dbname   = "postgres"
)

func main() {
	fmt.Println("Hello world.")

	postgresqlDbInfo := fmt.Sprintf("host=%s port=%d user=%s "+
		"password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbname)

	db, err := sql.Open("postgres", postgresqlDbInfo)
	if err != nil {
		fmt.Println(fmt.Sprintf("failed to connect to database; %s", err.Error()))
		panic(err.Error())
	}
	defer db.Close()
	fmt.Println("connected to database!")

	handler := router.RegisterGraphqlEndpoints(db)

	http.ListenAndServe(":9000", handler)
}
