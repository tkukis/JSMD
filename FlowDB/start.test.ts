import { start } from "."
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
        const result = await start(jsmd, appUser, "start", {})

    })
})