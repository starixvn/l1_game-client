import * as socketIo from 'socket.io-client';
import { getSession } from './common/auth/AuthManager';
import logger from './common/logger';

export default class BaseSocketIOController {
  private static instance: BaseSocketIOController;
  public gameSockets = {};

  public static getInstance(): BaseSocketIOController {
    if (!this.instance) {
      this.instance = new BaseSocketIOController();
    }

    return this.instance;
  }

  connectGameSocket = (socketUri: string, gameName: string, onConnectFailed: (gameName) => void): SocketIOClient.Socket => {
    const socket = socketIo(socketUri);

    socket.on('connect', () => {
      socket.emit('signin', getSession());
    });

    socket.on('connect_failed', () => {
      logger().logError("Sedie connect failed");
      socket.disconnect();
      onConnectFailed(gameName);
    });

    socket.on('connect_error', (error) => {
      logger().logError("Sedie connect error" + error);
      socket.disconnect();
      onConnectFailed(gameName);
    });

    socket.on('disconnect', (reason) => {
      logger().log(reason);
    });

    return socket;
  };

  closeAllSocket() {
    console.log('closeAllSocket');
    const keys = Object.keys(this.gameSockets);
    if (keys && keys.length) {
      keys.forEach((key) => {
        const socket: SocketIOClient.Socket = this.gameSockets[key];
        socket && socket.disconnect();
        delete this.gameSockets[key];
      })
    }
  }
}