import BetItem from "../../_base/BetItem";
import BlinkNode from "../../../common/BlinkNode";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BaccaratBetItem extends BetItem {
    public resetHighlight() {
        this.highlight.active = false;
        this.highlightBackground && (this.highlightBackground.active = false);
    }
}
