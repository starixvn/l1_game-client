import * as i18n from "i18n/runtime-scripts/LanguageData";
window.modules = { i18n };
import BlockchainCardVerificationItem from "../../../../../assets/games/blockchain-baccarat/components/card-list/view-models/BlockchainCardVerificationItem";
import { mockFuntions } from "../../../../mocks/TestUtils";

jest.mock("../../../../../assets/common/GameUtils", () => ({
    default: class {
        public static createNodeFromPrefab() {
            return mockFuntions.createNodeFromPrefab();
        }
    }
}));

jest.mock("i18n/runtime-scripts/LanguageData");
describe("Test class BlockchainCardVerificationItem", () => {
    let node: cc.Node;
    let cardVerificationItemComp: BlockchainCardVerificationItem;
    let comp: any;
    let hashValue: cc.Label;
    let numberKey: cc.Label;
    let highlightSuccess: cc.Node;
    let highlightFailed: cc.Node;
    let hintCopyNode: cc.Node;
    let rawValue: cc.RichText;
    let changeCard: cc.Button;
    let copyButton: cc.Button;
    let card: cc.Node;
    let tooltipNode: cc.Node;

    beforeAll(() => {
        node = new cc.Node();
        hashValue = new cc.Node().addComponent(cc.Label);
        numberKey = new cc.Node().addComponent(cc.Label);
        changeCard = new cc.Node().addComponent(cc.Button);
        copyButton = new cc.Node().addComponent(cc.Button);
        rawValue = new cc.Node().addComponent(cc.RichText);
        card = new cc.Node();
        tooltipNode = new cc.Node();
        hintCopyNode = new cc.Node();
        highlightFailed = new cc.Node();
        highlightSuccess = new cc.Node();
        cardVerificationItemComp = node.addComponent(BlockchainCardVerificationItem);
        cardVerificationItemComp.hashValue = hashValue;
        cardVerificationItemComp.rawValue = rawValue;
        cardVerificationItemComp.copyButton = copyButton;
        cardVerificationItemComp.numberKey = numberKey;
        cardVerificationItemComp.changeCard = changeCard;
        cardVerificationItemComp.card = card;
        cardVerificationItemComp.tooltipNode = tooltipNode;
        cardVerificationItemComp.hintCopyNode = hintCopyNode;
        cardVerificationItemComp.highlightFailed = highlightFailed;
        cardVerificationItemComp.highlightSuccess = highlightSuccess;
        comp = cardVerificationItemComp as any;

        const tooltip: any = {};
        cc.tween = () => tooltip;
        cc.tween().to = () => tooltip;
        cc.tween().start = () => tooltip;
    });

    it("resetHighLight should run expected", () => {
        // arrange
        i18n.t.mockReturnValueOnce("player").mockReturnValueOnce("banker").mockReturnValueOnce("last round");

        // act
        cardVerificationItemComp.resetHighLight();

        // assert
        expect(cardVerificationItemComp.highlightFailed.active).toBeFalsy();
        expect(cardVerificationItemComp.highlightSuccess.active).toBeFalsy();
    });

    describe("Test method setHashValue", () => {
        it("Case: ", () => {
            //Arrange
            const color = cc.Color.WHITE;
            const text = "0c6881877782095dd2992b67e77cc35578340a923836af89f78d34bba86349ce";
            const anyComp = cardVerificationItemComp as any;
            const setTextCopy = jest.spyOn(anyComp, "setTextCopy");

            // Act
            cardVerificationItemComp.setHashValue(text);

            // Assert
            expect(cardVerificationItemComp.hashValue.string).toEqual(text);
            expect(cardVerificationItemComp.hashValue.node.color).toEqual(color.fromHEX("#98b2e5"));
            expect(setTextCopy).toBeCalledWith(text);
        });
    });

    describe("Test method setHighLightSuccess", () => {
        it("Case: ", () => {
            //Arrange
            const color = cc.Color.WHITE;
            // Act
            cardVerificationItemComp.setHighLightSuccess();

            // Assert
            expect(cardVerificationItemComp.highlightSuccess.active).toBeTruthy();
            expect(cardVerificationItemComp.hashValue.node.color).toEqual(color.fromHEX("#59c467"));
        });
    });

    describe("Test method setHighLightFailed", () => {
        it("Case: ", () => {
            //Arrange
            const color = cc.Color.WHITE;
            // Act
            cardVerificationItemComp.setHighLightFailed();

            // Assert
            expect(cardVerificationItemComp.highlightFailed.active).toBeTruthy();
            expect(cardVerificationItemComp.hashValue.node.color).toEqual(color.fromHEX("#ff6161"));
        });
    });

    describe("Test method setTextCopy", () => {
        it("Case 1: ", () => {
            // Arrange
            const text = "kd34kj54kjy3kj43iss5458s457s";
            // Act
            cardVerificationItemComp.setTextCopy(text);

            // Assert
            expect(comp.textCopy).toEqual(text);
        });
    });

    describe("Test method showTooltip", () => {
        it("Case 1: should call hideTooltip", () => {
            //arrange
            const text = "";
            comp.tooltipNode.opacity = 255;
            const anyComp = cardVerificationItemComp as any;
            const hideTooltip = jest.spyOn(anyComp, "hideTooltip");
            // Act
            comp.showTooltip(text);

            // Assert
            expect(hideTooltip).toBeCalled();
        });

        it("Case 2: tooltipNode opacity equal 255", () => {
            //arrange
            const text = "";
            const valueLabel = new cc.Node().addComponent(cc.Label);
            comp.tooltipNode.addChild(valueLabel.node, 1, "content");
            // Act
            comp.showTooltip(text);

            // Assert
            expect(comp.tooltipNode.opacity).toEqual(255);
        });
    });

    describe("Test method enableCopyButton", () => {
        it("Case 1: enabled", () => {
            //arrange
            const btnActive = new cc.Node();
            comp.copyButton.node.addChild(btnActive, 1, "btn-active");

            const btnDisable = new cc.Node();
            comp.copyButton.node.addChild(btnDisable, 1, "btn-disable");
            // Act
            comp.enableCopyButton(true);

            // Assert
            expect(copyButton.interactable).toBeTruthy();
            expect(copyButton.node.getChildByName("btn-active").active).toBeTruthy();
            expect(copyButton.node.getChildByName("btn-disable").active).toBeFalsy();
        });

        it("Case 2: disable", () => {
            //arrange
            const btnActive = new cc.Node();
            comp.copyButton.node.addChild(btnActive, 1, "btn-active");

            const btnDisable = new cc.Node();
            comp.copyButton.node.addChild(btnDisable, 1, "btn-disable");
            // Act
            comp.enableCopyButton(false);

            // Assert
            expect(copyButton.interactable).toBeFalsy();
            expect(copyButton.node.getChildByName("btn-active").active).toBeFalsy();
            expect(copyButton.node.getChildByName("btn-disable").active).toBeTruthy();
        });
    });

    describe("Test method setNumberKey", () => {
        it("Case 1: ", () => {
            // Act
            cardVerificationItemComp.setNumberKey(1);

            // Assert
            expect(comp.numberKey.string).toEqual("002");
        });
    });
});
