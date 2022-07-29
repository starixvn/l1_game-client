import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import UnbalancedBigSmallScoreBoard from "./UnbalancedBigSmallScoreBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BigSmallMultiplayScoreBoard extends CommonDialog {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    scoreBoardPrefab: cc.Prefab = null;

    scoreboards: UnbalancedBigSmallScoreBoard[] = [];
    openGameCallback = (gameId) => {};

    onLoad() {
        super.onLoad();
        for (let i = 0; i < 4; i++) {
            const node = cc.instantiate(this.scoreBoardPrefab);
            this.content.addChild(node);
            const scoreBoard = node.getComponent(UnbalancedBigSmallScoreBoard);
            this.scoreboards.push(scoreBoard);
        }
        this.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    init(games: any) {
        Object.keys(games).forEach((gameId, index) => {
            const game = games[gameId];
            const scoreboard = this.scoreboards[index];
            scoreboard.init(game);
            scoreboard.openGameCallback = (gameId) => {
                this.openGameCallback(gameId);
                this.closeDialog();
            };
        });
    }
}
