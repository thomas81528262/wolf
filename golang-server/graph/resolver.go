package graph

import (
	"database/sql"

	"github.com/99designs/gqlgen/graphql" // This file will not be regenerated automatically.
	//
	// It serves as dependency injection for your app, add any dependencies you require here.
	"github.com/thomas81528262/wolf/golang-server/graph/generated"
)

type Resolver struct {
	db *sql.DB
}

func NewExecutableSchema(db *sql.DB) graphql.ExecutableSchema {
	return generated.NewExecutableSchema(generated.Config{
		Resolvers: &Resolver{
			db: db,
		},
	})
}
