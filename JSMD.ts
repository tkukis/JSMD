
import * as Sqrl from 'squirrelly'

enum STEP_TYPE {
    assign = "assign",
    submit = "submit"
}
export interface Connector {
    start: string,
    condition?: string
    end: string
}
export interface JSMD {
    steps: Array<{
        type: string,
        data: any,
        action?: string,
        userId: string
    }>,
    elements: Array<{
        id: string,
        type: string,
        assignee?: string
        assigneeType: {
            id: string,
            type?: string
        }
    }>,
    connectors: Array<Connector>
}

export interface AppUser {
    id: string,
}
export function decide(expr: string, state: any) {
    try {
        const result = Sqrl.render(expr, state)
        return result === "true"
    } catch (error) {
        return false
    }

}
export function getNextElement(state: any, connectors: Array<Connector>, currentElementId: string): string | undefined {
    const candidates = connectors.filter(c => c.start === currentElementId)
    const candidate = candidates.find(c => {
        if (c.condition) {
            return decide(c.condition, { state })
        }
        return false
    })
    if (candidate) {
        return candidate.end
    }
    return candidates.find(c => !c.condition)?.end
}
export function getActiveState(jsmd: JSMD) {
    const submits = jsmd.steps.filter(s => s.type === STEP_TYPE.submit)
    return submits.reduce(function (total, current, i) {
        total.state[total.activeElement] = { data: current.data, action: current.action }
        const next = getNextElement(total.state, jsmd.connectors, total.activeElement)
        return { state: total.state, activeElement: next }
    }, { state: {}, activeElement: jsmd.elements[0].id })
}

export function getTask(jsmd: JSMD): { id: Number, assignee: string | undefined } | void {
    const assigns = jsmd.steps.filter(s => s.type === STEP_TYPE.assign)
    if (assigns.length === 0) {
        return { id: 0, assignee: undefined }
    }
    return { id: 0, assignee: assigns[assigns.length - 1].data.id }
}
export function getValue() {

}
export function assignTask(jsmd: JSMD, userId: string, taskId: number, assignee: AppUser): JSMD {
    const flow: JSMD = JSON.parse(JSON.stringify(jsmd))
    const steps = flow.steps
    flow.steps = [...steps, { userId, type: STEP_TYPE.assign, data: { id: assignee.id } }]
    return flow

}
export function submitTask(jsmd: JSMD, userId, taskId: number, data: any, action: string) {
    const flow: JSMD = JSON.parse(JSON.stringify(jsmd))
    const steps = flow.steps
    flow.steps = [...steps, { userId, type: STEP_TYPE.submit, data, action }]
    return flow
}
