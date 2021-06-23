export interface Connector {
    start: string;
    condition?: string;
    end: string;
}
export interface FlowElement {
    id: string;
    type: string;
    form?: string;
    flowStatus?: string;
    assignee?: string;
    assigneeType: {
        id: string;
        type?: string;
    };
}
export interface Step {
    type: string;
    data: any;
    action?: string;
    userId: string;
}
export interface JSMD {
    steps: Array<Step>;
    elements: Array<FlowElement>;
    connectors: Array<Connector>;
}
export interface AppUser {
    id: string;
    permissions?: Array<string>;
}
export declare function decide(expr: string, state: any): boolean;
export declare function getNextElement(state: any, connectors: Array<Connector>, currentElementId: string): string | undefined;
export declare function getElementById(jsmd: JSMD, id: string): FlowElement;
export declare function getStatus(jsmd: JSMD, activeElementId: string | undefined): string;
export interface ActiveState {
    status: string;
    state: any;
    activeElementId: string | undefined;
}
export declare function getActiveState(jsmd: JSMD): ActiveState;
export interface GetTask {
    id: number;
    assignee: string | undefined;
    state: any;
    element: any;
}
export declare function getTask(jsmd: JSMD): GetTask | void;
export declare enum AssigneType {
    permission = "permission"
}
export declare function assignTask(jsmd: JSMD, user: AppUser, taskIndex: number, assignee: AppUser): JSMD | string;
export declare enum submitTask_ERRORS {
    FLOW_IS_OVER = "flow is over",
    TASK_IS_OVER = "task is over",
    WRONG_ASSIGNEE = "wrong assignee"
}
export declare function submitTask(jsmd: JSMD, userId: any, taskId: number, data: any, action: string): JSMD | string;
