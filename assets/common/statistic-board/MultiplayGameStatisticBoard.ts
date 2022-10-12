import {
    MegaKeno1Id,
    MegaKeno2Id,
    MegaKeno3Id,
    MegaKeno4Id,
    MegaKeno5Id,
    MegaKeno6Id,
    MegaKeno7Id,
    MegaKeno8Id,
} from "../../games/multiplay-keno/scripts/MegaKenoConfig";
import CommonDialog from "../_base/view-models/CommonDialog";
import MultipleStatisticBoard from "./MultipleStatisticBoard";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiplayGameStatisticBoard extends CommonDialog {
    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Prefab)
    scoreBoardPrefab: cc.Prefab = null;

    statisticBoards: MultipleStatisticBoard[] = [];
    openGameCallback = (gameId) => {};

    onLoad() {
        super.onLoad();

        this.addOnDidHide(() => {
            this.node.destroy();
        });
    }

    init(games: any) {
        const gameIds = [MegaKeno1Id, MegaKeno3Id, MegaKeno2Id, MegaKeno4Id, MegaKeno5Id, MegaKeno7Id, MegaKeno6Id, MegaKeno8Id];
        gameIds.forEach((gameId) => {
            const node = cc.instantiate(this.scoreBoardPrefab);
            this.content.addChild(node);
            const statisticBoard = node.getComponent(MultipleStatisticBoard);
            this.statisticBoards.push(statisticBoard);

            const game = games[gameId];
            statisticBoard.init(game);
            statisticBoard.openGameCallback = (gameId) => {
                this.openGameCallback(gameId);
                this.closeDialog();
            };
        });
    }
}
