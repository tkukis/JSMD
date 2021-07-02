import { Column, Entity, getConnectionManager, getRepository, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { AppUser } from "../../JSMD";

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
    @ManyToOne(() => TFlow, flow => flow.steps)
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
export class TFlow {
    @PrimaryGeneratedColumn()
    id: string
    @Column()
    typeId: string
    @Column()
    title: string
    @OneToMany(() => TStep, step => step.flow)
    steps: Array<TStep>
    @Column({ type: "json" })
    state: any
    @Column()
    activeElement?: string
    @Column()
    assignee?: string
    @Column({ type: "json" })
    elements: Array<FlowElement>
    @Column({ type: "json" })
    connectors: Array<Connector>
    @Column({ type: "json" })
    status: any
    static async start(flow: TypeFlow, appUser: AppUser, data: any) {
        const tFlow = new TFlow()
        tFlow.connectors = flow.connectors
        tFlow.elements = flow.elements
        tFlow.title = flow.title
        tFlow.typeId = flow.typeId
        await getRepository(TFlow).save(tFlow)
        const tStep = new TStep()
        tStep.action = "submit"
        tStep.data = data
        tStep.type = "start"
        tStep.assignee = appUser.id
        tStep.flow = tFlow
        await getRepository(TStep).save(tStep)
    }
    //   submit(appUser: AppUser, taskID, action: string, data: any) { }
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