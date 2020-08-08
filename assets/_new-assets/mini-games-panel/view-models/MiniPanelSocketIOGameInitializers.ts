import BaseSocketIOController from '../../BaseSocketIOController';
import * as authManager from './../../common/auth/AuthManager';
import * as configs from './../../Configs';
import MiniPanel from './MiniPanel';

export default class MiniPanelSocketIOGameInitializers {
    constructor(private main: MiniPanel) {
    }

    public openGame(gameId) {
        cc.RedT.audio.playClick();
        cc.RedT.inGame.loading.active = true;

        cc.RedT.inGame.outRoomGame().then(() => {
            authManager.removeInRoomGameId();
            this.openNewSocket(gameId);
        });

        this.main.popupMiniGame.hideListGame();
    }

    private openNewSocket(gameId) {
        const socketIoController = BaseSocketIOController.getInstance();
        socketIoController.closeSocket(gameId).then(() => {
            const gameName = configs.gameNames[gameId];
            const socket = socketIoController.connectGameSocket(configs.gameSocketUris[gameId], gameName, this.main.onConnectSocketFailed.bind(this.main));
            socket.on('message', (data) => {
                if (data.um) {
                    socketIoController.closeSocket(gameId);
                }

                this.main.onGeneralData(data);
            });
            socketIoController.gameSockets[gameId] = socket;
        });
    }
}