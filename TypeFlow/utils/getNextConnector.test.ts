import getNextConnector from "./getNextConnector"

describe.only("getNextConnector", () => {
    test.only('getNextConnector', async () => {
        expect(getNextConnector({}, [{ start: "a", end: "b" }], "a")?.end).toBe("b")
        expect(getNextConnector({}, [{ start: "c", end: "b" }], "a")?.end).toBe(undefined)

        expect(getNextConnector({}, [{ start: "a", end: "b", condition: "{{it.state.a.b===100}}" }], "a")?.end).toBe(undefined)
        expect(getNextConnector({ a: { b: 100 } }, [{ start: "a", end: "b", condition: "{{it.state.a.b===100}}" }], "a")?.end).toBe("b")
    })
})