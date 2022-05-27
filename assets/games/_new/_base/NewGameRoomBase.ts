import SocketIOTableGameBase from "../../_base/SocketIOTableGameBase";
import SocketIOConnection from "../connection/SocketIOConnection";
import { GameData } from "./game-data-management/models/game-data";

const { ccclass } = cc._decorator;

@ccclass
export default class NewGameRoomBase extends SocketIOTableGameBase {
    protected connection: SocketIOConnection;
    public gameData: GameData<void>;

    onLoad() {
        super.onLoad();
        this.initConnection();
    }

    initConnection() {
        this.connection = new SocketIOConnection();
        this.connection.setSocket(this.socket, this.gameName);
    }

    onDataGameRoom(data: any) {
        super.onDataGameRoom(data);
        if (this.gameData) {
            this.gameData.receiveData(data);
        }
    }
}
