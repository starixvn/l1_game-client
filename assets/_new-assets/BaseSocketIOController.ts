import * as socketIo from 'socket.io-client';
import { getSession } from './common/auth/AuthManager';

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
      console.log('connected');
      socket.emit('signin', getSession());
    });

    socket.on('connect_failed', function () {
      console.log('Connection Failed');
      socket.disconnect();
      onConnectFailed(gameName);
    });

    socket.on('connect_error', function () {
      console.log('Connection Failed');
      socket.disconnect();
      onConnectFailed(gameName);
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