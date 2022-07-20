import MultiplayGame from "../../multiplay/scripts/MultiplayGame";
import UnbalancedBigSmall from "./UnbalancedBigSmall";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UnbalancedBigSmallMultiplay extends MultiplayGame {
    gameIds: number[] = [50, 51, 54, 55];
    constructor() {
        super();
        this.gameId = 50;
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
}
