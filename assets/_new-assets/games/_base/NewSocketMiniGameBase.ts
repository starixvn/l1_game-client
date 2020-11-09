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
      this.socket.off('disconnect').on('disconnect', this.closeGame.bind(this));
    }
  }

  protected registerViewGame() {
    this.socket && this.socket.connected && this.socket.emit('inGame');
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
}
