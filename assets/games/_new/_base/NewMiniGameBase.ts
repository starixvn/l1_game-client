import SocketIOMiniGameBase from "../../_base/SocketIOMiniGameBase";
import SocketIOConnection from "../connection/SocketIOConnection";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewMiniGameBase extends SocketIOMiniGameBase {
    protected connection: SocketIOConnection;

    onLoad() {
        super.onLoad();
        this.initConnection();
    }

    initConnection() {
        this.connection = new SocketIOConnection();
        this.connection.setSocket(this.socket, this.gameName);
    }
}
