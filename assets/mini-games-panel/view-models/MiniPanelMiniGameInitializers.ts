import { buildServerUrl } from "../.././common/helpers/UrlHelper";
import { lazyInject } from "../../Application";
import * as configs from "../../configs/Configs";
import * as SabaConfigs from "../../configs/SabaConfigs";
import ChanLeTurboConfigs from "../../games/chan-le-turbo/view-models/ChanLeTurboConfigs";
import { ChanLeConfigs } from "../../games/chan-le/view-models/ChanLeConfigs";
import { MiniSedieConfigs } from "../../games/mini-sedie/viewModels/MiniSedieConfigs";
import { RongHoConfigs } from "../../games/rong-ho/view-models/RongHoConfigs";
import { SpecialSeDieConfigs } from "../../games/special-sedie/view-models/SpecialSeDieConfigs";
import SocketIOController from "../../SocketIOController";
import MiniPanel from "./MiniPanel";

export default class MiniPanelMiniGameInitializers {
    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    constructor(private main: MiniPanel) {}

    showGame(gameComponent) {
        if (gameComponent) {
            gameComponent.node.active = true;
            this.main.miniGames && this.main.miniGames.insertChild(gameComponent.node, this.main.miniGames.children.length - 1);

            this.main.loading.node.active = false;
        }
    }

    openMiniGame(
        prefabPath: string,
        componentName: string,
        isAlreadyOpened: boolean,
        initFunc: (gameComponent) => void,
        showGameFunc: () => void
    ) {
        this.main.popupMiniGame.hideListGame();
        let gameComponent: any;

        if (!isAlreadyOpened) {
            this.main.loading.setDefaultPercent();
            cc.loader.loadRes(
                prefabPath,
                (completedCount, total, item) => {
                    this.main.loading && this.main.loading.onProgress(completedCount, total, item);
                },
                (err: Error, prefab: any) => {
                    if (!this.main.node || !this.main.node.isValid) {
                        return;
                    }
                    if (err || prefab === null) {
                        this.main.loading.node.active = false;
                        this.main.onForceReload();
                        return;
                    }

                    const node = cc.instantiate(prefab);
                    gameComponent = node.getComponent(componentName);
                    initFunc ? initFunc(gameComponent) : gameComponent.init(this);
                    this.main.miniGames && this.main.miniGames.addChild(gameComponent.node);
                    gameComponent.openGame();
                    this.main.loading.node.active = false;
                }
            );
        } else {
            showGameFunc();
        }
    }

    openGame(id) {
        if (!cc.RedT.isConnected) {
            const key = Object.keys(SabaConfigs.games).find((key) => SabaConfigs.games[key].id === id);
            const gameName = SabaConfigs.games[key].name;
            this.main.onConnectSocketFailed(gameName, false);
            return;
        }

        this.main.loading.node.active = true;

        id = parseInt(id);
        switch (id) {
            case SabaConfigs.games.TaiXiu.id:
                this.openTaiXiu();
                break;
            case SabaConfigs.games.BauCua.id:
                this.openBauCua();
                break;
            case SabaConfigs.games.TaiXiuTurbo.id:
                this.openTaiXiuTurbo();
                break;
            case SabaConfigs.games.ChanLe.id:
                this.openChanLe();
                break;
            case SabaConfigs.games.ChanLeTurbo.id:
                this.openChanLeTurbo();
                break;
            case SabaConfigs.games.RongHo.id:
                this.openRongHo();
                break;
            case SabaConfigs.games.MiniSedie.id:
                this.openMiniSedie();
                break;
            case SabaConfigs.games.KenoProViet.id:
                this.openKenoProViet();
                break;
            default:
                this.main.loading.node.active = false;
                break;
        }
    }

    openTaiXiu() {
        this.openMiniGame(
            "games/tai-xiu/views/TaiXiu",
            "TX",
            this.main.taiXiu && this.main.taiXiu.node,
            (gameComponent) => {
                this.main.taiXiu = gameComponent;
                this.main.taiXiu.init("taixiu", this.main);
            },
            () => this.showGame(this.main.taiXiu)
        );
    }

    openTaiXiuTurbo() {
        this.openMiniGame(
            "games/tai-xiu-turbo/views/TurboTaiXiu",
            "TurboTX",
            this.main.taiXiuTurbo && this.main.taiXiuTurbo.node,
            (gameComponent) => {
                this.main.taiXiuTurbo = gameComponent;
                this.main.taiXiuTurbo.init("taixiu_turbo", this.main);
            },
            () => this.showGame(this.main.taiXiuTurbo)
        );
    }

    openKenoProViet() {
        this.openMiniGame(
            "games/keno-pro-viet/views/KenoProViet",
            "KenoProViet",
            this.main.kenoProViet != null && this.main.kenoProViet.node != null,
            (gameComponent) => {
                this.main.kenoProViet = gameComponent;
                this.main.kenoProViet.init(this.main);
            },
            () => this.showGame(this.main.kenoProViet)
        );
    }

    openBauCua() {
        this.openMiniGame(
            "games/bau-cua/views/BauCua",
            "BauCuaMini",
            this.main.bauCua && this.main.bauCua.node,
            (gameComponent) => {
                this.main.bauCua = gameComponent;
                this.main.bauCua.init("baucua", this.main);
            },
            () => this.showGame(this.main.bauCua)
        );
    }

    openRongHo() {
        this.openMiniGame(
            "games/rong-ho/views/RongHo",
            "RongHo",
            this.main.rongHo != null && this.main.rongHo.node != null,
            (gameComponent) => {
                this.main.rongHo = gameComponent;
                this.main.rongHo.init(this.main, "dragon_tiger", new RongHoConfigs());
            },
            () => this.showGame(this.main.rongHo)
        );
    }

    openMiniSedie() {
        this.openMiniGame(
            "games/mini-sedie/views/MiniSedie",
            "MiniSedie",
            this.main.miniSedie != null,
            (gameComponent) => {
                this.main.miniSedie = gameComponent;
                this.main.miniSedie.init("miniSedie", new MiniSedieConfigs(), this.main);
            },
            () => this.showGame(this.main.miniSedie)
        );
    }

    openChanLe() {
        this.openMiniGame(
            "games/chan-le/views/ChanLe",
            "ChanLe",
            this.main.chanLe != null,
            (gameComponent) => {
                this.main.chanLe = gameComponent;
                this.main.chanLe.init(this.main, "chanle", new ChanLeConfigs(), "Chẵn Lẻ");
            },
            () => this.showGame(this.main.chanLe)
        );
    }

    openChanLeTurbo() {
        this.openMiniGame(
            "games/chan-le-turbo/views/ChanLeTurbo",
            "ChanLe",
            this.main.chanLeTurbo != null,
            (gameComponent) => {
                this.main.chanLeTurbo = gameComponent;
                this.main.chanLeTurbo.init(this.main, "clturbo", new ChanLeTurboConfigs(), "Chẵn lẻ siêu tốc", true);
            },
            () => this.showGame(this.main.chanLeTurbo)
        );
    }

    openNewSocket(gameId) {
        this.main.loading.node.active = true;
        const currentSocket: SocketIOClient.Socket = this.socketIOController.gameSockets[gameId];

        if (currentSocket && currentSocket.connected) {
            this.openNewSocketGame(gameId);
        } else {
            const key = Object.keys(SabaConfigs.games).find((key) => SabaConfigs.games[key].id === gameId);
            const gameName = SabaConfigs.games[key].name;
            const proxyRoute = configs.serverGameEndPoints[gameId].proxyRoute;
            const gameServerUrl = buildServerUrl(configs.ssl, "http", "", gameId);
            const socket = this.socketIOController.connectGameSocket(
                gameServerUrl,
                gameName,
                proxyRoute,
                this.main.onConnectSocketFailed.bind(this.main),
                false
            );

            socket.on("signedIn", () => {
                if (!this.main.node || !this.main.node.isValid) {
                    return;
                }
                this.openNewSocketGame(gameId);
            });

            socket.on("forceDisconnect", () => {
                socket.disconnect();
            });

            this.socketIOController.gameSockets[gameId] = socket;
        }
    }

    openNewSocketGame(gameId) {
        if (parseInt(gameId) === SabaConfigs.games.SpecialSeDie.id) {
            this.openSpecialSeDie();
        } else {
            this.main.loading.node.active = false;
        }
    }

    openSpecialSeDie() {
        this.openMiniGame(
            "games/special-sedie/views/SpecialSeDie",
            "SpecialSeDie",
            this.main.specialSeDie != null,
            (gameComponent) => {
                this.main.specialSeDie = gameComponent;
                this.main.specialSeDie.init("SpecialSeDie", new SpecialSeDieConfigs(), this.main);
            },
            () => this.showGame(this.main.specialSeDie)
        );
    }
}
