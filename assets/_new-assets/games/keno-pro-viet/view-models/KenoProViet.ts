import GameRoomBase from "../../_base/GameRoomBase";
import { GameState } from "../../_base/GameBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoProViet extends GameRoomBase {

    onLoad() {
        cc.RedT.inGame = this;
        this.loadMiniPanel();
        cc.game.on(cc.game.EVENT_HIDE, this.onGameHide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    stopGame() {
        this.gameState = GameState.Stopped;
    }

    closeGame() {
        if (this.loading) {
            this.loading.active = true;
        }
        cc.director.loadScene('MainGame');
    }

    onData(data: any) {
    }
}
