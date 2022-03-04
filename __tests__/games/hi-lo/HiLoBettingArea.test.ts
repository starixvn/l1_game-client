import { numberWithCommas } from "../../../assets/common/helpers/NumberHelper";
import HiLoBettingArea, { BettingAreaEvents } from "../../../assets/games/hi-lo/view-models/HiLoBettingArea";

describe("HiLoBettingArea", () => {
    let node: cc.Node;
    let comp: HiLoBettingArea;
    beforeAll(() => {
        node = new cc.Node();
        comp = node.addComponent(HiLoBettingArea);
        comp.disableLayer = new cc.Node();
        comp.animation = new cc.Animation();
        comp.stakeAmount = new cc.Node().addComponent(cc.Label);
    });

    describe("placingBet", () => {
        it("should emit placing bet event", () => {
            // Arrange
            node.emit = jest.fn();

            // Act
            comp.placingBet();

            // Assert
            expect(node.emit).toBeCalledWith(BettingAreaEvents.PLACING_BET, "");
        });
    });

    describe("enableBetChoice", () => {
        it("should enable Bet choice", () => {
            // Arrange
            const status = true;

            // Act
            comp.enableBetChoice(status);

            // Assert
            expect(comp.disableLayer.active).toEqual(false);
        });
    });

    describe("updateStake", () => {
        describe("when rank is either A or 2", () => {
            it("should set stake amount is null", () => {
                // Arrange
                const value = 11;
                const isSpecialCase = true;
                const animated = false;

                // Act
                comp.updateStake(value, isSpecialCase, animated);

                // Assert
                expect(comp.stakeAmount.string).toMatch("");
            });
        });

        describe("when rank is neither A nor 2", () => {
            it("should set stake amount value", () => {
                // Arrange
                const value = 11;
                const isSpecialCase = false;
                const animated = false;

                // Act
                comp.updateStake(value, isSpecialCase, animated);

                // Assert
                expect(comp.stakeAmount.string).toMatch(numberWithCommas(value, 2));
            });
        });

        describe("when has animation and rank is neither A or 2", () => {
            it("should set stake amount", () => {
                // Arrange
                const value = 11;
                const animated = true;
                const isSpecialCase = false;
                const temp: any = {};
                cc.tween = () => temp;
                cc.tween().to = (a, b, c?) => temp;
                cc.tween().delay = (a) => temp;
                cc.tween().start = () => temp;

                // Act
                comp.updateStake(value, isSpecialCase, animated);

                // Assert
                expect(comp.stakeAmount.string).toMatch(numberWithCommas(value, 2));
            });
        });
    });
});
