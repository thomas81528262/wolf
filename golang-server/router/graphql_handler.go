package router

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/thomas81528262/wolf/golang-server/graph"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

func createGraphqlHandler(db *sql.DB) gin.HandlerFunc {
	h := handler.NewDefaultServer(graph.NewExecutableSchema(db))
	// gql middleware
	// h.AroundFields()
	return func(ctx *gin.Context) {
		h.ServeHTTP(ctx.Writer, ctx.Request)
	}
}

func createGraphqPlaygroundlHandler(db *sql.DB) gin.HandlerFunc {
	h := playground.Handler("Graphql playground", RouterGroupV1)
	return func(ctx *gin.Context) {
		h.ServeHTTP(ctx.Writer, ctx.Request)
	}
}
