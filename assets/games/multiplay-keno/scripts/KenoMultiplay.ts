import MultiplayGameHistory from "../../multiplay/scripts/MultiplayGameHistory";
import MultiplayTableGame from "../../multiplay/scripts/MultiplayTableGame";
import MegaKeno from "./MegaKeno";
import {
    MegaKeno1Id,
    MegaKeno2Id,
    MegaKeno3Id,
    MegaKeno4Id,
    MegaKeno5Id,
    MegaKeno6Id,
    MegaKeno7Id,
    MegaKeno8Id,
} from "./MegaKenoConfig";
import MegaKenoGuide from "./MegaKenoGuide";
import MegaKenoSubGame from "./MegaKenoSubGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoMultiplay extends MultiplayTableGame {
    gameIds: number[] = [MegaKeno1Id, MegaKeno2Id, MegaKeno3Id, MegaKeno4Id, MegaKeno5Id, MegaKeno6Id, MegaKeno7Id, MegaKeno8Id];

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    @property(cc.Node)
    bottomSubGameBg: cc.Node = null;

    private sizeSubGame = 150;

    onLoad() {
        super.onLoad();
    }

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
        super.openHistory();
        const dialog = cc.instantiate(this.historyPrefab);
        this.currentMiniPanel.addDialog(dialog);
        const control = dialog.getComponent(MultiplayGameHistory);
        control.initDefaultGame(this.gameId);
    }

    openGuide() {
        super.openGuide();
        const dialog = cc.instantiate(this.guidePrefab);
        this.currentMiniPanel.addDialog(dialog);
        const guide = dialog.getComponent(MegaKenoGuide);
        guide.games = this.games;
    }

    checkHandleScroll() {
        const offset = this.scrollView.getScrollOffset();
        const offsetEnableSubGameBg = this.scrollView.getMaxScrollOffset().y - this.sizeSubGame;
        this.bottomSubGameBg.active = offset.y < offsetEnableSubGameBg ? true : false;
    }
}
