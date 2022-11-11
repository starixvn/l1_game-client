import { Socket } from "socket.io-client";

import { lazyInject } from "../../Application";
import AudioManager from "../../common/audio/AudioManager";
import DraggableItem from "../../common/draggable-layout/view-models/DraggableItem";
import { MINI_GAMES_SCALE_ON_DESKTOP } from "../../common/GameUtils";
import SocketIOController from "../../SocketIOController";
import GameBase from "./GameBase";

export default class SocketIOMiniGameBase extends GameBase {
    @lazyInject(SocketIOController)
    public readonly socketIOController: SocketIOController;

    public socket: Socket;

    public isMiniGameInContainer = false;
    public isBetSound = true;

    onLoad() {
        super.onLoad();

        if (!this.isMiniGameInContainer) {
            if (!cc.sys.isMobile) {
                this.node.scale = MINI_GAMES_SCALE_ON_DESKTOP;
            }
            this.dragMiniGame();
        }
    }

    onEnable() {
        this.grantSocket();
        this.initSocketListenter();
        super.onEnable();
    }

    grantSocket() {
        this.socket = this.socketIOController.getSocketGame(this.gameId);
    }

    initSocketListenter() {
        if (this.socket) {
            this.socket.off(this.gameName).on(this.gameName, this.onData.bind(this));
            this.socket.on("disconnect", this.onDisconnected.bind(this));
        }
    }

    onDisconnected() {
        this.closeGame();
    }

    public registerViewGame() {
        this.socket && this.socket.connected && this.socket.emit("inGame");
    }

    closeGame() {
        if (!this.isAlive()) {
            return;
        }
        this.sendRetryMessage();
        this.socketIOController.closeSocket(this.gameId);
        this.showProcessingWarning(false);
        super.closeGame();
    }

    onData(data) {
        if (!this.isAlive()) {
            return;
        }
        super.onData(data);

        if (data.user) {
            cc.RedT.inGame.loadUserData(data.user);
            cc.RedT.userData(data.user);
        }

        if (data.history && this.historyComponent) {
            this.historyComponent.onData(data.history);
        }

        const apiError = data.apiError;
        if (apiError) {
            if (this.updateUserStakeLevel(apiError)) {
                this.showMiniWarningLimitBetChanged();
            }
        }

        if (data.userStakeLevel) {
            if (this.updateUserStakeLevel(data.userStakeLevel)) {
                this.showMiniWarningLimitBetChanged();
            }
        }

        !data.notice && this.currentMiniPanel.onGeneralData(data);
    }

    static adjustPosition(betBoard: any, node: any) {
        const okButtonPositionY = betBoard.okButton.node.parent.convertToWorldSpaceAR(betBoard.okButton.node.position).y;
        const expectPositionY = betBoard.okButton.node.height;
        const paddingBottom = 20;

        if (okButtonPositionY < expectPositionY) {
            const distance = expectPositionY - okButtonPositionY + paddingBottom;

            node.runAction(cc.moveBy(0.5, cc.v2(0, distance)).easing(cc.easeBackOut()));
        }
    }

    public onBetItemClick(e) {
        this.isBetSound && AudioManager.getInstance().playClick();
        if (!this.isReadyBet()) {
            return;
        }
        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        } else {
            this.lockBet();
            const betData = {
                amount: this.currentBet,
                betChoice: e.target.name,
                username: cc.RedT.user.name
            };

            this.socket && this.socket.connected && this.socket.emit("bet", betData);
        }
    }

    sendRetryMessage(): void {
        if (this.socket) {
            this.socket.emit("retry");
        }
    }

    dragMiniGame() {
        const draggableItem = this.getComponent(DraggableItem);
        if (draggableItem) {
            draggableItem.touchCallback.start = () => {
                this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
            };
        }
    }

    onDestroy() {
        super.onDestroy();
        const multiplayGame = this.socketIOController.isMultiplayGame(this.gameId);
        if (!multiplayGame) {
            this.socketIOController.closeSocket(this.gameId);
        }
    }
}
