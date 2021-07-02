import { Connector } from "../models/TFlow";
import * as Sqrl from 'squirrelly'
export function decide(expr: string, state: any) {
    try {
        const result = Sqrl.render(expr, state)
        return result === "true"
    } catch (error) {
        return false
    }
}


export default function getNextConnector(state: any, connectors: Array<Connector>, currentElement: string) {
    return connectors.filter(c => {
        if (!c.condition) {
            return true
        }
        return decide(c.condition, state)
    }).find(c => c.start === currentElement)

}