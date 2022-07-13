import SocketIOMiniGameBase from "../../_base/SocketIOMiniGameBase";
import SocketIOConnection from "../connection/SocketIOConnection";
import { GameData } from "./game-data-management/models/game-data";

export default class NewMiniGameBase extends SocketIOMiniGameBase {
    protected connection: SocketIOConnection;
    public gameData: GameData<void>;

    startGame() {
        super.startGame();
        this.initConnection();
    }

    initConnection() {
        this.connection = new SocketIOConnection();
        this.connection.setSocket(this.socket, this.gameName);
    }

    onData(data: unknown) {
        super.onData(data);

        if (this.gameData) {
            this.gameData.receiveData(data);
        }
    }
}
