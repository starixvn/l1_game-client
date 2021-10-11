import { lazyInject } from "../../Application";
import AudioManager from "../../common/audio/AudioManager";
import DraggableItem from "../../common/draggable-layout/view-models/DraggableItem";
import SabaConfigs = require("../../configs/SabaConfigs");
import SocketIOController from "../../SocketIOController";
import GameBase from "./GameBase";

export default abstract class SocketIOMiniGameBase extends GameBase {
    @lazyInject(SocketIOController)
    public readonly socketIOController: SocketIOController;

    public socket: SocketIOClient.Socket;

    public isMiniGameInContainer = false;

    onLoad() {
        super.onLoad();

        if (!this.isMiniGameInContainer) {
            if (!cc.sys.isMobile) {
                this.node.scale = SabaConfigs.desktopMiniGameScale;
            }

            const draggableItem = this.getComponent(DraggableItem);
            draggableItem.touchCallback.start = (node) => {
                this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
            };
        }
    }

    startGame() {
        super.startGame();
        this.grantSocket();
        this.initSocketListenter();
    }

    grantSocket() {
        this.socket = this.socketIOController.getSocketGame(this.gameId);
    }

    initSocketListenter() {
        if (this.socket) {
            this.socket.off(this.gameName).on(this.gameName, this.onData.bind(this));
            this.socket.off("disconnect").on("disconnect", this.onDisconnected.bind(this));
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
        AudioManager.getInstance().playClick();
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

    sendRetryMessage() {
        if (this.socket) {
            this.socket.emit("retry");
        }
    }
}
