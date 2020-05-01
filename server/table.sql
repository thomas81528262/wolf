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

CREATE TABLE template_role (
	roleid int4 NOT NULL,
	"number" int4 NOT NULL,
	"name" varchar NOT NULL,
	darkpriority int4 NULL,
	CONSTRAINT template_role_pk PRIMARY KEY (roleid, name),
	CONSTRAINT template_role_fk FOREIGN KEY (name) REFERENCES template_header(name) ON DELETE CASCADE
);

CREATE TABLE template_header (
	"name" varchar NOT NULL,
	description varchar NULL,
	isenabled bool NULL,
	CONSTRAINT template_header_pk PRIMARY KEY (name)
);