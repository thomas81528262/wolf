package service

import (
	"context"
	"database/sql"
	"errors"
	"fmt"

	"github.com/thomas81528262/wolf/golang-server/apimodels"
	"github.com/thomas81528262/wolf/golang-server/db/models"
)

func GetRolesByID(ctx context.Context, db *sql.DB, input apimodels.GetRolesInput) (*apimodels.GetRolesResponse, error) {
	roles, err := models.Roles(
		models.RoleWhere.ID.IN(input.Ids),
	).All(ctx, db)
	if err != nil {
		errstring := fmt.Sprintf("failed to get roles by id: %s", err.Error())
		fmt.Println(errstring)
		return nil, errors.New(errstring)
	}
	resp := apimodels.GetRolesResponse{}

	for _, role := range roles {
		resp.Roles = append(resp.Roles, &apimodels.Role{ID: role.ID.Int, Name: role.Name})
	}

	return &resp, nil
}
