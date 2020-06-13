const { ccclass, property } = cc._decorator;

import GameHistoryBase from "../../_base/GameHistoryBase";

@ccclass
export default class MiniKenoHistory extends GameHistoryBase {

    @property(cc.Prefab)
    prefabItem: cc.Prefab = null;

    onData(data) {

    }
}
