import AudioManager from "../../../common/audio/AudioManager";
import MultiplayGame from "../../multiplay/scripts/MultiplayGame";
import MultiplayScoreBoard from "../../multiplay/scripts/MultiplayScoreBoard";
import MiniSedie, { KeyOpenScoreBoardStorage } from "./MiniSedie";
import { MiniSedie1Id } from "./MiniSedieConfigs";
import MiniSedieSubGame from "./MiniSedieSubGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniSedieMultiplay extends MultiplayGame {
    @property(cc.Prefab)
    scoreBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    bgShadow: cc.Node = null;

    gameIds: number[] = [MiniSedie1Id];

    constructor() {
        super();
        this.gameId = MiniSedie1Id;
    }

    onLoad() {
        super.onLoad();
        cc.sys.localStorage.setItem(KeyOpenScoreBoardStorage, "true");
    }

    onEnable() {
        super.onEnable();
        this.bgShadow.active = true;
    }

    createSubGameUI(gameId: number, location: number): cc.Node {
        const node = super.createSubGameUI(gameId, location);
        const multiplaySingle = node.getComponent(MiniSedieSubGame);
        multiplaySingle.setGameId(gameId);
        return node;
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

    handleCompactMode() {
        super.handleCompactMode();
        this.bgShadow.active = this.collapsedExpandButton.isChecked;
    }

    onCloseClick() {
        super.onCloseClick();
        cc.sys.localStorage.setItem(KeyOpenScoreBoardStorage, "true");
    }
}
