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

    async getTemplateRole({select, where}:{select:Prisma.template_roleSelect, where:Prisma.template_roleWhereInput }){

      try {
        const result = await this.#client.template_role.findMany({select, where});
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

    async deleteTemplate({where}:{where:Prisma.template_headerWhereUniqueInput}) {
      await this.#client.template_header.delete({where});
    }

    async upsertTemplate({where, update, create}:{create:Prisma.template_headerCreateInput,where:Prisma.template_headerWhereUniqueInput, update:Prisma.template_headerUpdateInput}) {
      await this.#client.template_header.upsert({where, update, create})
    }

    async createPlayers({num}:{num:number}) {
      await this.#client.$transaction(async (tx)=>{
        //id 0 is god
        tx.player.create({data:{id:0}})
        for(let i = 0; i < num; i+=1) {

          tx.player.create({data:{
            id:i +1,  
            isDie:false
          }})
        }
      });
    }

    async $disconnect() {
        await this.#client.$disconnect();
    }
}

const db = new Db();

async function main() {
  
  await db.enableTemplate({name:'019. 混沌之魔審判官靈鹿'})
  const result = await db.getTemplate({select:{name:true, description:true}, where:{}});
  const re = await db.getTemplateRole({select:{ number:true, roleId:true, role:{select:{name:true}}}, where:{name:'013. 血月獵魔人'}})
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

