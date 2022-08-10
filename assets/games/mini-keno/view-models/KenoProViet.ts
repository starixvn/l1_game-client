import * as _ from "lodash";

import { lazyInject } from "../../../Application";
import AudioManager from "../../../common/audio/AudioManager";
import SnappedScrollView from "../../../common/bet-chips/view-models/SnappedScrollView";
import DraggableItem from "../../../common/draggable-layout/view-models/DraggableItem";
import GameUtils, { MINI_GAMES_SCALE_ON_DESKTOP } from "../../../common/GameUtils";
import MiniPanel from "../../../mini-games-panel/view-models/MiniPanel";
import SocketIOController from "../../../SocketIOController";
import GameViewBase from "../../_base/GameViewBase";
import MiniKeno from "../../mini-keno/view-models/MiniKeno";
import KenoPageIndicatorItem from "./components/KenoPageIndicatorItem";
import KenoStatusBanner from "./components/KenoStatusBanner";
import MiniKenoGuide from "./components/MiniKenoGuide";
import MiniKenoHistory from "./components/MiniKenoHistory";
import MiniKenoPresetBet from "./components/MiniKenoPresetBet";
import KenoUtils, { KenoMaxId, KenoType, MegaKenoId } from "./KenoUtils";
import MiniKenoConfig from "./MiniKenoConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class KenoProViet extends GameViewBase {
    @property(cc.Prefab)
    kenoPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(SnappedScrollView)
    snappedScrollView: SnappedScrollView = null;

    @property(cc.Node)
    pageIndicator: cc.Node = null;

    @property(cc.Node)
    leftButton: cc.Node = null;

    @property(cc.Node)
    rightButton: cc.Node = null;

    @property(cc.Node)
    presetNode: cc.Node = null;

    @property(KenoStatusBanner)
    statusBanner: KenoStatusBanner = null;

    @property(cc.Prefab)
    presetBetPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    @property
    displaySize = 3;

    @property
    movingStep = 1;

    @lazyInject(SocketIOController)
    private readonly socketIOController: SocketIOController;

    private selectedIndex = 0;
    private childList: cc.Node[] = [];
    private readonly allGames = [1, 2, 3, 4, 5, 6, 7, 8];
    private favouriteGames = [];
    private sortedGames = [];
    private readonly miniKenos: MiniKeno[] = [];
    private contentLayout: cc.Layout;
    private presetBet: MiniKenoPresetBet;
    private presetBetValue = 0;
    private indicatorItems: KenoPageIndicatorItem[] = [];
    private miniPanel: MiniPanel;
    private readonly statusQueue: any[] = [];
    private presetBetSettingKey: string;
    private miniKenoHistory: MiniKenoHistory;
    private gameConfigs: any;

    initMiniPanel(miniPanel: MiniPanel) {
        this.miniPanel = miniPanel;
        this.presetBetSettingKey = `keno_preset_bet${cc.RedT.user.UID}`;
    }

    onDestroy() {
        this.miniKenos.forEach((keno) => {
            if (keno.isAlive()) {
                keno.node.destroy();
            }
        });
    }

    assignSocketForGameDefault() {
        const defaultGameId = MegaKenoId;
        const kenoProVietSocket = this.socketIOController.getSocketGame(KenoMaxId);
        this.socketIOController.assignSocket(defaultGameId, kenoProVietSocket);
    }

    private setUpSocketAllKeno(list: any[]) {
        this.assignSocketForGameDefault();
        const alternativeName = GameUtils.getGameNameString(KenoMaxId);
        list.forEach((type, index) => {
            const gameId = KenoUtils.getKenoGameId(type);
            const socket = this.socketIOController.getSocketGame(gameId);
            const isMain = index === 0;
            const gameName = GameUtils.getGameNameString(gameId);
            if (!socket) {
                this.miniPanel.gameMiniInitializers.setUpSocketForGame(gameName, gameId, false, {
                    isMain,
                    alternativeName,
                    hideContainer: () => this.close()
                });
            }
        });
    }

    private initAllKeno() {
        const content = cc.sys.localStorage.getItem("keno_favourites") || "[]";
        this.favouriteGames = JSON.parse(content);
        const otherGames = _.difference(this.allGames, this.favouriteGames);
        this.sortedGames = [...this.favouriteGames, ...otherGames];
        this.setUpSocketAllKeno(this.sortedGames);
        this.sortedGames.forEach((type, index) => {
            this.addKeno(type, index);
        });

        this.contentLayout = this.content.getComponent(cc.Layout);
        this.contentLayout.updateLayout();
        this.contentLayout.enabled = false;

        this.indicatorItems = this.pageIndicator.children.map((child) => child.getComponent(KenoPageIndicatorItem));
        this.indicatorItems.forEach((dot, index) => {
            dot.init(this.miniKenos[index]);
        });
    }

    addKeno(type, index) {
        const node = cc.instantiate(this.kenoPrefab);
        const keno = node.getComponent(MiniKeno);
        keno.kenoType = type;
        keno.config = new MiniKenoConfig(keno.kenoType);
        keno.isMiniKeno = keno.kenoType === KenoType.Mini || keno.kenoType === KenoType.Mini2;

        keno.gameId = KenoUtils.getKenoGameId(type);
        keno.initMiniPanel(this.miniPanel);
        keno.favourite.isChecked = index < this.favouriteGames.length;
        keno.onFavoriteChanged = (a, b) => this.onFavoriteChanged(a, b);
        keno.getPreset = () => this.presetBetValue;
        keno.statusCallback = (a, b, c) => {
            if (a !== this.sortedGames[this.selectedIndex] && a !== this.sortedGames[this.selectedIndex + 1]) {
                this.statusQueue.unshift({ type: a, round: b, win: c });
            }
        };
        keno.onDataCallback = (data, gameName) => {
            this.onData(data, gameName);
        };
        keno.onDisconnectCallback = () => {
            this.close();
        };
        this.content.addChild(node);
        this.miniKenos.push(keno);
    }

    onData(data: any, gameName: string) {
        const indicator = this.indicatorItems.find((item) => item.miniKeno.gameName === gameName);
        indicator.setData(data);

        if (data.history && this.miniKenoHistory) {
            this.miniKenoHistory.receivedData(data.history, gameName);
        }

        if (data.gameConfigs && this.presetBet) {
            this.gameConfigs = data.gameConfigs;

            this.updatePresetBet();
        }
    }

    updatePresetBet() {
        const values = GameUtils.getFilterValuesByStakeLevel(this.gameConfigs.chips, this.gameConfigs);
        this.presetBet.setItems(values);
    }

    update(dt) {
        this.updateStatusBanner();
    }

    updateStatusBanner() {
        if (this.statusBanner.isShowing || this.statusQueue.length === 0) {
            return;
        }

        const status = this.statusQueue.pop();
        const { type, round, win } = status;
        this.statusBanner.init(KenoUtils.getKenoName(type), round, win);
        this.statusBanner.show();
    }

    private saveFavourites() {
        cc.sys.localStorage.setItem("keno_favourites", JSON.stringify(this.favouriteGames));
    }

    private onFavoriteChanged(favourite: boolean, type: number) {
        if (favourite) {
            this.favouriteGames.push(type);
        } else {
            _.remove(this.favouriteGames, (game) => game === type);
        }
        this.saveFavourites();
        this.updateGameLayout(type);
    }

    private updateGameLayout(updatedType: number) {
        const left = this.contentLayout.paddingLeft;
        const spacing = this.contentLayout.spacingX;
        const otherGames = _.difference(this.allGames, this.favouriteGames);
        this.sortedGames = [...this.favouriteGames, ...otherGames];
        this.sortedGames.forEach((type, index) => {
            const keno = this.miniKenos.find((game) => game.kenoType === type);
            keno.node.position = cc.v3(left + keno.node.width / 2 + index * (keno.node.width + spacing), 0);
            keno.favourite.isChecked = index < this.favouriteGames.length;

            this.indicatorItems[index].init(keno);
        });

        this.selectedIndex = this.sortedGames.indexOf(updatedType);
        this.scrollToSelectedIndex();
    }

    private initPresetBetBoard() {
        const node = cc.instantiate(this.presetBetPrefab);
        this.presetBet = node.getComponent(MiniKenoPresetBet);
        this.presetBet.onChangedBet = (betAmount: number) => {
            this.changedPresetBet(betAmount);
        };
        this.presetBet.getPreset = () => this.presetBetValue;
        this.presetNode.addChild(node);
        node.active = false;

        this.presetBetValue = parseFloat(cc.sys.localStorage.getItem(this.presetBetSettingKey)) || 0;
    }

    private changedPresetBet(value: number) {
        this.presetBetValue = value;
        cc.sys.localStorage.setItem(this.presetBetSettingKey, this.presetBetValue);
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = MINI_GAMES_SCALE_ON_DESKTOP;
        }
        this.initAllKeno();
        this.leftButton.active = false;
        this.childList = [...this.content.children];
        this.snappedScrollView.onScrollEnded = () => {
            const min = this.snappedScrollView.getMinDisplayIndex();
            this.selectedIndex = min;
            this.scrollToSelectedIndex();
        };
        this.initPresetBetBoard();
        const dragableItem = this.getComponent(DraggableItem);
        dragableItem.touchCallback.start = (node) => {
            this.node.parent.insertChild(this.node, this.node.parent.childrenCount - 1);
        };
    }

    onEnable() {
        this.setUpSocketAllKeno(this.sortedGames);
        this.miniKenos.forEach((keno) => {
            keno.grantSocket();
            keno.socket.off("signedIn").on("signedIn", () => {
                keno.registerViewGame();
            });
        });

        this.selectedIndex = 0;
        this.snappedScrollView.scrollTo(0);
        this.scrollToSelectedIndex();
    }

    onDisable() {
        this.sortedGames.forEach((type) => {
            const gameId = KenoUtils.getKenoGameId(type);
            this.socketIOController.closeSocket(gameId);
        });
        this.socketIOController.closeSocket(KenoMaxId);
        this.closeGuideAndHistory();
    }

    closeGuideAndHistory() {
        ["KenoProVietGuide", "KenoProVietHistory"].forEach((name) => {
            const node = this.miniPanel.dialog.getChildByName(name);
            if (node) {
                node.destroy();
            }
        });
    }

    private updateArrowVisibility() {
        this.leftButton.active = true;
        this.rightButton.active = true;
        if (this.selectedIndex <= 0) {
            this.selectedIndex = 0;
            this.leftButton.active = false;
        } else if (this.selectedIndex >= this.childList.length - this.displaySize) {
            this.selectedIndex = this.childList.length - this.displaySize;
            this.rightButton.active = false;
        }
    }

    public onPrevious() {
        AudioManager.getInstance().playClick();
        this.selectedIndex -= this.movingStep;
        this.scrollToSelectedIndex();
    }

    public onNext() {
        AudioManager.getInstance().playClick();
        this.selectedIndex += this.movingStep;
        this.scrollToSelectedIndex();
    }

    private scrollToSelectedIndex() {
        this.snappedScrollView.scrollTo(this.selectedIndex);
        this.updateArrowVisibility();
        this.updatePageIndicator();
    }

    private updatePageIndicator() {
        this.indicatorItems.forEach((dot, index) => {
            const highlight = index === this.selectedIndex || index === this.selectedIndex + 1;
            dot.setHighlight(highlight);
        });
    }

    openGame() {}

    closeGame() {
        AudioManager.getInstance().playClick();
        this.close();
    }

    close() {
        this.presetBet.forceClose();
        this.node.active = false;
        this.miniKenos.forEach((keno) => {
            keno.stopGame();
        });
        this.indicatorItems.forEach((item) => item.stop());
    }

    onSignIn() {
        this.miniKenos.forEach((keno) => {
            if (keno.node.active) {
                keno.onSignIn();
            }
        });
    }

    onPageIndicatorClick(e) {
        const clickIndex = this.indicatorItems.findIndex((dot) => dot.node === e.target);
        if (clickIndex === this.indicatorItems.length - 1) {
            this.selectedIndex = clickIndex - 1;
        } else {
            this.selectedIndex = clickIndex;
        }
        this.scrollToSelectedIndex();
    }

    openGuide() {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.guidePrefab);
        this.miniPanel.addDialog(node);
        const guide = node.getComponent(MiniKenoGuide);
        guide.miniKenos = this.miniKenos;
        node.name = "KenoProVietGuide";
    }

    openHistory() {
        AudioManager.getInstance().playClick();
        const node = cc.instantiate(this.historyPrefab);
        this.miniKenoHistory = node.getComponent(MiniKenoHistory);
        this.miniPanel.addDialog(node);
        node.name = "KenoProVietHistory";
    }

    openPresetBetDialog() {
        AudioManager.getInstance().playClick();
        this.presetBet.toggle();
    }
}
