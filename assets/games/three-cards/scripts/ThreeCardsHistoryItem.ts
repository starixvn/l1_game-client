import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { ThreeCardsBetData } from "./DataDefinition";

const { ccclass, property } = cc._decorator;

@ccclass
export default class ThreeCardsHistoryItem extends cc.Component {
    labels: cc.Label[] = [];

    onLoad() {
        this.node.children.forEach((child) => {
            const label = child.getComponent(cc.Label);
            if (label) {
                this.labels.push(label);
            }
        });
    }

    setData(betData: ThreeCardsBetData) {
        Object.keys(betData).forEach((key) => {
            const data = betData[key];
            this.labels.find((label) => label.node.name === key).string = numberWithCommas(data);
        });
    }
}
