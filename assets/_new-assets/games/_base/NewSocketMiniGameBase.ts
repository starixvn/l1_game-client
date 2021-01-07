import BaseSocketIOController from "../../BaseSocketIOController";
import GameBase from "./GameBase";

export default abstract class NewSocketMiniGameBase extends GameBase {
    public socket: SocketIOClient.Socket;
    abstract get gameId(): number;

    startGame() {
        super.startGame();
        this.socket = BaseSocketIOController.getInstance().gameSockets[this.gameId];

        if (this.socket) {
            this.socket.off(this.gameName).on(this.gameName, this.onData.bind(this));
            this.socket.off("disconnect").on("disconnect", this.closeGame.bind(this));
        }
    }

    protected registerViewGame() {
        this.socket && this.socket.connected && this.socket.emit("inGame");
    }

    closeGame() {
        BaseSocketIOController.getInstance().closeSocket(this.gameId);
        if (!this.node || !this.node.isValid) {
            return;
        }
        super.closeGame();
    }

    onSignIn() {
        if (!this.node.active) {
            return;
        }

        this.registerViewGame();
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
}
