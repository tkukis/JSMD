import { assignTask, Flow, start } from "."
import db from "../db"
import { AppUser, JSMD } from "../JSMD"
const jsmd: JSMD = {
    steps: [],
    elements:
        [
            {
                id: "a",
                type: "UserTask",
                assigneeType: { id: "a" }
            },
            {
                id: "b",
                type: "UserTask",
                assigneeType: { id: "a" }
            },
            {
                id: "c",
                type: "UserTask",
                assigneeType: { id: "c" }
            },
        ],
    connectors: [
        { start: "a", end: "b" },
        { start: "b", end: "c" },
    ]
}

const appUser: AppUser = {
    id: "tomas"
}
jest.setTimeout(60 * 1000)

describe("FlowDB", () => {
    test('start', async () => {
        await db()
        const result = <Flow>await start(jsmd, "test", appUser, "start", {})

        const step = await assignTask(result.id, { id: "tomas" }, 0, { id: "tomas" })


    })
})