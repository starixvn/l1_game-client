import { lazyInject } from "../../Application";
import SocketIOController from "../../SocketIOController";
import MiniPanel from "./MiniPanel";

export default class MiniPanelSocketIOInitializers {
    @lazyInject(SocketIOController)
    protected readonly socketIOController: SocketIOController;

    constructor(protected readonly main: MiniPanel) {}

    public handleSocket(socket, gameId) {
        socket.on("message", (data) => {
            if (data.um) {
                this.socketIOController.closeSocket(gameId);
                if (data.um_message) {
                    this.main.handleUmMessage(data.um_message, gameId);
                }
            }
            if (!this.main.isAlive()) {
                return;
            }

            this.main.onGeneralData(data);
        });

        socket.on("forceDisconnect", () => {
            socket.disconnect();
        });
    }
}
