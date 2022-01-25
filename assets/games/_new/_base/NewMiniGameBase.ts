import GameUtils from "../../../common/GameUtils";
import SocketIOMiniGameBase from "../../_base/SocketIOMiniGameBase";
import SocketIOConnection from "../connection/SocketIOConnection";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewMiniGameBase extends SocketIOMiniGameBase {
    protected connection: SocketIOConnection;

    startGame() {
        super.startGame();
        this.initConnection();
    }

    start() {
        cc.game.on(cc.game.EVENT_SHOW, this.onEnable, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onDisable, this);
    }

    initConnection() {
        this.connection = new SocketIOConnection();
        this.connection.setSocket(this.socket, this.gameName);
    }

    protected initHandlers() {
        super.initHandlers();
        this.timeHandler = null;
    }
}
