import { convertBoardValue } from "../../../../assets/games/cascading-slot/view-models/CascadingSlotUtils";

describe("Cascading Slot Utils", () => {
    describe("Func convertBoardValue", () => {
        it("Output's length is 6", () => {
            // Arrange
            const input = [8, 8, 8, 3, 8, 9, 8, 8, 8, 9, 5, 9, 8, 10, 10, 9, 5, 8, 10, 11, 10, 6, 11, 8, 10, 11, 11, 6, 11, 7];

            // Act
            const output = convertBoardValue(input);

            // Assert
            expect(output.length).toEqual(6);
        });

        it("Each item's length is 5", () => {
            // Arrange
            const input = [8, 8, 8, 3, 8, 9, 8, 8, 8, 9, 5, 9, 8, 10, 10, 9, 5, 8, 10, 11, 10, 6, 11, 8, 10, 11, 11, 6, 11, 7];

            // Act
            const output = convertBoardValue(input);

            // Assert
            expect(output[0].length).toEqual(5);
        });

        it("Output ", () => {
            // Arrange
            const input = [8, 8, 8, 3, 8, 9, 8, 8, 8, 9, 5, 9, 8, 10, 10, 9, 5, 8, 10, 11, 10, 6, 11, 8, 10, 11, 11, 6, 11, 7];
            const expectValue = [
                [8, 3, 8, 8, 8],
                [9, 8, 8, 8, 9],
                [10, 10, 8, 9, 5],
                [11, 10, 8, 5, 9],
                [10, 8, 11, 6, 10],
                [7, 11, 6, 11, 11]
            ];
            // Act
            const output = convertBoardValue(input);

            // Assert
            expect(output).toStrictEqual(expectValue);
        });
    });
});
