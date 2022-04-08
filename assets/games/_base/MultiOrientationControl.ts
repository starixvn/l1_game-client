import { Socket } from "socket.io-client";

import { lazyInject } from "../../Application";
import SocketIOController from "../../SocketIOController";
import MultiOrientationGame from "./MultiOrientationGame";
import { Orientation } from "./Orientation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MultiOrientationControl extends cc.Component {
    @property({ type: cc.Prefab })
    gamePrefabs: cc.Prefab[] = [];

    games: MultiOrientationGame[] = [];

    @lazyInject(SocketIOController)
    protected readonly socketIOController: SocketIOController;
    protected socket: Socket;
    protected _gameId: number;
    protected _orientation = Orientation.Landscape;

    public set gameId(value: number) {
        this._gameId = value;
    }

    public get gameId(): number {
        return this._gameId;
    }

    onLoad() {
        this.socket = this.socketIOController.getSocketGame(this.gameId);
        this.initGames();
        this.initChangeOrientationCallback();
        this.updateGames();
    }
    initGames() {
        this.gamePrefabs.forEach((prefab, index) => {
            const node = cc.instantiate(prefab);
            this.node.addChild(node);
            node.angle = index === Orientation.Portrait ? 90 : 0;
            const orientationGame = node.getComponent(MultiOrientationGame);
            this.games.push(orientationGame);
        });
    }

    initChangeOrientationCallback() {
        this.games.forEach((game) => (game.changeOrirentationCallback = this.changeOrientation.bind(this)));
    }

    onDestroy() {
        this.socketIOController.closeSocket(this.gameId);
    }

    changeOrientation() {
        if (this.games.length < 2) {
            return;
        }
        this._orientation = this._orientation === Orientation.Landscape ? Orientation.Portrait : Orientation.Landscape;
        this.updateGames();
    }

    updateGames() {
        this.games.forEach((child, index) => {
            const show = index === this._orientation;
            if (!show && child.node.active) {
                child.stopGame();
            }
            child.node.active = show;
        });
    }
}
