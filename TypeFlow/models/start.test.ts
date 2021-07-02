import db from "../../db"
import { TFlow } from "./TFlow"

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
    test.only('start', async () => {
        await db()
        /// await TFlow.start(flow, { id: "Tomas", {})
    })
})