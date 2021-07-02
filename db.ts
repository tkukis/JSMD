import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { Flow, Step, Task } from "./FlowDB";
import { TAppUser, TFlow, TStep } from "./TypeFlow/models/TFlow";



const entities = [Step, Flow, Task, TFlow, TStep, TAppUser]
let connPromise
export default function () {
    if (connPromise) {
        return connPromise
    }
    connPromise = new Promise((resolve, reject) => {

        const conn = createConnection({
            type: "postgres",
            host: "localhost",
            port: 5421,
            username: "admin",
            password: "a010o8h84pk67510o8h",
            database: "postgres",
            synchronize: true,
            logging: false,
            entities
        }).then(async _ => {
            await getRepository(Step).delete({})
            await getRepository(Task).delete({})
            await getRepository(Flow).delete({})
            await getRepository(TStep).delete({})
            await getRepository(TFlow).delete({})
            const users = await getRepository(TAppUser).find()
            if (users.length === 0) {
                const Tomas = new TAppUser
                Tomas.id = "tomas"
                Tomas.permissions = ["admin"]
                const Jonas = new TAppUser
                Jonas.id = "jonas"
                Jonas.permissions = [""]
                await getRepository(TAppUser).save(Tomas)
                await getRepository(TAppUser).save(Jonas)
            }


            resolve(conn)
        }).catch(error => {
            console.log(error)
            reject(error)
        });
    })
    return connPromise

}
