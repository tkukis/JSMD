import "reflect-metadata";
import { createConnection, getRepository } from "typeorm";


const itsTest = process.env.NODE_ENV === "test"
const entities = []
let connPromise
export default function () {
    if (connPromise) {
        return connPromise
    }
    connPromise = new Promise((resolve, reject) => {

        const conn = createConnection({
            type: "postgres",
            host: "localhost",
            port: itsTest ? 5419 : 5419,
            username: "admin",
            password: "a010o8h84pk67510o8h",
            database: "postgres",
            synchronize: true,
            logging: false,
            entities
        }).then(async _ => {

            console.log("DB ready!")

            resolve(conn)
        }).catch(error => {
            console.log(error)
        });
    })
    return connPromise

}
