import { Column, Entity, getConnectionManager, getRepository, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AppUser, getNextElement } from "../../JSMD";
import getNextConnector from "../utils/getNextConnector";

@Entity()
export class TStep {
    @PrimaryGeneratedColumn()
    id: string
    @Column()
    type: string
    @Column({ type: "json" })
    data: any
    @Column()
    action?: string
    @Column()
    assignee: string
    @ManyToOne(() => TFlow, flow => flow.tasks)
    flow: TFlow;

}
@Entity()
export class TAppUser {
    @PrimaryColumn()
    id: string
    @Column({ type: "json" })
    permissions: Array<string> = []
    @Column({ type: "json" })
    tenants: Array<string> = []
}

@Entity()
export class TTask {
    @PrimaryColumn()
    id: string
    @ManyToOne(() => TFlow, flow => flow.steps)
    flow: TFlow;
    @Column({ nullable: true })
    assignee: string
    @Column()
    completed: boolean = false
    async assign(appUser: AppUser, assignee: AppUser) {
        this.assignee = assignee.id
        this.flow.assignee = assignee.id
        await getRepository(TTask).save(this)
        await getRepository(TFlow).save(this.flow)
    }
    async submit(appUser: AppUser, data: any, action: string) {
        if (!this.assignee) {
            return "You must assign at first"
        }
        if (this.assignee !== appUser.id) {
            return "Wrong assignee"
        }
        const flow = await getRepository(TFlow).findOne(this.flow.id)
        const submittedFlow = await flow.submit(appUser, data, action, this.id)
        if (typeof submittedFlow !== "string") {
            this.flow = submittedFlow
            this.completed = true
            return await getRepository(TTask).save(this)
        }
    }
    static async create(flow: TFlow) {
        const tTask = new TTask()
        tTask.flow = flow
        const id = flow.steps[flow.steps.length - 1].id
        tTask.id = id
        await getRepository(TTask).save(tTask)
    }
}
@Entity()
export class TFlow {
    @PrimaryGeneratedColumn()
    id: string
    @Column()
    typeId: string
    @Column()
    title: string
    @OneToMany(() => TStep, step => step.flow, {
        eager: true
    })
    steps: Array<TStep>
    @OneToMany(() => TTask, task => task.flow, {})
    tasks: Array<TTask>
    @Column({ type: "json" })
    state: any
    @Column({ nullable: true })
    activeElement?: string
    @Column({ nullable: true })
    assignee?: string
    @Column({ type: "json" })
    elements: Array<FlowElement>
    @Column({ type: "json" })
    connectors: Array<Connector>
    @Column({ type: "json" })
    status: any
    async submit(appUser: AppUser, data: any, action: string, stepId: string) {
        const stepID = this.steps[this.steps.length - 1].id
        if (`${stepID}` !== `${stepId}`) {
            return "TASK_NOT_VALID"
        }
        const tStep = new TStep()
        tStep.action = action
        tStep.data = data
        tStep.type = "submit"
        tStep.assignee = appUser.id
        tStep.data = data
        tStep.action = action
        tStep.flow = this
        const currentActiveElement = this.elements.find(el => el.id === this.activeElement)
        if (currentActiveElement) {
            this.state.state[currentActiveElement.id] = {
                data,
                action,
                appUser
            }
            const nextConnector = getNextConnector(this.state, this.connectors, this.activeElement)
            const nextElementId = nextConnector?.end
            const nextElement = this.elements.find(e => e.id === nextElementId)
            this.activeElement = nextElementId || null
            this.assignee = null
            this.status = getStatus(this.status, [currentActiveElement, nextConnector, nextElement])
            await getRepository(TFlow).save(this)
            await getRepository(TStep).save(tStep)
            this.steps = [...this.steps, tStep]
            return this
        }
    }

    static async start(flow: TypeFlow, appUser: AppUser, data: any, action: string = "submit") {
        const currentActiveElementId = flow.elements[0].id
        const tStep = new TStep()
        tStep.action = action
        tStep.data = data
        tStep.type = "submit"
        tStep.assignee = appUser.id
        await getRepository(TStep).save(tStep)
        const tFlow = new TFlow()
        tFlow.connectors = flow.connectors
        tFlow.elements = flow.elements
        tFlow.title = flow.title
        tFlow.typeId = flow.typeId
        tFlow.steps = [tStep]
        const state = { state: {} }
        state.state[currentActiveElementId] = {
            data,
            action,
            appUser
        }
        tFlow.state = state
        const nextConnector = getNextConnector(state, flow.connectors, currentActiveElementId)
        const nextElementId = nextConnector?.end
        const nextElement = flow.elements.find(e => e.id === nextElementId)
        tFlow.activeElement = nextElementId
        tFlow.status = getStatus("Pateikta", [flow.elements[0], nextConnector, nextElement])
        await getRepository(TFlow).save(tFlow)
        await TTask.create(tFlow)
        return tFlow
    }

}

function getStatus(currentStatus: string, elements: [currentElement?: FlowElement, connector?: Connector, nextFlowElement?: FlowElement]) {
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element?.flowStatus) {
            return element?.flowStatus
        }
    }
    return currentStatus
}
interface TypeFlow {
    title: string,
    typeId: string
    elements: Array<FlowElement>,
    connectors: Array<Connector>
}
export interface Connector {
    start: string,
    condition?: string
    flowStatus?: string,
    end: string
}
export interface FlowElement {
    id: string,
    type: string,
    form: string,
    flowStatus?: string,
    assignee?: string
    assigneeType: {
        id: string,
        type?: string
    }
}