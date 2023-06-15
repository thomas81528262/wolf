#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE player (
	id int4 NOT NULL,
	"name" varchar NULL,
	roleid int4 NULL,
	pass varchar NULL,
	adminpass varchar NULL,
	isempty bool NULL,
	ischiefcandidate bool NULL,
	ischiefdropout bool NULL,
	isdie bool NULL,
	votetarget varchar NULL,
	ischief bool NULL,
	isjoin bool NULL,
	CONSTRAINT player_pk PRIMARY KEY (id),
	CONSTRAINT player_un UNIQUE (name)
);

CREATE TABLE "role" (
	"name" varchar NULL,
	id int4 NULL,
	"number" int4 NULL,
	functionname varchar NULL,
	camp varchar NULL,

	CONSTRAINT role_pk PRIMARY KEY (name)
);

CREATE TABLE game_event (
	"type" varchar NOT NULL,
	repeat_times int4 NOT NULL,
	"name" varchar NULL,
	is_busy bool NOT NULL,
	is_dark bool NULL,
	CONSTRAINT game_event_pk PRIMARY KEY (type)
);

CREATE TABLE vote_history (
	id int4 NOT NULL,
	"name" varchar NOT NULL,
	history_id serial NOT NULL,
	target varchar NULL,
	CONSTRAINT vote_history_pkey PRIMARY KEY (history_id)
);

CREATE TABLE template_header (
	"name" varchar NOT NULL,
	description varchar NULL,
	isenabled bool NULL,
	CONSTRAINT template_header_pk PRIMARY KEY ("name")
);

CREATE TABLE template_role (
	roleid int4 NOT NULL,
	"number" int4 NOT NULL,
	"name" varchar NOT NULL,
	darkpriority int4 NULL,
	CONSTRAINT template_role_pk PRIMARY KEY (roleid,"name"),
	CONSTRAINT template_role_fk FOREIGN KEY ("name") REFERENCES template_header("name") ON DELETE CASCADE
);

INSERT INTO game_event
("type", repeat_times, "name", is_busy, is_dark)
VALUES('VOTE', 0, NULL, false, false);

INSERT INTO public.player (id,"name",roleid,pass,isempty) VALUES 
(0,'Peggy',0,'123',NULL)
,(1,'Yao',2,'',false)
,(2,'Wemy',2,'',false)
,(4,'shumao',1,'',false)
,(3,'thomas',3,'',false)
,(11,'jun',1,'',false)
,(12,'昱安',7,'',false)
,(6,'fish',5,'',false)
,(5,'Chang Liu',2,'',false)
,(9,'chengyi',14,'',false)
;

UPDATE public.player set adminPass='1237' where id = 0;

INSERT INTO public.player (id,"name",roleid,pass,isempty) VALUES 
(8,'Herman',15,'',false)
,(7,'Jayden',1,'',false)
,(10,'書豪',2,'',false)
;

INSERT INTO public."role" ("name",id,"number",functionname,camp) VALUES 
('預言家 🔮',1,0,NULL,NULL)
,('女巫 🧪',2,0,NULL,NULL)
,('獵人 🏹',3,0,NULL,NULL)
,('白痴 🙃',4,0,NULL,NULL)
,('守衛 🛡',5,0,NULL,NULL)
,('騎士 🤺',6,0,NULL,NULL)
,('通靈師 👁',7,0,NULL,NULL)
,('守墓人 ⚰️',8,0,NULL,NULL)
,('獵魔人 ⚔️👹',9,0,NULL,NULL)
,('攝夢人 🌌',10,0,NULL,NULL)
,('魔術師 🪄',11,0,NULL,NULL)
,('烏鴉 🐦',12,0,NULL,NULL)
,('定序王子 🤴',13,0,NULL,NULL)
,('九天聖人 🧝🏻‍♂️',14,0,NULL,NULL)
,('審判官 👩‍⚖️',15,0,NULL,NULL)
,('靈鹿 🦌',16,0,NULL,NULL)
,('狼人 🐺',1001,0,NULL,NULL)
,('狼王 🐺👑',1002,0,NULL,NULL)
,('狼美人 💋',1003,0,NULL,NULL)
,('夢魘 👻',1004,0,NULL,NULL)
,('機械狼 ⚙️🐺',1005,0,NULL,NULL)
,('石像鬼 🗿',1006,0,NULL,NULL)
,('狼兄 🐺👦🏻',1007,0,NULL,NULL)
,('狼弟 🐺👶🏻',1008,0,NULL,NULL)
,('血月使徒 🩸🌙',1009,0,NULL,NULL)
,('惡魔 😈',1010,0,NULL,NULL)
,('白狼王 🐺🗯',1011,0,NULL,NULL)
,('隱狼 🐐',1012,0,NULL,NULL)
,('蝕時狼妃 💃',1013,0,NULL,NULL)
,('帝尊魔皇 🧝🏿‍♂️',1014,0,NULL,NULL)
,('混沌之魔 👾',1015,0,NULL,NULL)
,('村民 👨‍🌾',2001,0,NULL,NULL)
,('混血兒 🎭',2002,0,NULL,NULL)
,('老流氓 👴',2003,0,NULL,NULL);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('001. 預女獵白','標準版型',true);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('001. 預女獵白', 1, 1, 3)
,('001. 預女獵白', 2, 1, 2)
,('001. 預女獵白', 3, 1, 4)
,('001. 預女獵白', 4, 1, 5)
,('001. 預女獵白', 1001, 4, 1)
,('001. 預女獵白', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('002. 預女獵白混','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('002. 預女獵白混', 1, 1, 3)
,('002. 預女獵白混', 2, 1, 2)
,('002. 預女獵白混', 3, 1, 4)
,('002. 預女獵白混', 4, 1, 5)
,('002. 預女獵白混', 1001, 4, 1)
,('002. 預女獵白混', 2001, 3, 99)
,('002. 預女獵白混', 2002, 1, 0);


INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('003. 狼王守衛','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('003. 狼王守衛', 1, 1, 3)
,('003. 狼王守衛', 2, 1, 2)
,('003. 狼王守衛', 3, 1, 4)
,('003. 狼王守衛', 5, 1, 0)
,('003. 狼王守衛', 1001, 3, 1)
,('003. 狼王守衛', 1002, 1, 1)
,('003. 狼王守衛', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('004. 狼王魔術師','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('004. 狼王魔術師', 1, 1, 3)
,('004. 狼王魔術師', 2, 1, 2)
,('004. 狼王魔術師', 3, 1, 4)
,('004. 狼王魔術師', 11, 1, 0)
,('004. 狼王魔術師', 1001, 3, 1)
,('004. 狼王魔術師', 1002, 1, 1)
,('004. 狼王魔術師', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('005. 狼王攝夢人','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('005. 狼王攝夢人', 1, 1, 3)
,('005. 狼王攝夢人', 2, 1, 2)
,('005. 狼王攝夢人', 3, 1, 4)
,('005. 狼王攝夢人', 10, 1, 0)
,('005. 狼王攝夢人', 1001, 3, 1)
,('005. 狼王攝夢人', 1002, 1, 1)
,('005. 狼王攝夢人', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('006. 狼美人騎士','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('006. 狼美人騎士', 1, 1, 4)
,('006. 狼美人騎士', 2, 1, 3)
,('006. 狼美人騎士', 6, 1, 5)
,('006. 狼美人騎士', 5, 1, 0)
,('006. 狼美人騎士', 1001, 3, 1)
,('006. 狼美人騎士', 1003, 1, 2)
,('006. 狼美人騎士', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('007. 狼美人老流氓','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('007. 狼美人老流氓', 1, 1, 4)
,('007. 狼美人老流氓', 2, 1, 3)
,('007. 狼美人老流氓', 4, 1, 5)
,('007. 狼美人老流氓', 5, 1, 0)
,('007. 狼美人老流氓', 1001, 3, 1)
,('007. 狼美人老流氓', 1003, 1, 2)
,('007. 狼美人老流氓', 2001, 3, 99)
,('007. 狼美人老流氓', 2003, 1, 98);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('008. 夢魘守衛','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('008. 夢魘守衛', 1, 1, 4)
,('008. 夢魘守衛', 2, 1, 3)
,('008. 夢魘守衛', 3, 1, 5)
,('008. 夢魘守衛', 5, 1, 0)
,('008. 夢魘守衛', 1001, 3, 2)
,('008. 夢魘守衛', 1004, 1, 1)
,('008. 夢魘守衛', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('009. 夢魘攝夢人','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('009. 夢魘攝夢人', 1, 1, 4)
,('009. 夢魘攝夢人', 2, 1, 3)
,('009. 夢魘攝夢人', 3, 1, 5)
,('009. 夢魘攝夢人', 10, 1, 0)
,('009. 夢魘攝夢人', 1001, 3, 2)
,('009. 夢魘攝夢人', 1004, 1, 1)
,('009. 夢魘攝夢人', 2001, 4, 99);


INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('010. 機械狼','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('010. 機械狼', 7, 1, 4)
,('010. 機械狼', 2, 1, 3)
,('010. 機械狼', 3, 1, 5)
,('010. 機械狼', 5, 1, 1)
,('010. 機械狼', 1001, 3, 2)
,('010. 機械狼', 1005, 1, 0)
,('010. 機械狼', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('011. 石像鬼守墓人','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('011. 石像鬼守墓人', 1, 1, 4)
,('011. 石像鬼守墓人', 2, 1, 3)
,('011. 石像鬼守墓人', 3, 1, 5)
,('011. 石像鬼守墓人', 8, 1, 1)
,('011. 石像鬼守墓人', 1001, 3, 2)
,('011. 石像鬼守墓人', 1006, 1, 0)
,('011. 石像鬼守墓人', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('012. 狼兄狼弟守衛','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('012. 狼兄狼弟守衛', 1, 1, 4)
,('012. 狼兄狼弟守衛', 2, 1, 3)
,('012. 狼兄狼弟守衛', 3, 1, 5)
,('012. 狼兄狼弟守衛', 5, 1, 0)
,('012. 狼兄狼弟守衛', 1001, 2, 2)
,('012. 狼兄狼弟守衛', 1007, 1, 1)
,('012. 狼兄狼弟守衛', 1008, 1, 1)
,('012. 狼兄狼弟守衛', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('013. 血月獵魔人','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('013. 血月獵魔人', 1, 1, 3)
,('013. 血月獵魔人', 2, 1, 2)
,('013. 血月獵魔人', 9, 1, 4)
,('013. 血月獵魔人', 4, 1, 5)
,('013. 血月獵魔人', 1001, 3, 1)
,('013. 血月獵魔人', 1009, 1, 1)
,('013. 血月獵魔人', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('014. 惡魔守衛','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('014. 惡魔守衛', 1, 1, 4)
,('014. 惡魔守衛', 2, 1, 3)
,('014. 惡魔守衛', 3, 1, 5)
,('014. 惡魔守衛', 5, 1, 0)
,('014. 惡魔守衛', 1001, 3, 1)
,('014. 惡魔守衛', 1010, 1, 2)
,('014. 惡魔守衛', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('015. 白狼王守衛','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('015. 白狼王守衛', 1, 1, 4)
,('015. 白狼王守衛', 2, 1, 3)
,('015. 白狼王守衛', 3, 1, 5)
,('015. 白狼王守衛', 5, 1, 0)
,('015. 白狼王守衛', 1001, 3, 1)
,('015. 白狼王守衛', 1011, 1, 1)
,('015. 白狼王守衛', 2001, 4, 99);


INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('016. 隱狼烏鴉 ','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('016. 隱狼烏鴉 ', 1, 1, 4)
,('016. 隱狼烏鴉 ', 2, 1, 3)
,('016. 隱狼烏鴉 ', 3, 1, 6)
,('016. 隱狼烏鴉 ', 12, 1, 5)
,('016. 隱狼烏鴉 ', 1001, 3, 1)
,('016. 隱狼烏鴉 ', 1012, 1, 0)
,('016. 隱狼烏鴉 ', 2001, 4, 99);


INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('017. 永序之輪','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('017. 永序之輪', 1, 1, 4)
,('017. 永序之輪', 2, 1, 3)
,('017. 永序之輪', 13, 1, 5)
,('017. 永序之輪', 5, 1, 1)
,('017. 永序之輪', 1001, 3, 2)
,('017. 永序之輪', 1013, 1, 0)
,('017. 永序之輪', 2001, 4, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('018. 帝尊魔皇九天聖人','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('018. 帝尊魔皇九天聖人', 1, 1, 4)
,('018. 帝尊魔皇九天聖人', 2, 1, 3)
,('018. 帝尊魔皇九天聖人', 3, 1, 5)
,('018. 帝尊魔皇九天聖人', 14, 1, 1)
,('018. 帝尊魔皇九天聖人', 1001, 3, 2)
,('018. 帝尊魔皇九天聖人', 1014, 1, 0)
,('018. 帝尊魔皇九天聖人', 2001, 4, 99);


INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('019. 混沌之魔審判官靈鹿','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('019. 混沌之魔審判官靈鹿', 1, 1, 2)
,('019. 混沌之魔審判官靈鹿', 16, 1, 3)
,('019. 混沌之魔審判官靈鹿', 3, 1, 5)
,('019. 混沌之魔審判官靈鹿', 15, 1, 4)
,('019. 混沌之魔審判官靈鹿', 1001, 3, 1)
,('019. 混沌之魔審判官靈鹿', 1015, 1, 0)
,('019. 混沌之魔審判官靈鹿', 2001, 4, 99);


INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('101. 預女獵 雙邊白痴 (11人局)','標準版型',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('101. 預女獵 雙邊白痴 (11人局)', 1, 1, 3)
,('101. 預女獵 雙邊白痴 (11人局)', 2, 1, 2)
,('101. 預女獵 雙邊白痴 (11人局)', 3, 1, 4)
,('101. 預女獵 雙邊白痴 (11人局)', 4, 1, 5)
,('101. 預女獵 雙邊白痴 (11人局)', 1001, 4, 1)
,('101. 預女獵 雙邊白痴 (11人局)', 2001, 3, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('102. 狼王守衛 雙邊守衛 (11人局)','',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('102. 狼王守衛 雙邊守衛 (11人局)', 1, 1, 3)
,('102. 狼王守衛 雙邊守衛 (11人局)', 2, 1, 2)
,('102. 狼王守衛 雙邊守衛 (11人局)', 3, 1, 4)
,('102. 狼王守衛 雙邊守衛 (11人局)', 5, 1, 0)
,('102. 狼王守衛 雙邊守衛 (11人局)', 1001, 3, 1)
,('102. 狼王守衛 雙邊守衛 (11人局)', 1002, 1, 1)
,('102. 狼王守衛 雙邊守衛 (11人局)', 2001, 3, 99);

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('201. 預女獵 (10人局)','標準版型',false);
INSERT INTO public.template_role ("name", roleid, "number", darkpriority) VALUES 
('201. 預女獵 (10人局)', 1, 1, 3)
,('201. 預女獵 (10人局)', 2, 1, 2)	
,('201. 預女獵 (10人局)', 3, 1, 4)
,('201. 預女獵 (10人局)', 1001, 3, 1)
,('201. 預女獵 (10人局)', 2001, 4, 99);

    
EOSQL
