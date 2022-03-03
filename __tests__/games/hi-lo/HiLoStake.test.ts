import { numberWithCommas } from "../../../assets/common/helpers/NumberHelper";
import { HiLoStakeModel } from "../../../assets/games/hi-lo/events-models/HiLoStakeModel";
import HiLoStakes from "../../../assets/games/hi-lo/view-models/HiLoStakes";

function createStakeModel() {
    return {
        higherAmount: 15.73,
        betWin: 13.45,
        lowerAmount: 14.36
    };
}
describe("HiLoStakes", () => {
    let node: cc.Node;
    let comp: HiLoStakes;
    beforeAll(() => {
        node = new cc.Node();
        comp = node.addComponent(HiLoStakes);
        comp.higherAmount = node.addComponent(cc.Label);
        comp.betWin = node.addComponent(cc.Label);
        comp.lowerAmount = node.addComponent(cc.Label);
    });
    describe("updateStakes", () => {
        it("should called setAmount 3 times", () => {
            // Arrange
            const stake: HiLoStakeModel = createStakeModel();
            comp.setAmount = jest.fn();

            // Act
            comp.updateStakes(stake);

            // Assert
            expect(comp.setAmount).toBeCalledTimes(3);
        });
    });

    describe("resetStakes", () => {
        it("should reset stake", () => {
            // Arrange
            comp.setAmount = jest.fn();
            const betAmount = 14.25;

            // Act
            comp.resetStakes(betAmount);

            // Assert
            expect(comp.setAmount).toBeCalledTimes(2);
            expect(comp.betWin.string).toMatch(numberWithCommas(betAmount, 2));
        });
    });

    describe("setAmount", () => {
        it("should set amount", () => {
            // Arrange
            comp.setAmount = HiLoStakes.prototype.setAmount;
            const value = "14.25";
            const amountLabel = new cc.Node().addComponent(cc.Label);
            const animated = false;

            // Act
            comp.setAmount(amountLabel, value, animated);

            // Assert
            expect(amountLabel.string).toMatch(value);
        });
    });
});
