import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";
import { Flow, Step } from "./FlowDB";



const entities = [Step, Flow]
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
            await getRepository(Flow).delete({})
            //console.log("DB ready!")

            resolve(conn)
        }).catch(error => {
            console.log(error)
        });
    })
    return connPromise

}
