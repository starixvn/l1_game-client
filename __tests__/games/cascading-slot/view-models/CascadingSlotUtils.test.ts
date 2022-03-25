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
                [10, 10, 8, 8, 8],
                [11, 11, 10, 8, 8],
                [11, 10, 10, 8, 8],
                [6, 6, 9, 9, 3],
                [11, 11, 5, 5, 8],
                [7, 8, 8, 9, 9]
            ];
            // Act
            const output = convertBoardValue(input);

            // Assert
            expect(output).toStrictEqual(expectValue);
        });
    });
});
