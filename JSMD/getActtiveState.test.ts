import { getActiveState, getTask, JSMD } from "."

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
                flowStatus: "review",
                assigneeType: { id: "a" }
            },
            {
                id: "c",
                flowStatus: "review2",
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
        expect(state.activeElementId).toBe("a")
        expect(state.status).toBe("draft")
        expect(state.state).toStrictEqual({})
    })
    test('step b', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...jsmd, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" }
            ]
        })
        expect(state.activeElementId).toBe("b")
        expect(state.status).toBe("review")
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
        expect(state.activeElementId).toBe("c")
        expect(state.status).toBe("review2")
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
        expect(state.activeElementId).toBe(undefined)
        expect(state.status).toBe("completed")
        //   expect(state.state).toStrictEqual({})
    })
    test('simpleCondition', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...simpleConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },

            ]
        })
        expect(state.activeElementId).toBe("c")
    })
    test('simpleCondition a', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...stateConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },

            ]
        })
        expect(state.activeElementId).toBe("b")
    })
    test('simpleCondition c', async () => {
        //@ts-ignore
        const state = getActiveState({
            ...stateConditionalJSMD, steps: [
                { data: {}, action: "ok", userId: "tomas", type: "submit" },
                { data: {}, action: "ok", userId: "tomas", type: "submit" },

            ]
        })
        expect(state.activeElementId).toBe("c")
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
        expect(state.activeElementId).toBe("a")
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
        expect(state.activeElementId).toBe("b")
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
        expect(state.activeElementId).toBe("c")
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
        expect(state.activeElementId).toBe(undefined)
    })

})