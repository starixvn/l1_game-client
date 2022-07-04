import BlockchainBaccaratLastRoundInfo from "../../../../../assets/games/blockchain-baccarat/components/last-round-info/view-models/BlockchainBaccaratLastRoundInfo";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import BlockchainBaccaratCardsUI from "../../../../../assets/games/blockchain-baccarat/view-models/BlockchainBaccaratCardsUI";
import { BlockchainBaccaratRoundHistory } from "../../../../../assets/games/blockchain-baccarat/event-models/BlockchainBaccaratRoundHistory";

jest.mock("i18n/runtime-scripts/LanguageData");
describe("Test class LastRoundInfo", () => {
    let node: cc.Node;
    let comp: BlockchainBaccaratLastRoundInfo;
    let lastRoundLabel: cc.Label;
    let playerLabel: cc.Label;
    let bankerLabel: cc.Label;
    let cardsUI: cc.Node;
    let playerCard3: cc.Node;
    let bankerCard3: cc.Node;
    let winNoticeLabel: cc.Label;

    beforeAll(() => {
        node = new cc.Node();
        lastRoundLabel = new cc.Node().addComponent(cc.Label);
        playerLabel = new cc.Node().addComponent(cc.Label);
        bankerLabel = new cc.Node().addComponent(cc.Label);
        cardsUI = new cc.Node();
        playerCard3 = new cc.Node();
        bankerCard3 = new cc.Node();
        const winNotice = new cc.Node();
        winNoticeLabel = winNotice.addComponent(cc.Label);
        const parentWinLabel = new cc.Node();
        parentWinLabel.addChild(winNotice);
        comp = node.addComponent(BlockchainBaccaratLastRoundInfo);
        comp.lastRoundLabel = lastRoundLabel;
        comp.playerLabel = playerLabel;
        comp.bankerLabel = bankerLabel;
        comp.cardsUI = cardsUI;
        comp.playerCard3 = playerCard3;
        comp.bankerCard3 = bankerCard3;
        comp.winNoticeLabel = winNoticeLabel;
    });

    it("reset should run expected", () => {
        // act
        comp.reset();

        // assert
        expect(cardsUI.active).toBe(false);
        expect(winNoticeLabel.node.getParent().active).toBe(false);
    });

    describe("updateUI", () => {
        describe("when lastRound null", () => {
            it("cardsUI should be inactive", () => {
                // act
                comp.updateUI(null, 0);

                // assert
                expect(cardsUI.active).toBe(false);
            });
            it("winNotice should be inactive", () => {
                // act
                comp.updateUI(null, 0);

                // assert
                expect(winNoticeLabel.node.getParent().active).toBe(false);
            });
        });

        describe("when lastRound has data", () => {
            beforeEach(() => {
                cardsUI.removeComponent(BlockchainBaccaratCardsUI);
                cardsUI.addComponent(BlockchainBaccaratCardsUI);
                cardsUI.getComponent(BlockchainBaccaratCardsUI).showCardsWithoutAnimation = jest.fn();
                i18n.t.mockReturnValueOnce("banker win");
            });
            // arrange
            const lastRound: BlockchainBaccaratRoundHistory = {
                roundId: 1,
                result: {
                    player: { card1: { rank: "1", suit: 1 }, card2: { rank: "1", suit: 1 }, card3: { rank: "1", suit: 1 } },
                    banker: { card1: { rank: "1", suit: 2 }, card2: { rank: "1", suit: 2 }, card3: { rank: "3", suit: 2 } }
                },
                settlementResult: {
                    player: false,
                    banker: true,
                    tie: false,
                    small: false,
                    big: true,
                    playerPair: true,
                    bankerPair: true,
                    natural: false
                }
            };
            const currentIndex = 10;

            it("cardUI should be active", () => {
                // act
                comp.updateUI(lastRound, currentIndex);

                // assert
                expect(cardsUI.active).toBe(true);
            });
            it("playerCard3 should be active", () => {
                // act
                comp.updateUI(lastRound, currentIndex);

                // assert
                expect(playerCard3.active).toBe(true);
            });

            it("bankerCard3 should be active", () => {
                // act
                comp.updateUI(lastRound, currentIndex);

                // assert
                expect(bankerCard3.active).toBe(true);
            });

            it("should call showCardsWithoutAnimation", () => {
                // act
                comp.updateUI(lastRound, currentIndex);

                // assert
                expect(cardsUI.getComponent(BlockchainBaccaratCardsUI).showCardsWithoutAnimation).toHaveBeenCalledWith(
                    lastRound,
                    currentIndex
                );
            });

            it("win notice should be active", () => {
                // act
                comp.updateUI(lastRound, currentIndex);

                // assert
                expect(winNoticeLabel.node.getParent().active).toBe(true);
            });

            it("should update win notice label", () => {
                // act
                comp.updateUI(lastRound, currentIndex);

                // assert
                expect(winNoticeLabel.string).toEqual("BANKER WIN");
            });
        });
    });
});
