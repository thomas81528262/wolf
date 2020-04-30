const Db = require("./db");
const WolfModel = require("./model")

const timeout = (ms) => new Promise((res)=>setTimeout(res,ms));


async function run() {
    await timeout(3000);
    //await WolfModel.generatePlayer()
    const result = await Db.insertTemplateHeader({description:'test'});
    console.log(result)
    //await WolfModel.generateRole();
    //Db.updateRoleNumber({number:10, id:1})
}


run();