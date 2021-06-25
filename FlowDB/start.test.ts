import { getRepository } from "typeorm"
import { assignTask, Flow, start, submitTask, Task } from "."
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
        let tasks = await getRepository(Task).find({ where: { flow: { id: result.id } } })
        expect(tasks.length).toBe(1)
        expect(tasks[0].completedState).toBe(null)
        let step = await assignTask(result.id, { id: "tomas" }, 0, { id: "tomas" })
        expect(typeof step).toBe("string")
        expect((await getRepository(Task).find()).length > 0).toBe(true)
        tasks = await getRepository(Task).find({ where: { flow: { id: result.id } } })
        expect(tasks.length).toBe(1)
        step = await assignTask(result.id, { id: "tomas" }, 1, { id: "tomas" })

        expect(typeof step === "string").toBe(false)
        tasks = await getRepository(Task).find({ where: { flow: { id: result.id } } })
        expect(tasks.length).toBe(1)
        expect(tasks[0].assigneeId).toBe("tomas")
        let submittedResult = await submitTask(result.id, "neTomas", 1, {}, "submit")
        expect(typeof submittedResult).toBe("string")
        submittedResult = await submitTask(result.id, "tomas", 0, {}, "submit")
        expect(typeof submittedResult).toBe("string")
        submittedResult = await submitTask(result.id, "tomas", 1, {}, "submit")
        expect(typeof submittedResult).not.toBe("string")
        tasks = await getRepository(Task).find({ where: { flow: { id: result.id } } })
        expect(tasks.length).toBe(2)
        expect(tasks[0].completedState).not.toBe(null)
    })
})