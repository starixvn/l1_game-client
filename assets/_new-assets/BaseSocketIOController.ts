import * as socketIo from 'socket.io-client';

import { getSession } from './common/auth/AuthManager';
import { sentryLogger } from './common/logger.js';
import { gameMiniNewSocketIds } from './Configs';

export default class BaseSocketIOController {
  private static instance: BaseSocketIOController;
  public gameSockets = {};

  public static getInstance(): BaseSocketIOController {
    if (!this.instance) {
      this.instance = new BaseSocketIOController();
    }

    return this.instance;
  }

  connectGameSocket = (socketUri: string, gameName: string, proxyRoute: string, onConnectFailed: (gameName) => void): SocketIOClient.Socket => {
    const socket = socketIo(socketUri, { forceNew: true, transports: ["websocket"], upgrade: false, path: proxyRoute });

    socket.on('connect', () => {
      socket.emit('signin', getSession());
    });

    socket.on('reconnect', () => {
      sentryLogger.logError('Sedie reconnect');
    });

    socket.on('connect_failed', () => {
      sentryLogger.logError('Sedie connect failed');
      socket.disconnect();
      onConnectFailed(gameName);
    });

    socket.on('connect_error', (error) => {
      sentryLogger.logError(error);
      socket.disconnect();
      onConnectFailed(gameName);
    });

    socket.on('disconnect', (reason) => {
      sentryLogger.log('Sedie disconnect\n' + reason);
    });

    return socket;
  };

  async closeSocket(gameId) {
    const socket: SocketIOClient.Socket = this.gameSockets[gameId];
    socket && socket.disconnect();
    delete this.gameSockets[gameId];
  }

  closeAllSocket() {
    const keys = Object.keys(this.gameSockets);

    if (keys && keys.length) {
      keys.forEach((key) => {
        const socket: SocketIOClient.Socket = this.gameSockets[key];
        socket && socket.disconnect();
        delete this.gameSockets[key];
      });
    }
  }

  closeMiniGameSockets() {
    gameMiniNewSocketIds.forEach((gameId) => {
      const socket: SocketIOClient.Socket = this.gameSockets[gameId];
      socket && socket.disconnect();
      delete this.gameSockets[gameId];
    });
  }

  recheckin() {
    // Object.values(this.gameSockets).forEach((socket: SocketIOClient.Socket) => {
    //   socket.emit('recheckin', getSession());
    // })
  }
} 
