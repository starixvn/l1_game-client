import HiLoBetBoard from "../../../assets/games/hi-lo/view-models/HiLoBetBoard";
import HiLoBetChipItem from "../../../assets/games/hi-lo/view-models/HiLoBetChipItem";
import { mockFuntions } from "../../mocks/TestUtils";

jest.mock("../../../assets/common/GameUtils", () => ({
    default: class {
        public static createNodeFromPrefab() {
            return mockFuntions.createNodeFromPrefab();
        }
    }
}));

function createChipList() {
    const chips = new cc.Node();
    const chip = new cc.Node();
    chip.name = "1";
    chip.addComponent(HiLoBetChipItem);
    chips.addChild(chip);
    return chips;
}
describe("HiLoBetBoard", () => {
    let node: cc.Node;
    let comp: HiLoBetBoard;
    beforeAll(() => {
        node = new cc.Node();
        comp = node.addComponent(HiLoBetBoard);
        comp.disableLayer = new cc.Node();
        comp.leftButton = new cc.Node();
        comp.rightButton = new cc.Node();
        mockFuntions.createNodeFromPrefab = () => {
            const node = new cc.Node();
            //HiLoBetChipItem.prototype.setSelectedBg = jest.fn();
            node.addComponent(HiLoBetChipItem);
            return node;
        };
        comp.chips = createChipList();
    });
    describe("disableBetBoard", () => {
        it("should active bet board", () => {
            //Arrange
            const status = false;
            comp.selectedIndex = 1;

            //Act
            comp.disableBetBoard(status);

            //Assert
            expect(comp.disableLayer.active).toEqual(status);
            expect(comp.leftButton.active).toEqual(true);
            expect(comp.rightButton.active).toEqual(true);
        });

        it("should disable bet board", () => {
            //Arrange
            const status = true;
            comp.selectedIndex = 1;

            //Act
            comp.disableBetBoard(status);

            //Assert
            expect(comp.disableLayer.active).toEqual(status);
            expect(comp.leftButton.active).toEqual(!status);
            expect(comp.rightButton.active).toEqual(!status);
        });
    });

    describe("updateSelectedBet", () => {
        it("should called setSelectedBg function", () => {
            // Arrange
            const fnBetChip = jest.fn();
            HiLoBetChipItem.prototype.setSelectedBg = fnBetChip;
            const targetName = "1";

            // Act
            comp.updateSelectedBet(targetName);

            // Assert
            expect(HiLoBetChipItem.prototype.setSelectedBg).toBeCalledWith(true);
        });
    });

    describe("createChipNode", () => {
        it("should called renderBetChipItem function", () => {
            // Arrange
            const fnBetChip = jest.fn();
            HiLoBetChipItem.prototype.renderBetChipItem = fnBetChip;
            const value = 1;

            // Act
            comp.createChipNode(value);

            //Assert
            expect(fnBetChip).toBeCalledWith(value);
        });
    });
});
