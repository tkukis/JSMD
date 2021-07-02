import getNextConnector from "./getNextConnector"

describe("getNextConnector", () => {
    test('getNextConnector', async () => {
        expect(getNextConnector({}, [{ start: "a", end: "b" }], "a")?.end).toBe("b")
        expect(getNextConnector({}, [{ start: "c", end: "b" }], "a")?.end).toBe(undefined)

        expect(getNextConnector({}, [{ start: "a", end: "b", condition: "{{it.state.a.b===100}}" }], "a")?.end).toBe(undefined)
        expect(getNextConnector({ state: { a: { b: 100 } } }, [{ start: "a", end: "b", condition: "{{it.state.a.b===100}}" }], "a")?.end).toBe("b")
        expect(getNextConnector({ state: { a: { b: 100 } } }, [{ start: "a", end: "b", condition: "{{it.state.a.b===101}}" }], "a")?.end).toBe(undefined)

    })
})