import AudioManager from "../../../common/audio/AudioManager";
import MultiplayGame from "../../multiplay/scripts/MultiplayGame";
import MultiplayScoreBoard from "../../multiplay/scripts/MultiplayScoreBoard";
import MiniSedie from "./MiniSedie";
import { MiniSedie1Id, MiniSedie2Id, MiniSedie3Id, MiniSedie4Id } from "./MiniSedieConfigs";
import MiniSedieSubGame from "./MiniSedieSubGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieMultiplay extends MultiplayGame {
    @property(cc.Prefab)
    scoreBoardPrefab: cc.Prefab = null;

    gameIds: number[] = [MiniSedie1Id, MiniSedie2Id, MiniSedie3Id, MiniSedie4Id];

    constructor() {
        super();
        this.gameId = MiniSedie1Id;
    }

    createSubGameUI(gameId: number, location: number): cc.Node {
        const node = super.createSubGameUI(gameId, location);
        const multiplaySingle = node.getComponent(MiniSedieSubGame);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    addSubGameUI(gameId: number, location: number) {
        const subGameNode = super.addSubGameUI(gameId, location);
        const multiplaySingle = subGameNode.getComponent(MiniSedieSubGame);
        multiplaySingle.miniRoundHistory.tip.node.opacity = 0;
        multiplaySingle.isMainGame = false;
        return subGameNode;
    }

    createMainGameUI(gameId: number) {
        const node = super.createMainGameUI(gameId);
        const multiplaySingle = node.getComponent(MiniSedie);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    onScoreBoardClick() {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.scoreBoardPrefab);
        this.currentMiniPanel.addDialog(node);

        const scoreBoard = node.getComponent(MultiplayScoreBoard);
        scoreBoard.init(this.games);
        scoreBoard.openGameCallback = (gameId) => {
            this.switchGameToMain(gameId);
        };
    }
}
