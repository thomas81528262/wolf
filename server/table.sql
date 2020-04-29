CREATE TABLE player (
	id int4 NOT NULL,
	"name" varchar NULL,
	roleid int4 NULL,
	pass varchar NULL,
	isempty bool NULL,
	CONSTRAINT player_pk PRIMARY KEY (id),
	CONSTRAINT player_un UNIQUE (name)
);


CREATE TABLE "role" (
	"name" varchar NULL,
	id int4 NULL,
	"number" int4 NULL
);

