import { assignTask, getTask, JSMD } from "./JSMD"

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
const user = { id: "tomas" }
describe("API", () => {
    test('start', async () => {
        //let flow = assignTask(jsmd, user.id, 0, user)
        //@ts-ignore
        //expect(getTask(flow).id).toBe(0)
        //@ts-ignore
        //expect(getTask(flow).assignee).toBe("tomas")
      //  flow = assignTask(flow, user.id, 0, { ...user, id: "petras" })
        //@ts-ignore
        //expect(getTask(flow).assignee).toBe("petras")

    })
})