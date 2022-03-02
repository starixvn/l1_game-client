import { CardModel } from "../../../assets/common/new-card/view-models/NewCard";
import HiLoCard from "../../../assets/games/hi-lo/components/view-models/HiLoCard";
import HiLoStatistic from "../../../assets/games/hi-lo/view-models/HiLoStatistic";
import { t } from "../../../packages/i18n/runtime-scripts/LanguageData";
import { mockFuntions } from "../../mocks/TestUtils";
jest.mock("../../../assets/common/GameUtils", () => ({
    default: class {
        public static createNodeFromPrefab() {
            return mockFuntions.createNodeFromPrefab();
        }
    }
}));
jest.mock("../../../assets/games/hi-lo/components/view-models/HiLoCard", () => ({
    default: jest.fn().mockImplementation(() => {
        return {
            highlight: new cc.Node()
        };
    })
}));
describe("HiLoStatistic", () => {
    let node: cc.Node;
    let comp: HiLoStatistic;
    let prefabNode: cc.Node;

    function createCardModel() {
        const card: CardModel = {
            rank: "3",
            suit: 1
        };
        return card;
    }

    beforeAll(() => {
        node = new cc.Node();
        comp = node.addComponent(HiLoStatistic);
        comp.statisticContainer = new cc.Node();
        comp.statsScrollView = node.addComponent(cc.ScrollView);
        comp.layout = comp.statisticContainer.addComponent(cc.Layout);
        mockFuntions.createNodeFromPrefab = () => {
            prefabNode = new cc.Node();
            prefabNode.addComponent(HiLoCard);
            return prefabNode;
        };
    });

    describe("updateCards", () => {
        beforeEach(() => {
            // Arrange
            const cards = [
                createCardModel(),
                createCardModel(),
                createCardModel(),
                createCardModel(),
                createCardModel(),
                createCardModel(),
                createCardModel(),
                createCardModel(),
                createCardModel(),
                createCardModel(),
                createCardModel()
            ];
            comp.clearCards = jest.fn();
            comp.createCard = jest.fn();
            comp.updatePositionHighlight = jest.fn();
            comp.updateContentPosition = jest.fn();
            comp.layout.updateLayout = jest.fn();

            // Act
            comp.updateCards(cards);
        });
        it("should called clearCards", () => {
            // Assert
            expect(comp.clearCards).toBeCalled();
        });

        it("should called createCard", () => {
            expect(comp.createCard).toBeCalledTimes(11);
        });

        it("should called updatePositionHighlight", () => {
            expect(comp.updatePositionHighlight).toBeCalled();
        });

        it("should called updateContentPosition", () => {
            expect(comp.updateContentPosition).toBeCalled();
        });

        it("should called updateLayout", () => {
            expect(comp.layout.updateLayout).toBeCalled();
        });
    });

    describe("createCard", () => {
        it("should create cards", () => {
            // Arrange
            const cardScaleX = 0.29;
            const cardScaleY = 0.29;
            const card = createCardModel();
            HiLoCard.prototype.setCard = jest.fn();
            HiLoCard.prototype.faceUp = jest.fn();

            // Act
            const node = comp.createCard(card);

            // Assert
            expect(prefabNode).toStrictEqual(node);
        });
    });

    describe("onLoad", () => {
        it("should called onLoad", () => {
            // Arrange

            // Act
            comp.onLoad();

            // Assert
            expect(comp.layout).toEqual(comp.statisticContainer.getComponent(cc.Layout));
            expect(comp.spaceX).toEqual(comp.layout.spacingX);
        });
    });

    describe("onEnable", () => {
        it("should called onEnable", () => {
            // Arrange
            const widget = comp.statisticContainer.addComponent(cc.Widget);

            // Act
            comp.onEnable();

            // Assert
            expect(widget.left).toEqual(0);
        });
    });

    describe("clearCards", () => {
        it("should called clearCards", () => {
            // Arrange

            comp.clearCards = HiLoStatistic.prototype.clearCards;
            comp.statisticContainer.destroyAllChildren = jest.fn();

            // Act
            comp.clearCards();

            // Assert
            expect(comp.statisticContainer.destroyAllChildren).toBeCalled();
        });
    });

    describe("updatePositionHighlight", () => {
        let cardComps = [];
        beforeEach(() => {
            // Arrange
            comp.updatePositionHighlight = HiLoStatistic.prototype.updatePositionHighlight;
            cardComps = [new HiLoCard(), new HiLoCard()];
            comp.statisticContainer.getComponentsInChildren = () => cardComps;

            // Act
            comp.updatePositionHighlight();
        });

        it("should set highlight for last card", () => {
            // Assert
            expect(cardComps[cardComps.length - 1].highlight.active).toEqual(true);
        });
    });
});
