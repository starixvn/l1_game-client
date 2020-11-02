import RoomPlayer from "../../_base/RoomPlayer";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TopControls extends cc.Component {
    @property({ type: RoomPlayer })
    players: RoomPlayer[] = [];

    @property({ type: cc.Node })
    otherPlayers: cc.Node = null;
}
