import GameUtils from "../../../common/GameUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SocketIOHistoryItemBase extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property({
        type: cc.Node,
        visible: function () {
            return !this.enablePF;
        }
    })
    bg: cc.Node = null;

    @property({ readonly: true })
    enablePF: boolean;

    constructor() {
        super();
        this.enablePF = false;
    }

    start() {
        GameUtils.setFontSizeLabelsInNode(this.node);
    }

    setBackground(index: number) {
        this.bg.active = index % 2 > 0;
    }
}
