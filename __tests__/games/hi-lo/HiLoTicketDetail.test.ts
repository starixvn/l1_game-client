import { BetLog } from "../../../assets/games/hi-lo/view-models/HiLoBetData";
import HiLoTicketDetail from "../../../assets/games/hi-lo/view-models/HiLoTicketDetail";
import HiLoTicketDetailBaseItem from "../../../assets/games/hi-lo/view-models/HiLoTicketDetailBaseItem";
import HiLoTicketDetailItem from "../../../assets/games/hi-lo/view-models/HiLoTicketDetailItem";
import { mockFuntions } from "../../mocks/TestUtils";
jest.mock("../../../assets/common/GameUtils", () => ({
    default: class {
        public static createNodeFromPrefab() {
            return mockFuntions.createNodeFromPrefab();
        }
    }
}));

describe("HiLoTicketdetail", () => {
    let node: cc.Node;
    let comp: HiLoTicketDetail;
    beforeEach(() => {
        node = new cc.Node();
        comp = node.addComponent(HiLoTicketDetail);
        comp.content = new cc.Node();
        comp.scrollView = node.addComponent(cc.ScrollView);
        comp.detailTable = new cc.Node();
        comp.roundId = node.addComponent(cc.Label);

        mockFuntions.createNodeFromPrefab = () => {
            const node = new cc.Node();
            HiLoTicketDetailItem.prototype.renderTicketDetailItem = jest.fn();
            node.addComponent(HiLoTicketDetailItem);
            return node;
        };
    });

    function createLogDetail(order) {
        return {
            amount: 50,
            betwin: 52.5,
            cards: [
                { suit: 0, rank: "K" },
                { suit: 3, rank: "3" }
            ],
            choice: "l",
            order,
            time: "2022-02-18T08:29:06.789Z"
        };
    }

    describe("updateContentTicketDetail", () => {
        let betLog: BetLog;

        beforeEach(() => {
            comp.renderDetailBase = jest.fn();

            betLog = {
                time: "2022-02-17T04:28:11.289Z",
                id: 1966,
                amount: 100,
                betwin: 233.44,
                betLogDetails: [createLogDetail(1)]
            };
        });

        it("should set roundId.string base on data", () => {
            // Arrange
            const expectedValue = "1966";

            // Act
            comp.updateContentTicketDetail(betLog);

            // Assert
            expect(comp.roundId.string).toStrictEqual(expectedValue);
        });
        it("should add start round to content", () => {
            // Arrange
            const actualValue = comp.content.getComponent(HiLoTicketDetailBaseItem);

            // Act
            comp.updateContentTicketDetail(betLog);

            // Assert
            expect(actualValue).toBeDefined();
        });
    });

    describe("calculateHeights", () => {
        describe("when contentHeight > this.maxHeightContent", () => {
            it("should set scrollView.node.height = maxHeightContent, set correct detailTable.height", () => {
                // Arrange
                const betLogDetails = [
                    createLogDetail(1),
                    createLogDetail(2),
                    createLogDetail(3),
                    createLogDetail(4),
                    createLogDetail(5),
                    createLogDetail(6),
                    createLogDetail(7),
                    createLogDetail(8),
                    createLogDetail(9),
                    createLogDetail(10)
                ];

                // Act
                comp.calculateHeights(betLogDetails);
                // Assert
                expect(comp.scrollView.node.height).toEqual(510);

                expect(comp.detailTable.height).toEqual(590);
            });
        });

        describe("when contentHeight = this.maxHeightContent", () => {
            beforeEach(() => {
                // Arrange
                const betLogDetails = [
                    createLogDetail(1),
                    createLogDetail(2),
                    createLogDetail(3),
                    createLogDetail(4),
                    createLogDetail(5),
                    createLogDetail(6),
                    createLogDetail(7),
                    createLogDetail(8)
                ];

                // Act
                comp.calculateHeights(betLogDetails);
            });

            it("should set scrollView.node.height = maxHeightContent", () => {
                // Assert
                expect(comp.scrollView.node.height).toEqual(510);
            });

            it("should set correct detailTable.height", () => {
                // Assert
                expect(comp.detailTable.height).toEqual(590);
            });
        });

        describe("when contentHeight < this.maxHeightContent", () => {
            beforeEach(() => {
                // Arrange
                const betLogDetails = [createLogDetail(1), createLogDetail(2), createLogDetail(3)];

                // Act
                comp.calculateHeights(betLogDetails);
            });

            it("should set scrollView.node.height = maxHeightContent", () => {
                // Assert
                expect(comp.scrollView.node.height).toEqual(260);
            });

            it("should set correct detailTable.height", () => {
                // Assert
                expect(comp.detailTable.height).toEqual(340);
            });
        });
    });

    describe("renderDetailBase", () => {
        it("should set Data to HiLoTicketDetailBaseItem", () => {
            // Arrange

            const spyFunction = jest.fn();
            mockFuntions.createNodeFromPrefab = () => {
                const node = new cc.Node();
                HiLoTicketDetailBaseItem.prototype.setData = spyFunction;
                node.addComponent(HiLoTicketDetailBaseItem);
                return node;
            };

            const betLog: BetLog = { time: "2022-02-17T04:28:11.289Z", id: 1966, amount: 100, betwin: 233.44, betLogDetails: [] };

            //Act
            comp.renderDetailBase(betLog, false);

            //Assert
            expect(spyFunction).toHaveBeenCalledWith(betLog, false);
        });
    });
});
