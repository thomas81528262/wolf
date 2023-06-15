package router

import (
	"database/sql"
	"net/http"

	"github.com/gin-gonic/gin"
)

const (
	RouterGroupV1 string = "/wolf/api/v1"
)

type HandlerEntry struct {
	Path      string
	Method    string
	Functions []gin.HandlerFunc
}

func RegisterGraphqlEndpoints(db *sql.DB) *gin.Engine {

	r := gin.New()
	// Todo: customer logger
	r.Use(gin.Logger(), gin.Recovery())

	// Authn: get and set session token
	// authn := AuthnticationMiddleware(db)

	routes := []HandlerEntry{
		{
			Path:   "/",
			Method: http.MethodPost,
			Functions: []gin.HandlerFunc{
				createGraphqlHandler(db),
			},
		}, {
			Path:   "/",
			Method: http.MethodGet,
			Functions: []gin.HandlerFunc{
				createGraphqPlaygroundlHandler(db),
			},
		},
	}

	for _, route := range routes {
		apiGroup := r.Group(RouterGroupV1)
		apiGroup.Handle(route.Method, route.Path, route.Functions...)
	}

	return r
}
