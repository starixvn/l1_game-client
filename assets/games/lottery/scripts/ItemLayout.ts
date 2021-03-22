import GameUtils from "../../../common/GameUtils";
import LabelItem from "./LabelItem";
import { ChoiceType } from "./Lottery";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemLayout extends cc.Component {
    @property(cc.Layout)
    layout: cc.Layout = null;

    @property(cc.Prefab)
    numberItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    otherItemPrefab: cc.Prefab = null;

    updateItems(items: string[], isNumber: boolean) {
        this.layout.node.destroyAllChildren();
        const prefab = isNumber ? this.numberItemPrefab : this.otherItemPrefab;
        items.forEach((item) => {
            const node = cc.instantiate(prefab);
            this.layout.node.addChild(node);
            const label = node.getComponent(LabelItem);
            label.setValue(isNumber ? item : GameUtils.getBetChoiceString(item));
        });
    }
}
