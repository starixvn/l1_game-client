import BaseSocketIOController from "../../BaseSocketIOController";
import { gameIds } from "../../Configs";
import GameBase from "./GameBase";

export default abstract class NewSocketMiniGameBase extends GameBase {
  protected socket: SocketIOClient.Socket;
  abstract get gameId(): number;

  startGame() {
    super.startGame();
    this.socket = BaseSocketIOController.getInstance().gameSockets[
      gameIds.SpecialSeDie
    ];

    this.socket.on(this.gameName, this.onData.bind(this));
    this.socket.on('disconnect', this.closeGame.bind(this));
  }

  protected registerViewGame() {
    this.socket.emit('inGame');
  }

  closeGame() {
    super.closeGame();
    BaseSocketIOController.getInstance().closeSocket(gameIds.SpecialSeDie);
  }

  onSignIn() {
    if (!this.node.active) {
      return;
    }

    this.registerViewGame();
  }

  onBetItemClick(event) {
    if (this.isDisableGame) {
      return;
    }

    if (this.waitingProcessing) {
      this.showProcessingWarning(true);
    } else {
      this.waitingProcessing = true;
      const betData = {
        amount: this.currentBet,
        betChoice: event.target.name,
      };
      this.socket && this.socket.emit('bet', betData);
    }
  }
}
