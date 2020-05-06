const game = require("./game");



const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


async function run() {
    game.dark.start();

    console.log(game.dark.isStart)
    game.dark.start();
   
    game.dark.actionFunction({playerId:3})
    console.log(game.dark.wolfKillingList, 'killing list')
    game.dark.actionFunction({playerId:0})
    console.log(game.dark.wolfKillingList, 'killing list')
    await timeout(5000)
    console.log(game.dark.wolfKillingList, 'killing list')
    game.dark.actionFunction({playerId:0})
    await timeout(5000)
    game.dark.start();
    console.log(game.dark.wolfKillingList, 'killing list')
    game.dark.actionFunction({playerId:3})
}


run();