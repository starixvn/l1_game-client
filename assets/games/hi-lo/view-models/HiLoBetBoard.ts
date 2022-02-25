import BetChips from "../../../common/bet-chips/view-models/BetChips";
import HiLoBetChipItem from "./HiLoBetChipItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class HiLoBetBoard extends BetChips {
    @property(cc.Node)
    disableLayer: cc.Node = null;

    @property(cc.Prefab)
    numberBetPrefab: cc.Prefab = null;

    disableBetBoard(status: boolean) {
        this.disableLayer.active = status;
        this.leftButton.active = !status;
        this.rightButton.active = !status;
        if (this.selectedIndex <= 0) {
            this.leftButton.active = false;
        }
    }

    createChipNode(value: number): cc.Node {
        const node = cc.instantiate(this.numberBetPrefab);
        node.getComponent(HiLoBetChipItem).renderBetChipItem(value);
        return node;
    }

    updateSelectedBet(targetName: string) {
        this.chips.children.forEach((chip) => {
            const isSelected = targetName === chip.name;
            chip.getComponent(HiLoBetChipItem).setSelectedBg(isSelected);
        });
    }

    highlightChip(chip: cc.Node, highlight: boolean) {
        chip.getComponent(HiLoBetChipItem).setSelectedBg(highlight);
    }

    setNeedResetCurrentChip(status: boolean) {
        this.needResetCurrentChip = status;
    }
}
