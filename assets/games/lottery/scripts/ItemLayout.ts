import GameUtils from "../../../common/GameUtils";
import LabelItem from "./LabelItem";
import { ChoiceType } from "./Lottery";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ItemLayout extends cc.Component {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    numberItemPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    otherItemPrefab: cc.Prefab = null;

    updateItems(items: string[], isNumber: boolean, maskContainer: cc.Node) {
        this.content.destroyAllChildren();
        const prefab = isNumber ? this.numberItemPrefab : this.otherItemPrefab;
        items.forEach((item, index) => {
            const node = cc.instantiate(prefab);
            this.content.addChild(node);
            if (maskContainer) {
                node.position = maskContainer.children[index].position;
            }

            const label = node.getComponent(LabelItem);
            label.setValue(isNumber ? item : GameUtils.getBetChoiceString(item));
        });
    }
}
