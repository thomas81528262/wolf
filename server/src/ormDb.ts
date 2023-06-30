import { PrismaClient,  Prisma} from '@prisma/client'



export default class Db {
    #client
    constructor() {
        this.#client = new PrismaClient()
    }

    async enableTemplate({ name }:{name:string}) {
      await this.#client.$transaction(async (tx)=>{

        const disalbedTemplate = await tx.template_header.updateMany({data:{isenabled:false},where:{isenabled:true}});

        if (disalbedTemplate.count !==1) {
          console.warn('DB: Enabled template number error!', disalbedTemplate.count)
        }
        const enabledTemplate = await tx.template_header.updateMany({data:{isenabled:true}, where:{name}})
        if (enabledTemplate.count !==1) {
          throw new Error(`DB: enalbe template ${name} fail!`)
        }
      })
    }

    async updateTemplateRolePriority({ ids, name }:{ids:number[], name:string}) {
     
        
        await this.#client.$transaction(async (tx)=>{

          for (let i = 0; i < ids.length; i += 1) {
            const roleId = ids[i];
            await tx.template_role.update({data:{darkpriority:i}, where:{roleId_name:{roleId, name}}})
          }
        });
    }

    async getTemplate({select, where}:{select:Prisma.template_headerSelectScalar, where:Prisma.template_headerWhereInput}) {
        try {
          const result = await this.#client.template_header.findMany({orderBy:{name:'asc'}, select, where});
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

    async getTemplateRole({select, where}:{select:Prisma.template_roleSelectScalar, where:Prisma.template_roleWhereInput }){

      try {
        const result = await this.#client.template_role.findMany({select:{role:{select:{name:true}},...select}, where});
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
  const result = await db.getTemplate({select:{name:true, description:true}, where:{name:'013. 血月獵魔人'}});
  const re = await db.getTemplateRole({select:{ number:true, roleId:true}, where:{name:'013. 血月獵魔人'}})
  console.log(result, re);
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

