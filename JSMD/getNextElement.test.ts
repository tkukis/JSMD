import { getActiveState, getNextElement, getTask, JSMD } from "."

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

describe.only("getNextElement", () => {
    test('start', async () => {
        expect(getNextElement({}, [{ start: "a", end: "b" }], "a")).toBe("b")
        expect(getNextElement({}, [{ start: "a", end: "b" }], "b")).toBe(undefined)
        expect(getNextElement({}, [
            { start: "a", end: "b" },
            {
                start: "a", end: "c", condition: "{{true}}"
            }
        ], "c")).toBe(undefined)
        expect(getNextElement({ a: { b: 100 } }, [
            { start: "a", end: "b" },
            {
                start: "a", end: "c", condition: "{{it.state.a.b===100}}"
            }
        ], "c")).toBe(undefined)
    })
})