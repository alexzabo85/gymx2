const add = (a, b) => a + b;

const cases = [[2, 2, 4], [-2, -2, -4], [2, -2, 0]];

describe("'add' utility", () => {
    test.each(cases)(
        "given %p and %p as arguments, returns %p",
        (firstArg, secondArg, expectedResult) => {
            const result = add(firstArg, secondArg);
            expect(result).toEqual(expectedResult);
        }
    );
});