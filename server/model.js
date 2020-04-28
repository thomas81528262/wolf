const Db = require("./db");
const shuffle = require('shuffle-array');

class WolfModel {
  static async updateRoleNumber({ id, number }) {
    await Db.updateRoleNumber({ id, number });
  }

  static async updatePlayerName({ id, name }) {
    await Db.updatePlayerName({ id, name });
    return "pass";
  }

  static async getPlayerInfo({ id, pass }) {
    const result = await Db.getPlayerInfo({ id, pass });
    if (result.length === 1) {
      return result[0];
    }
    return {};
  }

  

  static async updatePlayerPass({ id, pass }) {

    const info = await this.getPlayerInfo({ id, pass });

    console.log(info.id)
    if (info.id !== null && info.id !== undefined) {
        return {isValid:true, ...info}
    }

    const result = await Db.updatePlayerPass({ id, pass });
    console.log(result)
    
    return result;
  }

  static async createPlayer({ totalNumber }) {
    await Db.removeAllPlayer();
    console.log(totalNumber)
    //0 is GOD dont touch
    for (let i = 0; i < totalNumber; i += 1) {
      await Db.addPlayer({ id: i + 1 });
    }
  }
  static async removeAllPlayer() {
      await Db.removeAllPlayer();
  }

  static async generateRole() {

    
    const result = await Db.getAllRole();
    

    const list = [];
    result.forEach((d) => {
      const { number, id } = d;
      if (number) {
        for (let i = 0; i < number; i+=1) {
            list.push(id);
        }
      }
    
    });

    shuffle(list);

    list.forEach((value, idx)=>{
        Db.updatePlayerRole({id:idx + 1, roleId:value})
    })
    

  }

  static async generatePlayer() {
    const result = await Db.getAllRole();

    let totalNumber = 0;
    result.forEach((d) => {
      const { number } = d;
      if (number) {
        totalNumber += number;
      }
    });
    

    this.createPlayer({ totalNumber });

    return "pass";
  }

  static async getPlayerList() {
    const result = await Db.getAllPlayer();
    return result;
  }

  static async getAllRole() {
    const result = await Db.getAllRole();
    return result;
  }
}

module.exports = WolfModel;
