import { decide } from "./JSMD"

describe("decide", () => {
    test('simple', async () => {
        expect(decide("true", {})).toBe(true)
    })
    test('simple exp', async () => {
        expect(decide("{{true}}", {})).toBe(true)
    })
    test('not simple exp', async () => {
        expect(decide("{{it.state.a.b ==='ok'}}", { state: { a: { b: "ok" } } })).toBe(true)
    })
    test('not simple exp failing', async () => {
        expect(decide("{{it.state.a.b ==='ok'}}", { state: { a: { b: "not ok" } } })).toBe(false)
    })
    test('not simple exp handling exeptions', async () => {
        expect(decide("{{it.state.a.,asb ==='ok'}}", { state: { a: { b: "not ok" } } })).toBe(false)
    })
})
export { }