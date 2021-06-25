import { Column, Entity, getConnectionManager, getRepository, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { getPreEmitDiagnostics, idText } from "typescript";

import { AppUser, assignTask as jAssignTask, Connector, FlowElement, JSMD, submitTask as jSubmitTask, Step as JSMDStep, ActiveState, getActiveState, getTask } from "../JSMD";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: string
    @ManyToOne(() => Flow, flow => flow.steps)
    flow: Flow;
    @Column()
    taskID: number
    @Column({ nullable: true })
    assigneeId?: string
    @Column({ type: "json", nullable: true })
    completedState?: ActiveState
}


@Entity()
export class Step implements JSMDStep {
    @PrimaryGeneratedColumn()
    id: string
    @Column()
    type: string
    @Column({ type: "json" })
    data: any
    @Column()
    action?: string
    @Column()
    userId: string
    @ManyToOne(() => Flow, flow => flow.steps)
    flow: Flow;
}

@Entity()
export class Flow implements JSMD {
    @PrimaryGeneratedColumn()
    id: string
    @Column()
    type: string
    @OneToMany(() => Step, step => step.flow)
    steps: Array<JSMDStep>
    @Column({ type: "json" })
    elements: Array<FlowElement>
    @Column({ type: "json" })
    connectors: Array<Connector>
    @Column({ type: "json" })
    status: ActiveState
}


export async function start(jsmd: JSMD, type: string, appUser: AppUser, action: string, data: any): Promise<Flow | string> {

    const flow = jAssignTask(jsmd, appUser, 0, appUser)
    if (typeof flow === "string") {
        return flow
    } else {
        const _startedFlow = jSubmitTask(flow, appUser.id, 0, data, action)
        if (typeof _startedFlow === "string") {
            return _startedFlow
        }
        const startedFlow = (<JSMD>_startedFlow)
        const steps = await Promise.all((<JSMD>_startedFlow).steps.map(async s => {
            const step = new Step()
            step.action = s.action
            step.data = s.data
            step.type = s.type
            step.userId = s.userId
            await getRepository(Step).save(step)
            return step
        }))
        const newFlow = new Flow()
        newFlow.steps = steps
        newFlow.type = type
        newFlow.connectors = startedFlow.connectors
        newFlow.elements = startedFlow.elements
        newFlow.status = getActiveState(startedFlow)
        const task = getTask(startedFlow)
        await getRepository(Flow).save(newFlow)
        if (task) {
            const dbTask = new Task()
            dbTask.flow = newFlow
            dbTask.taskID = task.id
            await getRepository(Task).save(dbTask)
        }
        return newFlow
    }
}

export async function assignTask(flowId: string, user: AppUser, taskIndex: number, assignee: AppUser) {
    const flow = await getRepository(Flow).findOne(flowId, { relations: ["steps"] })
    if (!flow) {
        return "n.a."
    }
    const assignedFlow = jAssignTask(flow, user, taskIndex, assignee)
    if (typeof assignedFlow === "string") {
        return assignedFlow
    }
    const task = await getRepository(Task).findOne({ where: { taskID: taskIndex, flow: { id: flowId } } })
    if (task) {
        task.assigneeId = assignee.id
        getRepository(Task).save(task)
    }
    return await saveNewStep(assignedFlow, flow);
}
async function saveNewStep(jsmd: JSMD, flow: Flow) {
    const jNewStep = jsmd.steps[jsmd.steps.length - 1];
    const newStep = new Step();
    newStep.action = jNewStep.action;
    newStep.data = jNewStep.data;
    newStep.flow = flow;
    newStep.type = jNewStep.type;
    newStep.userId = jNewStep.userId;
    await getRepository(Step).save(newStep);
    const newFlow = await getRepository(Flow).findOne(flow.id, { relations: ["steps"] })
    newFlow.status = getActiveState(newFlow)
    await getRepository(Flow).save(newFlow)
    return newFlow
}

export async function submitTask(flowId: string, userId, taskId: number, data: any, action: string) {
    const flow = await getRepository(Flow).findOne(flowId, { relations: ["steps"] })
    if (!flow) {
        return "n.a."
    }
    const submittedFlow = jSubmitTask(flow, userId, taskId, data, action)
    if (typeof submittedFlow === "string") {
        return submittedFlow
    }
    const oldTask = await getRepository(Task).findOne({ where: { taskID: taskId, flow: { id: flow.id } } })
    if (oldTask) {
        oldTask.completedState = getActiveState(submittedFlow)
        await getRepository(Task).save(oldTask)
    }
    const task = getTask(submittedFlow)
    if (task) {
        const newTask = new Task()
        newTask.taskID = task.id
        newTask.flow = flow
        await getRepository(Task).save(newTask)
    }

    return await saveNewStep(submittedFlow, flow)
}
