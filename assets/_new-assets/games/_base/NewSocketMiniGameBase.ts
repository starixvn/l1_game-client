import BaseSocketIOController from "../../BaseSocketIOController";
import GameBase from "./GameBase";

export default abstract class NewSocketMiniGameBase extends GameBase {
  protected socket: SocketIOClient.Socket;
  abstract get gameId(): number;

  startGame() {
    super.startGame();
    this.socket = BaseSocketIOController.getInstance().gameSockets[this.gameId];

    if (this.socket) {
      this.socket.on(this.gameName, this.onData.bind(this));
      this.socket.on('disconnect', this.closeGame.bind(this));
    }
  }

  protected registerViewGame() {
    this.socket.emit('inGame');
  }

  closeGame() {
    super.closeGame();
    BaseSocketIOController.getInstance().closeSocket(this.gameId);
  }

  onSignIn() {
    if (!this.node.active) {
      return;
    }

    this.registerViewGame();
  }
}
