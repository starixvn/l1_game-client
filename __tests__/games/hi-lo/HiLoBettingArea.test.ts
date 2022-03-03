import HiLoBettingArea, { BettingAreaEvents } from "../../../assets/games/hi-lo/view-models/HiLoBettingArea";

describe("HiLoBettingArea", () => {
    let node: cc.Node;
    let comp: HiLoBettingArea;
    beforeAll(() => {
        node = new cc.Node();
        comp = node.addComponent(HiLoBettingArea);
        comp.disableLayer = new cc.Node();
        comp.animation = new cc.Animation();
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
});
