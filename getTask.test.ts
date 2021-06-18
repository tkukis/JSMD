import { getTask, JSMD } from "./JSMD"

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

describe("getTask", () => {
    test('start', async () => {
        //@ts-ignore
        expect(getTask(jsmd)?.id).toBe(0)

        expect(getTask({
            ...jsmd, steps: [
                { userId: 'tomas', type: 'assign', data: { id: "tomas" } }
            ]
            //@ts-ignore
        })?.id).toBe(0)
        return
        expect(getTask({
            ...jsmd, steps: [
                { userId: 'tomas', type: 'assign', data: { id: "tomas" } },
                { userId: 'tomas', type: 'submit', data: { some: "A" } }
            ]
            //@ts-ignore
        })?.id).toBe(1)
    })
})