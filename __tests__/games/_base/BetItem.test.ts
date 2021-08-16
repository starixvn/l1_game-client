import BetItem from "../../../assets/games/_base/view-models/BetItem";

let node: cc.Node;
let betItem: BetItem;

beforeEach(() => {
    node = new cc.Node();
    betItem = node.addComponent(BetItem);
    const ownBetLabel = node.addComponent(cc.Label);
    const totalBetLabel = node.addComponent(cc.Label);
    betItem.ownBet = ownBetLabel;
    betItem.totalBet = totalBetLabel;
});

describe("setOwnBet", () => {
    it("should do nothing when ownBet is null", () => {
        betItem.ownBet = null;
        let isError = false;
        try {
            betItem.setOwnBet(0);
        } catch (e) {
            isError = true;
        }

        expect(isError).toBe(false);
    });

    it("should empty when bet is zero", () => {
        betItem.setOwnBet(0);

        expect(betItem.ownBet.string).toEqual("");
    });

    it("should bet value when bet is greater than zero", () => {
        betItem.setOwnBet(1000);

        expect(betItem.ownBet.string).toEqual("1,000");
    });
});

describe("setTotalBet", () => {
    it("should empty when bet is zero", () => {
        betItem.setTotalBet(0);

        expect(betItem.totalBet.string).toEqual("");
    });

    it("should bet value when bet is greater than zero", () => {
        betItem.setTotalBet(1000);

        expect(betItem.totalBet.string).toEqual("1,000");
    });
});
