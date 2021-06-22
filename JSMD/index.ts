
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

export interface FlowElement {
    id: string,
    type: string,
    assignee?: string
    assigneeType: {
        id: string,
        type?: string
    }
}
export interface Step {
    type: string
    data: any
    action?: string
    userId: string
}

export interface JSMD {
    steps: Array<Step>,
    elements: Array<FlowElement>,
    connectors: Array<Connector>
}

export interface AppUser {
    id: string,
    permissions?: Array<string>
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

export function getElementById(jsmd: JSMD, id: string) {
    return jsmd.elements.find(element => element.id === id)
}
export function getActiveState(jsmd: JSMD) {
    const submits = jsmd.steps.filter(s => s.type === STEP_TYPE.submit)
    return submits.reduce(function (total, current, i) {
        total.state[total.activeElementId] = { data: current.data, action: current.action }
        const next = getNextElement(total.state, jsmd.connectors, total.activeElementId)
        return { state: total.state, activeElementId: next }
    }, { state: {}, activeElementId: jsmd.elements[0].id })
}

export interface GetTask {
    id: number,
    assignee: string | undefined,
    state: any,
    element: any
}
export function getTask(jsmd: JSMD): GetTask | void {
    const activeState = getActiveState(jsmd)
    if (!activeState.activeElementId) {
        return null
    }
    const id = jsmd.steps.filter(s => s.type !== STEP_TYPE.assign).length
    const assigns = jsmd.steps.filter(s => s.type === STEP_TYPE.assign)
    const assignee = jsmd.steps.reduce((prev, current, i) => {
        if (current.type === STEP_TYPE.submit) {
            return null
        }
        return current?.data?.id
    }, null)

    return { id, assignee, state: activeState.state, element: getElementById(jsmd, activeState.activeElementId) }
}

export enum AssigneType {
    permission = "permission"
}
export function assignTask(jsmd: JSMD, user: AppUser, taskIndex: number, assignee: AppUser): JSMD | string {

    const flow: JSMD = JSON.parse(JSON.stringify(jsmd))
    const steps = flow.steps
    flow.steps = [...steps, { action: STEP_TYPE.assign, userId: user.id, type: STEP_TYPE.assign, data: { id: assignee.id } }]
    return flow

}
export enum submitTask_ERRORS {
    FLOW_IS_OVER = "flow is over",
    TASK_IS_OVER = "task is over",
    WRONG_ASSIGNEE = "wrong assignee"
}

export function submitTask(jsmd: JSMD, userId, taskId: number, data: any, action: string): JSMD | string {
    const _currentTask = getTask(jsmd)
    if (!_currentTask) {
        return submitTask_ERRORS.FLOW_IS_OVER
    }
    const currentTask = (<GetTask>_currentTask)
    if (currentTask.id !== taskId) {
        return submitTask_ERRORS.TASK_IS_OVER
    }
    if (userId !== currentTask.assignee) {
        return submitTask_ERRORS.WRONG_ASSIGNEE
    }

    const flow: JSMD = JSON.parse(JSON.stringify(jsmd))
    const steps = flow.steps
    flow.steps = [...steps, { userId, type: STEP_TYPE.submit, data, action }]
    return flow
}
