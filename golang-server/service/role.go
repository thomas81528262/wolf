package service

import (
	"context"

	"github.com/thomas81528262/wolf/golang-server/apimodels"
)

func GetRolesByID(ctx context.Context, input apimodels.GetRolesInput) (*apimodels.GetRolesResponse, error) {
	return &apimodels.GetRolesResponse{Roles: []*apimodels.Role{{Name: "fake", ID: "fake"}}}, nil
}
