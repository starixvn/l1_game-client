const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKenoProVietRoundsSelection extends cc.Component {
    @property(cc.Node)
    layout: cc.Node = null;

    @property(cc.Node)
    roundNode: cc.Node = null;

    setData(rounds: []) {

    }
}
