import AudioManager from "../../../common/audio/AudioManager";
import MultiplayGame from "../../multiplay/scripts/MultiplayGame";
import BigSmallMultiplayScoreBoard from "./BigSmallMultiplayScoreBoard";
import UnbalancedBigSmall from "./UnbalancedBigSmall";
import { UnbalancedBigSmall1Id, UnbalancedBigSmall2Id, UnbalancedBigSmall3Id, UnbalancedBigSmall4Id } from "./UnbalancedBigSmallConfig";
import UnbalancedBigSmallSubGame from "./UnbalancedBigSmallSubGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallMultiplay extends MultiplayGame {
    @property(cc.Prefab)
    scoreBoardPrefab: cc.Prefab = null;

    gameIds: number[] = [UnbalancedBigSmall1Id, UnbalancedBigSmall2Id, UnbalancedBigSmall3Id, UnbalancedBigSmall4Id];

    constructor() {
        super();
        this.gameId = UnbalancedBigSmall1Id;
    }

    createSubGameUI(gameId: number, location: number): cc.Node {
        const node = super.createSubGameUI(gameId, location);
        const multiplaySingle = node.getComponent(UnbalancedBigSmallSubGame);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    createMainGameUI(gameId: number) {
        const node = super.createMainGameUI(gameId);
        const multiplaySingle = node.getComponent(UnbalancedBigSmall);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    onScoreBoardClick() {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.scoreBoardPrefab);
        this.currentMiniPanel.addDialog(node);

        const scoreBoard = node.getComponent(BigSmallMultiplayScoreBoard);
        scoreBoard.init(this.games);
        scoreBoard.openGameCallback = (gameId) => {
            this.switchGameToMain(gameId);
        };
    }
}
