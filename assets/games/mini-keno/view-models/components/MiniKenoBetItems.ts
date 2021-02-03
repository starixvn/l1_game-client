import BetItem from "../../../_base/view-models/BetItem";
import MiniKeno from "../MiniKeno";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoBetItems extends cc.Component {
    @property({ type: BetItem })
    betItems: BetItem[] = [];

    private root: MiniKeno;

    init(root: MiniKeno) {
        this.root = root;
    }

    onLoad() {}
}
