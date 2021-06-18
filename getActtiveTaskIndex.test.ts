import { getActiveState, getTask, JSMD } from "./JSMD"

const jsmd: JSMD = {
    steps: [

    ],
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
const simpleConditionalJSMD: JSMD = {
    steps: [

    ],
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
        {
            start: "a", condition: "{{true}}", end: "c"
        },
        { start: "a", end: "b" },

        { start: "b", end: "c" },
    ]
}

const stateConditionalJSMD: JSMD = {
    steps: [

    ],
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
        {
            start: "c", condition: "{{it.state.c.action==='reject'}}", end: "a"
        },
        { start: "a", end: "b" },

        { start: "b", end: "c" },
    ]
}

describe("getTask", () => {
    test('init', async () => {
        //@ts-ignore
        const state = getActiveState(jsmd)
        expect(state.activeElement).toBe("a")
        expect(state.state).toStrictEqual({})
    })
    test('step b', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...jsmd, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" }
            ]
        })
        expect(state.activeElement).toBe("b")
        //   expect(state.state).toStrictEqual({})
    })
    test('step c', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...jsmd, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" }
            ]
        })
        expect(state.activeElement).toBe("c")
        //   expect(state.state).toStrictEqual({})
    })
    test('ended', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...jsmd, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" }
            ]
        })
        expect(state.activeElement).toBe(undefined)
        //   expect(state.state).toStrictEqual({})
    })
    test('simpleCondition', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...simpleConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },

            ]
        })
        expect(state.activeElement).toBe("c")
    })
    test('simpleCondition a', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...stateConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },

            ]
        })
        expect(state.activeElement).toBe("b")
    })
    test('simpleCondition c', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...stateConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },

            ]
        })
        expect(state.activeElement).toBe("c")
    })
    test('simpleCondition c', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...stateConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "reject", userId: "tomas", type: "submit" },

            ]
        })
        expect(state.activeElement).toBe("a")
    })
    test('simpleCondition c', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...stateConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "reject", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },

            ]
        })
        expect(state.activeElement).toBe("b")
    })
    test('simpleCondition c', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...stateConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "reject", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
            ]
        })
        expect(state.activeElement).toBe("c")
    })
    test('simpleCondition end', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...stateConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "reject", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
            ]
        })
        expect(state.activeElement).toBe(undefined)
    })

})