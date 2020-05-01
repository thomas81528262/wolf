const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "floujtzjxxytbh",
  host: "ec2-52-202-146-43.compute-1.amazonaws.com",
  database: "d6lad3k4gi0rd1",
  password: "369e391e10e6990490436293d1f220372bc210b5e8aebcd6dd30fc8983d31844",
  port: 5432,
  ssl: {
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

 static async enableTemplate({  name }) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const queryCheckText = "SELECT name, description from public.template_header where name = $1";
    const result = await client.query(queryCheckText, [name]);
    if (result.rows.length !==1) {
      throw Error('Can not find template')
    }


    const queryTextDisabled = "update public.template_header set isenabled=false";
    await client.query(queryTextDisabled);
    const queryText = "update public.template_header set isenabled=true where name=$1"
    await client.query(queryText, [ name]);

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
      const text =
        "SELECT role.name as name, roleid as id, template_role.number from public.template_role left join public.role on roleId=role.id where template_role.name=$1 order by darkpriority";
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

  static async updateTemplateDescription({ name, description }) {
    try {
      console.log(name, description);
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

  static async getPlayerInfo({ id, pass }) {
    try {
      const text =
        'SELECT player.id, player."name", roleId, role.name as "roleName", player."isempty" as "isEmpty"  FROM public.player left join public.role on roleId=role.id where player.id =$1 and pass=$2;';
      const values = [id, pass];
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
  static async updatePlayerPass({ id, pass }) {
    try {
      const text =
        'update public.player set  "pass"=$1, isempty=false where id=$2 and isempty=true';
      const values = [pass, id];
      const result = await pool.query(text, values);
      return { isValid: result.rowCount > 0 ? true : false };
    } catch (err) {
      console.log(err.stack);
      return { isValid: false };
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
    try {
      const text = "insert into public.player (id, isempty) values($1,true)";
      const values = [id];
      await pool.query(text, values);
    } catch (err) {
      console.log(err.stack);
    }
  }

  static async getAllPlayer() {
    try {
      const text = `SELECT player.id, player."name", roleId, role.name as "roleName", player."isempty" as "isEmpty"
                    FROM public.player
                    left join public.role on roleId=role.id
                    order by player.id;
                    `;

      const result = await pool.query(text);
      return result.rows;
    } catch (err) {
      console.log(err.stack);
      return [];
    }
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
