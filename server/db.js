const { Pool, Client } = require("pg");
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "dev"
      ? false
      : {
          rejectUnauthorized: false,
        },
});

class Db {
  /*
  INSERT INTO test_table (author, name, price) VALUES ('George Orwell', '1984', 400);
ON CONFLICT (author, name)
  DO UPDATE SET
   price = EXCLUDED.price;
  */

  static async enableTemplate({ name }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      const queryCheckText =
        "SELECT name, description from public.template_header where name = $1";
      const result = await client.query(queryCheckText, [name]);
      if (result.rows.length !== 1) {
        throw Error("Can not find template");
      }

      const queryTextDisabled =
        "update public.template_header set isenabled=false";
      await client.query(queryTextDisabled);
      const queryText =
        "update public.template_header set isenabled=true where name=$1";
      await client.query(queryText, [name]);

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async updateTemplateRolePriority({ ids, name }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      for (let i = 0; i < ids.length; i += 1) {
        const value = ids[i];
        const queryText =
          "update public.template_role set darkpriority=$1 where name=$2 and roleid=$3";

        await client.query(queryText, [i, name, value]);
      }
      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async getEnabledTemplate() {
    try {
      const text = `SELECT name, description, isenabled as "isEnabled" from public.template_header where isenabled=true`;

      const result = await pool.query(text);

      if (result.rows.length === 1) {
        return result.rows[0];
      }

      return {};
    } catch (err) {
      console.log(err.stack);
      return {};
    }
  }

  static async getAllTemplate() {
    try {
      const text = `SELECT name, description, isenabled as "isEnabled" from public.template_header order by name`;

      const result = await pool.query(text);
      return result.rows;
    } catch (err) {
      console.log(err.stack);
      return [];
    }
  }

  static async getTemplateDescription({ name }) {
    try {
      const text =
        "SELECT name, description from public.template_header where name = $1";
      const values = [name];
      const result = await pool.query(text, values);

      if (result.rows.length === 1) {
        return result.rows[0].description;
      }

      return null;
    } catch (err) {
      console.log(err.stack);
      return null;
    }
  }

  static async getAllTemplateRole({ name }) {
    try {
      const text = `SELECT role.name as name,role.camp, roleid as id, template_role.number, role.functionname as "functionName" from public.template_role left join public.role on roleId=role.id where template_role.name=$1 order by darkpriority`;
      const values = [name];
      const result = await pool.query(text, values);
      return result.rows;
    } catch (err) {
      console.log(err.stack);
      return [];
    }
  }

  static async upsertTemplateRole({ name, roleId, number }) {
    try {
      const text = `insert into public.template_role (name,roleid, number, darkpriority) values($1, $2, $3, 9999)
                    ON CONFLICT (name, roleid) DO UPDATE SET number = EXCLUDED.number;
      `;
      const values = [name, roleId, number];
      await pool.query(text, values);
      return "pass";
    } catch (err) {
      console.log(err.stack);
      return "pass";
    }
  }

  static async insertTemplateHeader({ name }) {
    if (!name) {
      throw Error("The template name is Empty!!!");
    }

    try {
      const text = `insert into public.template_header (name) values($1)`;
      const values = [name];
      await pool.query(text, values);
      return "pass";
    } catch (err) {
      console.log(err.stack);
      return "pass";
    }
  }

  static async deleteTemplateHeader({ name }) {
    /*
    if (!name) {
      throw Error("The template name is Empty!!!")
    }
    */

    try {
      const text = `delete from public.template_header where name=$1`;
      const values = [name];
      await pool.query(text, values);
      return "pass";
    } catch (err) {
      console.log(err.stack);
      return "pass";
    }
  }

  static async updateTemplateDescription({ name, description }) {
    try {
      //console.log(name, description);
      const text = `update public.template_header set description=$1 where name=$2`;
      const values = [description, name];
      await pool.query(text, values);
      return "pass";
    } catch (err) {
      console.log(err.stack);
      return "pass";
    }
  }

  static async upsertTemplateHeader({ name, description }) {
    try {
      const text = `insert into public.template_header (name,description) values($1, $2)
                    ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;
      `;
      const values = [name, description];
      await pool.query(text, values);
      return "pass";
    } catch (err) {
      console.log(err.stack);
      return "pass";
    }
  }

  static async getVoteHistory() {
    const result = await pool.query(`
    
    SELECT id, "name", history_id, target
    FROM public.vote_history  order by history_id;
    
    `);
    return result.rows;
  }

  static async resetEvent() {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      await client.query(`update public.player set  "votetarget"=null`);
      await client.query(
        `
            UPDATE game_event
            SET repeat_times=0, "name"= null, is_busy=false
            WHERE "type"='VOTE';
            `
      );
      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async endVoteEvent({ target, id }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");
      let repeatTimes = 0;
      const currentEvent = await client.query(
        `select name, repeat_times as "repeatTimes" from game_event where type='VOTE'`
      );

      if (currentEvent.rowCount === 0) {
        throw Error("No Vote Event!");
      }

      const eventName = currentEvent.rows[0].name;
      repeatTimes = currentEvent.rows[0].repeatTimes;
      const playersResult = await client.query(`
    select
      id,
      "name",
      roleid,
      pass,
      adminpass,
      isempty,
      ischiefcandidate,
      ischiefdropout,
      isdie as "isDie",
      votetarget as "voteTarget",
      ischief as "isChief"
    from
      public.player
    order by id  
      ;
      
      `);

      const players = playersResult.rows;

      const idCountMap = new Map();

      let isVoteComplete = true;

      for (let i = 0; i < players.length; i += 1) {
        if (i == 0) {
          continue;
        }

        const player = players[i];

        let targetId = parseInt(player.voteTarget);

        if (player.id === id) {
          targetId = parseInt(target);

          if (!isNaN(targetId) && targetId !== -1) {
            let isValidTarget = false;

            if (
              (players[targetId] &&
                players[targetId].voteTarget === "T" &&
                eventName === "CHIEF_VOTE") ||
              (players[targetId].isDie !== true && eventName === "EXILE_VOTE")
            ) {
              isValidTarget = true;
            }

            if (!isValidTarget) {
              throw new Error("Not a valid target!");
            }
          }

          const updateResult = !isNaN(targetId) && targetId > 0 ? target : "X";
          await client.query(
            `update public.player set  "votetarget"=$1 where id =$2 and votetarget is NULL`,
            [updateResult, player.id]
          );

          player.voteTarget = updateResult;
        }

        if (player.voteTarget === null) {
          isVoteComplete = false;
        }

        if (!isNaN(targetId) && targetId > 0) {
          let count = 1;

          if (player.isChief) {
            count += 0.5;
          }

          if (idCountMap.has(targetId) && targetId > 0) {
            idCountMap.set(targetId, idCountMap.get(targetId) + count);
          } else {
            idCountMap.set(targetId, count);
          }
        }
      }

      if (isVoteComplete) {
        let maxNumber = -1;

        idCountMap.forEach((value, id) => {
          if (value > maxNumber) {
            maxNumber = value;
          }
        });

        let maxNumberCount = 0;
        let targetId = -1;
        let targetList = [];
        idCountMap.forEach((value, id) => {
          if (value === maxNumber) {
            maxNumberCount += 1;
            targetId = id;
            targetList.push(id);
          }
        });

        if (eventName === "CHIEF_VOTE" && repeatTimes === 2) {
          targetList = [0];
          targetId = 0;
        }

        if (targetList.length === 1) {
          if (eventName === "EXILE_VOTE") {
            await client.query(
              `update public.player set  "isdie"=true where id =$1`,
              [targetId]
            );
            await client.query(
              `
              UPDATE game_event
              SET repeat_times=0, "name"= null, is_busy=false, is_dark=true
              WHERE "type"='VOTE';
              `
            );
          } else if (eventName === "CHIEF_VOTE") {
            await client.query(`update public.player set  "ischief"=false `);
            await client.query(
              `update public.player set  "ischief"=true where id =$1`,
              [targetId]
            );
            await client.query(
              `
              UPDATE game_event
              SET repeat_times=0, "name"= null, is_busy=false
              WHERE "type"='VOTE';
              `
            );
          }
          await client.query(`update public.player set  "votetarget"=null`);
        } else {
          if (eventName === "EXILE_VOTE") {
            await client.query(`update public.player set  "votetarget"=null`);
            await client.query(
              `
            UPDATE game_event
            SET repeat_times=0, "name"= null, is_busy=false, is_dark=true
            WHERE "type"='VOTE';
            `
            );
          } else if (eventName === "CHIEF_VOTE") {
            await client.query(`update public.player set  "votetarget"=null`);

            for (let i = 0; i < targetList.length; i += 1) {
              await client.query(
                `update public.player set  "votetarget"='T' where id=$1`,
                [targetList[i]]
              );
            }

            await client.query(
              `
              UPDATE game_event
              SET repeat_times=repeat_times+1, is_busy =false
              WHERE name=$1
              `,
              [eventName]
            );
          }
        }

        for (let i = 0; i < players.length; i += 1) {
          const player = players[i];
          if (player.id === 0) {
            continue;
          }

          await client.query(
            `
            insert
            into
            vote_history (id,
            "name",
            target)
          values($1,
          $2,
          $3);
            `,
            [player.id, eventName, player.voteTarget]
          );
        }
      }

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async startChiefVote() {
    const eventName = "CHIEF_VOTE";
    const type = "VOTE";

    if (!eventName || !type) {
      throw Error("The event name or type is Empty!!!");
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updateResult = await client.query(
        `
        UPDATE game_event
        SET repeat_times=0, "name"=$1, is_busy=true
        WHERE "type"='VOTE' and name is NULL;
        `,
        [eventName]
      );

      if (updateResult.rowCount === 0) {
        const updateBusyResult = await client.query(
          `
          UPDATE game_event
          SET is_busy = true
          WHERE "type"='VOTE' and name = $1 and is_busy = false;
          `,
          [eventName]
        );

        if (updateBusyResult.rowCount !== 1) {
          throw new Error("The Event is busy!");
        }
      } else {
        await client.query(`update public.player set  "votetarget"=null`);
      }

      const evnetResult = await client.query(`
      SELECT "type", repeat_times as "repeatTimes", "name", is_busy 
FROM public.game_event where name='CHIEF_VOTE';
        
        `);

      if (evnetResult.rowCount === 0) {
        throw new Error("can not find event");
      }

      const { repeatTimes } = evnetResult.rows[0];

      const playersResult = await client.query(`
      select
        id,
        "name",
        roleid,
        pass,
        adminpass,
        isempty,
        ischiefcandidate as "isChiefCandidate",
        ischiefdropout as "isChiefDropout",
        isdie as "isDie",
        votetarget as "voteTarget"
      from
        public.player
      order by id;
        `);

      let isValidVote = true;

      for (let i = 0; i < playersResult.rows.length; i += 1) {
        if (i === 0) {
          continue;
        }

        const player = playersResult.rows[i];
        const { isChiefCandidate, isChiefDropout, isDie } = player;

        if (isChiefCandidate === null && !isDie) {
          isValidVote = false;
        }

        let voteTarget = null;
        if (repeatTimes > 0) {
          if (isDie) {
            voteTarget = "D";
          } else if (player.voteTarget === "T") {
            voteTarget = "T";
          }
        } else {
          if (isDie) {
            voteTarget = "D";
          } else if (isChiefCandidate === true && isChiefDropout === true) {
            if (repeatTimes === 0) {
              voteTarget = "DO";
            } else {
              voteTarget = null;
            }
          } else if (isChiefCandidate && isChiefDropout === false) {
            voteTarget = "T";
          } else if (isChiefCandidate === false) {
            voteTarget = null;
          }
        }

        await client.query(
          `update public.player set  "votetarget"=$1 where id =$2`,
          [voteTarget, i]
        );
      }

      if (!isValidVote) {
        throw new Error("Not all player is ready!");
      }

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async startExileVote() {
    const eventName = "EXILE_VOTE";
    const type = "VOTE";

    if (!eventName || !type) {
      throw Error("The event name or type is Empty!!!");
    }

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const updateResult = await client.query(
        `
        UPDATE game_event
        SET repeat_times=0, "name"=$1, is_busy=true
        WHERE "type"='VOTE' and name is NULL;
        `,
        [eventName]
      );

      if (updateResult.rowCount === 0) {
        const updateBusyResult = await client.query(
          `
          UPDATE game_event
          SET is_busy = true
          WHERE "type"='VOTE' and name = $1 and is_busy = false;
          `,
          [eventName]
        );

        if (updateBusyResult.rowCount !== 1) {
          throw new Error("The Event is busy!");
        }
      }

      const evnetResult = await client.query(
        `
      SELECT "type", repeat_times as "repeatTimes", "name", is_busy 
FROM public.game_event where name=$1;
        
        `,
        [eventName]
      );

      if (evnetResult.length === 0) {
        throw new Error("can not find event");
      }

      const { repeatTimes } = evnetResult.rows[0];

      const playersResult = await client.query(`
      select
        id,
        "name",
        roleid,
        pass,
        adminpass,
        isempty,
        ischiefcandidate as "isChiefCandidate",
        ischiefdropout as "isChiefDropout",
        isdie as "isDie",
        votetarget as "voteTarget"
      from
        public.player
      order by id;
        `);

      for (let i = 0; i < playersResult.rows.length; i += 1) {
        const player = playersResult.rows[i];
        const { isDie } = player;
        if (i === 0) {
          continue;
        }

        let voteTarget = null;

        if (isDie) {
          voteTarget = "D";
        }

        await client.query(
          `update public.player set  "votetarget"=$1 where id =$2`,
          [voteTarget, i]
        );
      }

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async getVoteEvent() {
    const text = `select
        "type",
        repeat_times as "repeatTimes",
        "name",
        is_busy as "isBusy",
        is_dark as "isDark"
      from
        public.game_event where "type"='VOTE';`;

    const result = await pool.query(text);

    return result.rows;
  }

  static async getPlayerInfo({ id, pass }) {
    try {
      const text = `SELECT 
          player.id, player."name", roleId, role.name as "roleName", player."isempty" as "isEmpty", player.adminPass as "adminPass"  
        FROM 
          public.player left join public.role on roleId=role.id 
        where 
          player.id =$1 and (pass=$2 or adminPass=$2);`;
      const values = [id, pass];
      const result = await pool.query(text, values);

      return result.rows;
    } catch (err) {
      console.log(err.stack);
      return [];
    }
  }

  static async getPlayerIdInfo({ id }) {
    try {
      const text =
        'SELECT player.id, player."name", roleId, role.name as "roleName", player."isempty" as "isEmpty"  FROM public.player left join public.role on roleId=role.id where player.id =$1;';
      const values = [id];
      const result = await pool.query(text, values);

      return result.rows;
    } catch (err) {
      console.log(err.stack);
      return [];
    }
  }

  static async updatePlayerName({ id, name }) {
    try {
      const text = 'update public.player set  "name"=$1 where id=$2';
      const values = [name, id];
      const result = await pool.query(text, values);
      return { isValid: result.rowCount > 0 ? true : false };
    } catch (err) {
      console.log(err.stack);
      return { isValid: false };
    }
  }

  static async togglePlayerDieStatus({ id }) {
    const text = 'update public.player set  "isdie"=not "isdie" where id=$1';
    const values = [id];
    await pool.query(text, values);
  }

  static async setDarkDieStatus({ targets }) {
    const client = await pool.connect();

    try {
      for (let i = 0; i < targets.length; i += 1) {
        const id = targets[i];
        await client.query(
          `update public.player set  "isdie"=true where id=$1`,
          [id]
        );
      }

      await client.query(
        `
        UPDATE game_event
        SET is_dark=false
        WHERE "type"='VOTE';
        `
      );

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async resetGame() {
    const client = await pool.connect();

    try {
      await client.query(
        `update
        public.player
      set
        "isdie" = false,
        "ischiefcandidate" = null,
        "ischiefdropout" = false,
        votetarget = null,
        ischief = false`
      );

      await client.query(
        `
        UPDATE game_event
        SET 
        is_dark=false,
        name = null,
        is_busy=false,
        repeat_times = 0

        WHERE "type"='VOTE';
        `
      );

      await client.query("delete from public.vote_history");

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async updatePlayerRole({ id, roleId }) {
    try {
      const text = 'update public.player set  "roleid"=$1 where id=$2';
      const values = [roleId, id];
      const result = await pool.query(text, values);
      return { isValid: result.rowCount > 0 ? true : false };
    } catch (err) {
      console.log(err.stack);
      return { isValid: false };
    }
  }

  static async updateRoleNumber({ number, id }) {
    try {
      const text = 'update public."role" set  "number"=$1 where id=$2';
      const values = [number, id];
      await pool.query(text, values);
    } catch (err) {
      console.log(err.stack);
    }
  }

  static async updateChiefCandidate({ isCandidate, isDropout, id }) {
    let pId = 1;
    const qValues = [];
    const values = [];

    if (isCandidate !== undefined) {
      qValues.push(`"ischiefcandidate"=$${pId}`);
      values.push(isCandidate);
      pId += 1;
    }

    if (isCandidate !== undefined) {
      qValues.push(`"ischiefdropout"=$${pId}`);
      values.push(isDropout);
      pId += 1;
    }

    values.push(id);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const evnetResult = await client.query(
        `
      SELECT "type", repeat_times as "repeatTimes", "name", is_busy FROM public.game_event WHERE is_busy = true;
        `
      );

      if (evnetResult.rowCount > 0) {
        throw new Error("The Candidate is in the event!");
      }

      const text = `update public.player set ${qValues.join(
        ","
      )}  where id=$${pId};`;

      await client.query(text, values);
      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  //only update the column if the value is null
  static async updateIsChiefCandidate({ isCandidate, id }) {
    let pId = 1;
    const qValues = [];
    const values = [];

    if (isCandidate !== undefined) {
      qValues.push(`"ischiefcandidate"=$${pId}`);
      values.push(isCandidate);
      pId += 1;
    }

    qValues.push(`"ischiefdropout"=$${pId}`);
    values.push(false);
    pId += 1;

    values.push(id);

    const text = `update public.player set ${qValues.join(
      ","
    )}  where id=$${pId} and ischiefcandidate IS NULL;`;

    await pool.query(text, values);
  }

  static async updateIsChiefCandidateDropout({ id, isDropout }) {
    let pId = 1;
    const qValues = [];
    const values = [];

    qValues.push(`"ischiefdropout"=$${pId}`);
    values.push(isDropout);
    pId += 1;

    values.push(id);

    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const evnetResult = await client.query(
        `
      SELECT "type", repeat_times as "repeatTimes", "name", is_busy FROM public.game_event WHERE is_busy = true;
        `
      );

      if (evnetResult.rowCount > 0) {
        throw new Error("The Candidate is in the event!");
      }

      const text = `update public.player set ${qValues.join(
        ","
      )}  where id=$${pId} and ischiefcandidate=true;`;

      await client.query(text, values);
      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async updatePass({ id, pass }) {
    const text = 'update public.player set  "pass"=$1 where id=$2 ';
    const values = [pass, id];
    await pool.query(text, values);
  }
  static async updatePlayerPass({ id, pass }) {
    try {
      const text =
        'update public.player set  "pass"=$1, isempty=false, isJoin=true where id=$2 and isempty=true';
      const values = [pass, id];
      const result = await pool.query(text, values);
      return { isValid: result.rowCount > 0 ? true : false };
    } catch (err) {
      console.log(err.stack);
      return { isValid: false };
    }
  }

  static async updateIsChief({ id }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        "update public.player set  ischief= false where id <> $1",
        [id]
      );

      await client.query(
        "update public.player set  ischief= not ischief where id=$1;",
        [id]
      );

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async updateIsDie({ id }) {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      await client.query(
        "update public.player set  isdie= not isdie where id=$1;",
        [id]
      );

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async removeAllPlayer() {
    try {
      const text = "delete from public.player where id > 0";
      await pool.query(text);
    } catch (err) {
      console.log(err.stack);
    }
  }

  static async addPlayer({ id }) {
    const client = await pool.connect();

    try {
      const values = [id];
      await client.query("BEGIN");
      await pool.query(
        `insert into public.player (id, isempty, isdie) values($1,true,false)`,
        values
      );

      await client.query("COMMIT");
    } catch (e) {
      console.log(e);
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  }

  static async getAllPlayer() {
    const text = `
select
  player.votetarget as "voteTarget",
  player.pass,
	player.id,
	player."name",
	roleId,
	role.name as "roleName",
	player."isempty" as "isEmpty",
	player.adminPass as "adminPass",
  player.ischiefcandidate as "isChiefCandidate", 
  player.ischiefdropout as "isChiefDropout",
  player.isdie as "isDie",
  player.ischief as "isChief" 
from
	public.player
left join public.role on
	roleId = role.id
order by player.id;                 
                    `;

    const result = await pool.query(text);
    return result.rows;
  }

  static async getAllRole() {
    try {
      const text =
        'SELECT "name", id, "number" FROM public."role" order by id;';

      const result = await pool.query(text);
      return result.rows;
    } catch (err) {
      console.log(err.stack);
      return [];
    }
  }

  static async updatePlayerName({ id, name }) {
    try {
      const text = 'update public.player set  "name"=$1 where id=$2';
      const values = [name, id];
      await pool.query(text, values);
    } catch (err) {
      console.log(err.stack);
    }
  }

  static async updatePlayerRole({ id, roleId }) {
    try {
      const text = 'update public.player set  "roleid"=$1 where id=$2';
      const values = [roleId, id];
      await pool.query(text, values);
    } catch (err) {
      console.log(err.stack);
    }
  }
}

module.exports = Db;
