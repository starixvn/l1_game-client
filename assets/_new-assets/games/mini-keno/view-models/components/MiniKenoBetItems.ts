import MiniKeno from "../MiniKeno";
import BetItem from "../../../_base/BetItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoBetItems extends cc.Component {
    @property({ type: BetItem })
    betItems: BetItem[] = [];

    private root: MiniKeno;

    init(root: MiniKeno) {
        this.root = root;
    }

    onLoad() {

    }
}
