import MultiplayGameHistory from "../../multiplay-bigsmall/scripts/MultiplayGameHistory";
import MultiplayTableGame from "../../multiplay/scripts/MultiplayTableGame";
import MegaKeno from "./MegaKeno";
import { MegaKeno1Id, MegaKeno2Id, MegaKeno3Id, MegaKeno4Id, MegaKeno5Id, MegaKeno6Id, MegaKeno7Id, MegaKeno8Id } from "./MegaKenoConfig";
import MegaKenoSubGame from "./MegaKenoSubGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoMultiplay extends MultiplayTableGame {
    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    gameIds: number[] = [MegaKeno1Id, MegaKeno2Id, MegaKeno3Id, MegaKeno4Id, MegaKeno5Id, MegaKeno6Id, MegaKeno7Id, MegaKeno8Id];

    constructor() {
        super();
        this.gameId = MegaKeno1Id;
    }

    createSubGameUI(gameId: number, location: number): cc.Node {
        const node = super.createSubGameUI(gameId, location);
        const multiplaySingle = node.getComponent(MegaKenoSubGame);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    createMainGameUI(gameId: number) {
        const node = super.createMainGameUI(gameId);
        const multiplaySingle = node.getComponent(MegaKeno);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    openHistory() {
        const dialog = cc.instantiate(this.historyPrefab);
        this.currentMiniPanel.addDialog(dialog);
        const control = dialog.getComponent(MultiplayGameHistory);
        control.handleSocketFromGame(this.gameId);
    }
}
