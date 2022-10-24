import BetChips from "../../../common/bet-chips/view-models/BetChips";
import ChipStack from "../../../common/chip-stack/views/ChipStack";
import GameUtils from "../../../common/GameUtils";
const { ccclass, property } = cc._decorator;

@ccclass
export default class FruitSlotChips extends cc.Component {
    private readonly chipScaleX = 0.5;
    private readonly chipScaleY = 0.75 * this.chipScaleX;
    updateChipStackTween: cc.Tween;
    winningEffect: cc.Node;
    chipThick = 10;

    public createChip(betChips: BetChips, amount: number): cc.Node {
        return betChips.createSmallChip(amount, 1, true);
    }

    public convertAndCreateChipStack(betAmount: number, betChips: BetChips) {
        const values = this.convertChips(betAmount, betChips.chipValues);
        return this.createChipStack(values, betChips);
    }

    convertChips(betAmount, chipValues) {
        return GameUtils.getChipQuantity(betAmount, chipValues);
    }

    createChipStack(chipQuantity, betChips: BetChips): cc.Node {
        const node = new cc.Node();
        node.scaleX = this.chipScaleX;
        node.scaleY = this.chipScaleY;

        const chipStack = node.addComponent(ChipStack);
        chipStack.chipSize = 26;
        chipStack.thickness = this.chipThick;

        const keys = Object.keys(chipQuantity).sort((a, b) => +b - +a);
        let firstChip = true;
        // keys.forEach((chip) => {
        //     if (+chip > 0) {
        //         const count = chipQuantity[chip];
        //         for (let i = 0; i < count; i++) {
        //             const chipNode = this.createChip(betChips, +chip);
        //             chipStack.addChip(chipNode);
        //         }
        //     }
        // });

        return node;
    }

    public flyChipToBetPlace(betChips: BetChips, destNode: cc.Node, betAmount: number, totalAmount: number) {
        if (!betAmount) {
            return;
        }

        const chipNode = this.createChip(betChips, betAmount);
        chipNode.scaleX = this.chipScaleX;
        chipNode.scaleY = this.chipScaleY;
        const startNode = betChips.getChipNode(betAmount) || betChips.node;
        chipNode.position = cc.v3(destNode.convertToNodeSpaceAR(startNode.convertToWorldSpaceAR(cc.v2(0, 0))));
        destNode.addChild(chipNode);

        let destPosition = cc.v2(0, 0);
        const isHasAnyChip = destNode.childrenCount > 0;
        if (isHasAnyChip) {
            const stack = destNode.getComponentInChildren(ChipStack);
            const stackCount = stack ? stack.getChipNumber() : 0;
            const chipNumber = stack ? stackCount + destNode.childrenCount - 2 : destNode.childrenCount - 1;
            destPosition = cc.v2(0, chipNumber * this.chipThick * this.chipScaleY);
        }

        const jumpChipDuration = 0.3;
        chipNode.runAction(cc.jumpTo(jumpChipDuration, destPosition, 50, 1));
        this.updateChipStackTween && this.updateChipStackTween.stop();
        this.updateChipStackTween = cc
            .tween(chipNode)
            .delay(jumpChipDuration)
            .call(() => {
                const chipsQuantity = this.convertChips(totalAmount, betChips.chipValues);
                this.updateChipStack(betChips, destNode, chipsQuantity);
            })
            .start();
    }

    public updateChipStack(betChips: BetChips, destNode: cc.Node, chipsQuantity: []) {
        destNode.destroyAllChildren();
        const chipStack = this.createChipStack(chipsQuantity, betChips);
        chipStack.zIndex = -1;
        destNode.addChild(chipStack);
    }
}
