import { PrismaClient } from '@prisma/client'



export default class Db {
    #client
    constructor() {
        this.#client = new PrismaClient()
    }

    async enableTemplate({ name }:{name:string}) {
      await this.#client.$transaction(async (tx)=>{

        const disalbedTemplate = await tx.template_header.updateMany({data:{isenabled:false},where:{}});

        if (disalbedTemplate.count !==1) {
          console.warn('DB: Enabled template number error!')
        }
        const enabledTemplate = await tx.template_header.updateMany({data:{isenabled:true}, where:{name}})
        if (enabledTemplate.count !==1) {
          throw new Error(`DB: enalbe template ${name} fail!`)
        }
      })
    }

    async getAllTemplate() {
        try {
          const result = await this.#client.template_header.findMany({orderBy:{name:'asc'}});
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
  await db.enableTemplate({name:'019. 混沌之魔審判官靈鹿'})
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

