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

  static async insertTemplateHeader({description}) {
    try {
      const text = "insert into public.template_header (description) values($1) RETURNING id";
      const values = [description];
      const result = await pool.query(text, values);
      
      if (result.rows.length > 0) {
        return result.rows[0].id
      }

      return null;

    } catch (err) {
      console.log(err.stack);
      return null;
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

  static async updatePlayerRole({id, roleId}) {
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
      const text = 'update public.player set  "pass"=$1, isempty=false where id=$2 and isempty=true';
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
      const text = 'SELECT "name", id, "number" FROM public."role" order by id;';

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
