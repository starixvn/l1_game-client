import BetChips from "./BetChips";
import { ChipParams } from "./ChipFlyConfig";
import ChipViewNew from "./ChipViewNew";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BetChipsNew extends BetChips {
    @property(cc.Prefab)
    chipFlyPrefab: cc.Prefab = null;

    public createChipFly(value: number): cc.Node {
        const chip = cc.instantiate(this.chipFlyPrefab);
        const chipView = chip.getComponent(ChipViewNew);
        chipView.setColor(this.chipConfig.getChipColor(value));
        chipView.setValue(value);
        const index = this.chipValues.findIndex((chipValue) => chipValue === value);
        chipView.setType(this.getChipDisplayType(index));
        return chip;
    }

    protected setSizeLowValueChip(node: cc.Node) {
        node.scaleX = ChipParams.scaleX;
        node.scaleY = ChipParams.scaleYEnd;
    }
}
