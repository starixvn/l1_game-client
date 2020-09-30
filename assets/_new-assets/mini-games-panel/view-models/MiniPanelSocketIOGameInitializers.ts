import { buildServerUrl } from "../.././common/helpers/UrlHelper";
import BaseSocketIOController from "../../BaseSocketIOController";
import * as authManager from "./../../common/auth/AuthManager";
import * as configs from "./../../Configs";
import * as SabaConfigs from "./../../SabaConfigs";
import MiniPanel from "./MiniPanel";

export default class MiniPanelSocketIOGameInitializers {
    constructor(private main: MiniPanel) {
    }

    public openGame(gameId) {
        cc.RedT.audio.playClick();
        this.main.popupMiniGame.hideListGame();

        if (this.main.currentGameRoomId == gameId) {
            return;
        }

        this.main.loading.node.active = true;
        cc.RedT.inGame.outRoomGame().then(() => {
            authManager.removeInRoomGameId();
            this.openNewSocket(gameId);
        });
    }

    private openNewSocket(gameId) {
        const socketIoController = BaseSocketIOController.getInstance();
        socketIoController.closeSocket(gameId).then(() => {
            const key = Object.keys(SabaConfigs.games).find(key => SabaConfigs.games[key].id === gameId);
            const gameName = SabaConfigs.games[key].name;
            const proxyRoute = configs.serverGameEndPoints[gameId].proxyRoute;
            const gameServerUrl = buildServerUrl(configs.ssl, "http", "", gameId);
            const socket = socketIoController.connectGameSocket(gameServerUrl, gameName, proxyRoute, this.main.onConnectSocketFailed.bind(this.main));
            socket.on('message', (data) => {
                this.main.loading.node.active = false;
                if (data.um) {
                    socketIoController.closeSocket(gameId);
                }

                this.main.onGeneralData(data);
            });

            socket.on('forceDisconnect', () => {
                socket.disconnect();
            })

            socketIoController.gameSockets[gameId] = socket;
        });
    }
}
