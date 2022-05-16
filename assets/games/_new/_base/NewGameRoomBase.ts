import MultiOrientationGame from "../../_base/MultiOrientationGame";
import SocketIOConnection from "../connection/SocketIOConnection";

const { ccclass } = cc._decorator;

@ccclass
export default class NewGameRoomBase extends MultiOrientationGame {
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
