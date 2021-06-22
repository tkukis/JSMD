import { AppUser, assignTask, getActiveState, getElementById, GetTask, getTask, JSMD, submitTask, submitTask_ERRORS } from "."

const jsmd: JSMD = {
    steps: [

    ],
    elements:
        [
            {
                id: "a",
                type: "UserTask",
                flowStatus: "returned",
                assigneeType: { id: "admin" }
            },
            {
                id: "b",
                flowStatus: "review1",
                type: "UserTask",
                assigneeType: { id: "admin" }
            },
            {
                id: "c",
                type: "UserTask",
                flowStatus: "review1",
                assigneeType: { id: "admin" }
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
const flowInBStep = {
    "steps":
        [
            { "userId": "tomas", "type": "assign", "data": { "id": "tomas" } },
            { "userId": "tomas", "type": "assign", "data": { "id": "andrius" } },
            { "userId": "tomas", "type": "assign", "data": { "id": "tomas" } },
            { "userId": "tomas", "type": "submit", "data": {}, "action": "submit" }],
    "elements": [
        { "id": "a", "type": "UserTask", "assigneeType": { "id": "admin" } },
        { "id": "b", "type": "UserTask", "assigneeType": { "id": "admin" } },
        { "id": "c", "type": "UserTask", "assigneeType": { "id": "admin" } }
    ],
    "connectors": [
        { "start": "c", "condition": "{{it.state.c.action==='reject'}}", "end": "a" },
        { "start": "a", "end": "b" },
        { "start": "b", "end": "c" }
    ]
}
const appUser: AppUser = {
    id: "tomas",
    permissions: ['admin']
}
describe("asssig task", () => {
    test('assignTask', async () => {
        const activeState = getActiveState(jsmd)
        const element = getElementById(jsmd, activeState.activeElementId)
        expect(element.id).toBe("a")
        let task = getTask(jsmd)
        //@ts-ignore
        expect(task?.id).toBe(0)
        let flow = assignTask(jsmd, appUser, 0, appUser)
        //@ts-ignore
        expect(getTask(flow).assignee).toBe("tomas")
        if (typeof flow === "string") {
            return
        }
        flow = (flow as JSMD)

        flow = assignTask(flow, appUser, 0, { ...appUser, id: "andrius" }) as JSMD
        expect(flow.steps.length).toBe(2)

        //@ts-ignore
        expect(getTask(flow).assignee).toBe("andrius")
        flow = assignTask(flow, appUser, 0, { ...appUser }) as JSMD
        flow = submitTask(flow, appUser.id, 0, {}, "submit")
        //@ts-ignore
        expect(getTask(flow).id).toBe(1)
    })

    test("assign", () => {
        let flow = submitTask(flowInBStep, "tomas", 0, {}, "submit")
        expect(typeof flow).toBe("string")
        expect(flow).toBe(submitTask_ERRORS.TASK_IS_OVER)
        //@ts-ignore
        expect(getTask(flowInBStep).id).toBe(1)
        expect(submitTask(flowInBStep, appUser.id, 1, {}, "submit")).toBe(submitTask_ERRORS.WRONG_ASSIGNEE)
        flow = <JSMD>assignTask(flowInBStep, appUser, 1, appUser)
        let task = getTask(flow)
        //@ts-ignore
        expect(task.id).toBe(1)
        //@ts-ignore
        expect(task.assignee).toBe("tomas")
        flow = <JSMD>submitTask(flow, appUser.id, 1, { some: "some" }, "submit")
        task = getTask(flow)
        //@ts-ignore
        expect(task.id).toBe(2)
        //@ts-ignore
        expect(task.assignee).toBe(null)
        //@ts-ignore
        flow = <JSMD>assignTask(flow, appUser, 2, appUser)
        //@ts-ignore
        flow = <JSMD>submitTask(flow, appUser.id, 2, { some: "some" }, "submit")
        //@ts-ignore
        task = getTask(flow)
        expect(task).toBe(null)
        flow = <JSMD>submitTask(flow, appUser.id, 2, { some: "some" }, "submit")
        expect(flow).toBe(submitTask_ERRORS.FLOW_IS_OVER)
    })

})