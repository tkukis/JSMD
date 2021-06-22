import { Column, Entity, getConnectionManager, getRepository, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import db from "../db";
import { AppUser, assignTask, Connector, FlowElement, JSMD, submitTask, Step as JSMDStep } from "../JSMD";

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
    @OneToMany(() => Step, step => step.flow)
    steps: Array<JSMDStep>
    @Column({ type: "json" })
    elements: Array<FlowElement>
    @Column({ type: "json" })
    connectors: Array<Connector>
}

export async function start(jsmd: JSMD, appUser: AppUser, action: string, data: any) {

    const flow = assignTask(jsmd, appUser, 0, appUser)
    if (typeof flow === "string") {
        return flow
    } else {
        const startedFlow = submitTask(flow, appUser.id, 0, data, action)
        if (typeof startedFlow === "string") {
            return startedFlow
        }
        const steps = await Promise.all((<JSMD>startedFlow).steps.map(async s => {
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
        newFlow.connectors = startedFlow.connectors
        newFlow.elements = startedFlow.elements
        await getRepository(Flow).save(newFlow)
        return newFlow
    }
}
