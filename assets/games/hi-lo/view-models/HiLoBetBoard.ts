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

    createChips() {
        this.chipList.forEach((chip) => chip.destroy());
        this.chipList = [];
        this.chipValues.forEach((value) => {
            const node = cc.instantiate(this.numberBetPrefab);
            node.getComponent(HiLoBetChipItem).renderBetChipItem(value);
            this.chips.addChild(node);
            node.on("click", this.onClickBet.bind(this));
            this.chipList.push(node);
        });

        const layout = this.chips.getComponent(cc.Layout);
        layout.enabled = true;
        layout.updateLayout();
        layout.enabled = false;
    }

    updateSelectedBet(targetName: string) {
        this.chips.children.forEach((chip) => {
            const isSelected = targetName === chip.name ? true : false;
            chip.getComponent(HiLoBetChipItem).setSelectedBg(isSelected);
        });
    }
}
