import { lazyInject } from "../../Application";
import DraggableItem from "../../common/draggable-layout/view-models/DraggableItem";
import SocketIOController from "../../SocketIOController";
import GameBase from "./GameBase";

export default abstract class SocketIOMiniGameBase extends GameBase {
    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    public socket: SocketIOClient.Socket;
    abstract get gameId(): number;

    onLoad() {
        super.onLoad();

        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }

        const draggableItem = this.getComponent(DraggableItem);
        draggableItem.touchCallback.start = (node) => {
            this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
        };
    }

    startGame() {
        super.startGame();
        this.socket = this.socketIOController.gameSockets[this.gameId];

        if (this.socket) {
            this.socket.off(this.gameName).on(this.gameName, this.onData.bind(this));
            this.socket.off("disconnect").on("disconnect", this.closeGame.bind(this));
        }
    }

    protected registerViewGame() {
        this.socket && this.socket.connected && this.socket.emit("inGame");
    }

    closeGame() {
        if (!this.node || !this.node.isValid) {
            return;
        }
        this.sendRetryMessage();
        this.socketIOController.closeSocket(this.gameId);
        this.showProcessingWarning(false);
        super.closeGame();
    }

    onData(data) {
        if (!this.node || !this.node.isValid) {
            return;
        }
        super.onData(data);

        if (data.user) {
            cc.RedT.inGame.loadUserData(data.user);
            cc.RedT.userData(data.user);
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
        cc.RedT.audio.playClick();
        if (this.isDisableGame || !this.gameConfigs) {
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
