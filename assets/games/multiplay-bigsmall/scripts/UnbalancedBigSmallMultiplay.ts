import AudioManager from "../../../common/audio/AudioManager";
import MultiplayGame from "../../multiplay/scripts/MultiplayGame";
import BigSmallMultiplayScoreBoard from "./BigSmallMultiplayScoreBoard";
import UnbalancedBigSmall from "./UnbalancedBigSmall";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallMultiplay extends MultiplayGame {
    @property(cc.Node)
    compactGamesArea: cc.Node = null;

    @property(cc.Toggle)
    collapsedExpandButton: cc.Toggle = null;

    @property(cc.Prefab)
    scoreBoardPrefab: cc.Prefab = null;

    gameIds: number[] = [50, 51, 54, 55];

    constructor() {
        super();
        this.gameId = 50;
    }

    onEnable() {
        super.onEnable();
        this.collapsedExpandButton.isChecked = true;
        this.showCompactModeWithAnimation(false);
    }

    createSubGameUI(gameId: number, location: number): cc.Node {
        const node = super.createSubGameUI(gameId, location);
        const multiplaySingle = node.getComponent(UnbalancedBigSmall);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    createMainGameUI(gameId: number) {
        const node = super.createMainGameUI(gameId);
        const multiplaySingle = node.getComponent(UnbalancedBigSmall);
        multiplaySingle.setGameId(gameId);
        return node;
    }

    handleCompactMode() {
        this.collapsedExpandButton.isChecked ? this.showCompactModeWithAnimation() : this.hideCompactModeWithAnimation();
    }

    showCompactModeWithAnimation(isAnimated = true) {
        if (isAnimated) {
            cc.tween(this.compactGamesArea).to(0.3, { scale: 1 }, { easing: "sineOut" }).start();
        } else {
            this.compactGamesArea.scale = 1;
        }
    }

    hideCompactModeWithAnimation(isAnimated = true) {
        if (isAnimated) {
            cc.tween(this.compactGamesArea).to(0.2, { scale: 0 }, { easing: "sineIn" }).start();
        } else {
            this.compactGamesArea.scale = 0;
        }
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
