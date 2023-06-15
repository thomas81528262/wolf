
Todo: Add migration library goose

Steps to generate sqlboiler codes
1. Update wolf.sql
## 2. load the sql into db: mysql -u wolf -pwolf wolf < wolf.sql
3. run: sqlboiler mysql

Goose migration:
1. create a migration file: goose mysql "wolf:wolf@/wolf?parseTime=true" create init sql
2. run migration: goose mysql "wolf:wolf@/wolf?parseTime=true" up

log into local db:
mysql -u wolf -P 3306 -pwolf wolf