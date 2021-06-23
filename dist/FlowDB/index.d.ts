import { AppUser, Connector, FlowElement, JSMD, Step as JSMDStep, ActiveState } from "../JSMD";
export declare class Step implements JSMDStep {
    id: string;
    type: string;
    data: any;
    action?: string;
    userId: string;
    flow: Flow;
}
export declare class Flow implements JSMD {
    id: string;
    steps: Array<JSMDStep>;
    elements: Array<FlowElement>;
    connectors: Array<Connector>;
    status: ActiveState;
}
export declare function start(jsmd: JSMD, appUser: AppUser, action: string, data: any): Promise<Flow | string>;
export declare function assignTask(flowId: string, user: AppUser, taskIndex: number, assignee: AppUser): Promise<string | Flow>;
export declare function submitTask(flowId: JSMD, userId: any, taskId: number, data: any, action: string): Promise<string | Flow>;
export declare function getTask(): void;
