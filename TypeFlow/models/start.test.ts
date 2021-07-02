import { getRepository } from "typeorm"
import db from "../../db"
import { TFlow, TTask } from "./TFlow"

const flow =
{
    title: "test",
    typeId: "test",
    steps: [],
    elements: [{
        id: "submit",
        form: "FishingForm",
        type: "UserTask",
        assigneeType: { id: "a" }
    },
    {
        flowStatus: "Peržiūrima",
        id: "review",
        form: "FishingForm/Approve",
        type: "UserTask",
        assigneeType: { id: "a" }
    }
    ],
    connectors: [
        { start: "submit", end: "review" },
        { start: "review", condition: "{{it.state.review.action === 'return'}}", end: "submit" }
    ]
}


describe.only("TFlow", () => {
    test('straight', async () => {
        await db()
        var newFlow = await TFlow.start(flow, { id: "Tomas" }, {})
        var newFlow = await getRepository(TFlow).findOne(newFlow.id)
        var newFlow = <TFlow>await newFlow.submit({ id: "tomas" }, {}, "approve", newFlow.steps[newFlow.steps.length - 1].id)
        expect(newFlow.activeElement).toBe(null)
    })
    test('return', async () => {
        await db()
        var newFlow = await TFlow.start(flow, { id: "Tomas" }, {})
        var newFlow = await getRepository(TFlow).findOne(newFlow.id)
        var newFlow = <TFlow>await newFlow.submit({ id: "tomas" }, {}, "return", newFlow.steps[newFlow.steps.length - 1].id)
        expect(newFlow.activeElement).not.toBe(null)
        expect(newFlow.activeElement).toBe("submit")
        var newFlow = <TFlow>await newFlow.submit({ id: "tomas" }, {}, "submit", newFlow.steps[newFlow.steps.length - 1].id)
        expect(newFlow.activeElement).toBe("review")
        var error = await newFlow.submit({ id: "tomas" }, {}, "submit", newFlow.steps[newFlow.steps.length - 2].id)
        expect(typeof error).toBe("string")
        var newFlow = <TFlow>await newFlow.submit({ id: "tomas" }, {}, "approve", newFlow.steps[newFlow.steps.length - 1].id)
        expect(newFlow.activeElement).toBe(null)
    })
    test('tasks', async () => {
        await db()
        var newFlow = await TFlow.start(flow, { id: "Tomas" }, {})
        var newTasks = await getRepository(TTask).find({ where: { flow: { id: newFlow.id } } })
        expect(newTasks.length).toBe(1)
        expect(newTasks[0].completed).toBe(false)
        var tTask = newTasks[0]
        var tTask = await getRepository(TTask).findOne({ relations: ["flow"], where: { id: tTask.id } })
        await tTask.assign({ id: "tomas" }, { id: "tomas" })
        expect(tTask.assignee).toBe("tomas")
        expect(tTask.completed).toBe(false)
        await tTask.submit({ id: "tomas" }, { ok: "ok" }, "approve")
        var tTask = await getRepository(TTask).findOne(tTask.id)
        expect(tTask.completed).toBe(true)
        var newFlow = await getRepository(TFlow).findOne(newFlow.id)
        expect(newFlow.activeElement).toBe(null)
    })
})