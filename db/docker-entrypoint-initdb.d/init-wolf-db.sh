#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE TABLE player (
	id int4 NOT NULL,
	"name" varchar NULL,
	roleid int4 NULL,
	pass varchar NULL,
	adminPass varchar NULL,
	isempty bool NULL,
	CONSTRAINT player_pk PRIMARY KEY (id),
	CONSTRAINT player_un UNIQUE ("name")
);

CREATE TABLE "role" (
	"name" varchar NULL,
	id int4 NULL,
	"number" int4 NULL,
	functionname varchar NULL,
	camp varchar NULL
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

INSERT INTO public.player (id,"name",roleid,pass,isempty) VALUES 
(0,'Peggy',0,'123',NULL)
,(1,'Yao',2,'1213',false)
,(2,'Wemy',2,'1qaz',false)
,(4,'shumao',1,'shumao',false)
,(3,'thomas',3,'12345',false)
,(11,'jun',1,'111',false)
,(12,'昱安',7,'cmsa',false)
,(6,'fish',5,'fish',false)
,(5,'Chang Liu',2,'test',false)
,(9,'chengyi',14,'a811206',false)
;

UPDATE public.player set adminPass='1237' where id = 0;

INSERT INTO public.player (id,"name",roleid,pass,isempty) VALUES 
(8,'Herman',15,'888888',false)
,(7,'Jayden',1,'yaocute',false)
,(10,'書豪',2,'peggyno1',false)
;

INSERT INTO public."role" ("name",id,"number",functionname,camp) VALUES 
('機械狼 ⚙️🐺',10,0,NULL,NULL)
,('狼王 🐺👑',4,0,NULL,NULL)
,('夢魘 👻',11,0,NULL,NULL)
,('通靈師 👁',13,0,NULL,NULL)
,('God 😇',0,0,NULL,NULL)
,('白痴 🙃',12,0,NULL,NULL)
,('守墓人⚰️',14,0,NULL,NULL)
,('石像鬼 🗿',15,0,NULL,NULL)
,('狼人 🐺',1,2,'wolf','壞人')
,('狼兄 🐺👦🏻',8,1,NULL,'壞人')
;
INSERT INTO public."role" ("name",id,"number",functionname,camp) VALUES 
('狼弟 🐺👶🏻',9,1,NULL,'壞人')
,('女巫 🧪🧪',5,1,'witch','好人')
,('預言家 🔮',7,1,'prophet','好人')
,('獵人 🏹',3,0,'hunter','好人')
,('守衛 🛡',6,1,'guard','好人')
,('村民 👨‍🌾',2,4,NULL,'好人')
,('狼美人  🐺👩',16,0,'',NULL)
,('老流氓 👴',17,0,'',NULL)
;

INSERT INTO public.template_header ("name",description,isenabled) VALUES 
('12人守墓局',NULL,false)
,('九人局','女巫不自救 狼人不連刀
獵人自行選擇是否開槍
',false)
,('簡單十人團',NULL,false)
,('時間旅行','女巫不自救 守衛不連守 同守同救失效
狼人可連刀 狼王不自爆
狼王獵人自行選擇是否開槍',false)
,('狼人測試',NULL,false)
,('十二人通靈師機械狼局','機械狼第一晚可向一位玩家模仿 之後成為該名角色 功能於第二晚開始使用
機械通靈師：與通靈師相同，可知道一名玩家準確身份
機械女巫：可使用一瓶毒藥
機械守衛：每晚可守護一名玩家，該名玩家該晚不會被毒不會被槍，不可連守
機械獵人：死後可帶走一名玩家，被毒死無法使用技能
機械小狼：在其他三名玩家死後當晚可雙刀，之後為單刀
機械平民：無任何技能

當其他三名狼人皆死亡時 機械狼每晚擁有單刀（若模仿的為小狼，該晚為雙刀）

機械狼被通靈師查驗 結果為其模仿對象

通靈師可查驗玩家準確身份
女巫不自救 守衛不連守 同守同救失效
狼人可連刀 
獵人自行選擇是否開槍
',false)
,('十二人守衛狼王局','女巫不自救 守衛不連守 同守同救失效
狼人可連刀 狼王不自爆
狼王獵人自行選擇是否開槍
',false)
,('老流氓局','狼美人和狼隊共同睜眼 每晚連結一名玩家 不可連續兩晚連結同一名玩家 若狼美人出局則連結的對象同時出局 被毒時連結的人亦出局 若帶走獵人 獵人無法開槍 女巫不自救 守衛不連守 同守同救失效 狼人可連刀  獵人自行選擇是否開槍',false)
,('基本模式測試',NULL,true)
;

INSERT INTO public.template_role (roleid,"number","name",darkpriority) VALUES 
(5,1,'九人局',1)
,(1,3,'時間旅行',0)
,(7,1,'時間旅行',1)
,(6,1,'時間旅行',2)
,(5,1,'時間旅行',3)
,(3,1,'時間旅行',4)
,(2,4,'時間旅行',5)
,(4,1,'時間旅行',6)
,(1,3,'十二人通靈師機械狼局',0)
,(6,1,'十二人通靈師機械狼局',1)
;
INSERT INTO public.template_role (roleid,"number","name",darkpriority) VALUES 
(1,3,'十二人守衛狼王局',0)
,(5,1,'十二人守衛狼王局',1)
,(7,1,'十二人守衛狼王局',2)
,(6,1,'十二人守衛狼王局',3)
,(3,1,'十二人守衛狼王局',4)
,(2,4,'十二人守衛狼王局',5)
,(4,1,'十二人守衛狼王局',6)
,(5,1,'十二人通靈師機械狼局',2)
,(1,3,'九人局',0)
,(10,1,'十二人通靈師機械狼局',3)
;
INSERT INTO public.template_role (roleid,"number","name",darkpriority) VALUES 
(7,1,'九人局',2)
,(3,1,'九人局',3)
,(2,3,'九人局',4)
,(3,1,'十二人通靈師機械狼局',4)
,(12,1,'簡單十人團',9999)
,(1,3,'簡單十人團',9999)
,(4,1,'簡單十人團',9999)
,(13,1,'十二人通靈師機械狼局',5)
,(2,4,'十二人通靈師機械狼局',6)
,(1,4,'狼人測試',0)
;
INSERT INTO public.template_role (roleid,"number","name",darkpriority) VALUES 
(14,1,'12人守墓局',0)
,(15,1,'12人守墓局',1)
,(1,3,'12人守墓局',2)
,(5,1,'12人守墓局',3)
,(7,1,'12人守墓局',4)
,(3,1,'12人守墓局',5)
,(2,4,'12人守墓局',6)
,(1,3,'老流氓局',0)
,(16,1,'老流氓局',1)
,(7,1,'老流氓局',2)
;
INSERT INTO public.template_role (roleid,"number","name",darkpriority) VALUES 
(6,1,'老流氓局',3)
,(5,1,'老流氓局',4)
,(3,1,'老流氓局',5)
,(17,1,'老流氓局',6)
,(2,3,'老流氓局',7)
,(5,1,'基本模式測試',1)
,(7,1,'基本模式測試',2)
,(6,1,'基本模式測試',3)
,(2,1,'基本模式測試',4)
,(3,1,'基本模式測試',5)
;
INSERT INTO public.template_role (roleid,"number","name",darkpriority) VALUES 
(1,2,'基本模式測試',0)
;
    
EOSQL