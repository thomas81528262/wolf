import { PrismaClient } from '@prisma/client'



export default class Db {
    #client
    constructor() {
        this.#client = new PrismaClient()
    }

    async getAllTemplate() {
        try {
          const result = await this.#client.template_header.findMany();
          return result;
        } catch (err) {
          if (err instanceof Error) {
            console.error(err.message);
          } else {
            console.log('Unexpected error', err);
          }
          return [];
        }
    }

    async $disconnect() {
        await this.#client.$disconnect();
    }
}

const db = new Db();

async function main() {
  
  const result = await db.getAllTemplate();
  console.log(result);
}

main()
  .then(async () => {
    await db.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await db.$disconnect()
    process.exit(1)
  })

