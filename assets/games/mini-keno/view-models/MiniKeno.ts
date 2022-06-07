import * as i18n from "i18n/runtime-scripts/LanguageData";

import AudioManager from "../../../common/audio/AudioManager";
import GameUtils from "../../../common/GameUtils";
import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";
import NoticeUtil from "../../../common/utils/NoticeUtil";
import { GameState } from "../../_base/GameState";
import SocketIOMiniGameBase from "../../_base/SocketIOMiniGameBase";
import KenoNumber from "../../keno-pro/view-models/KenoNumber";
import RoundHistory from "../../keno-pro/view-models/RoundHistory";
import BetBoard, { BetInfo } from "./../../../common/bet-board/view-models/BetBoard";
import MiniKenoBetItem from "./components/MiniKenoBetItem";
import MiniKenoBetItems from "./components/MiniKenoBetItems";
import MiniKenoRoundResult from "./components/MiniKenoRoundResult";
import MiniKenoTimer from "./components/MiniKenoTimer";
import MiniKenoFinishHandler from "./handlers/MiniKenoFinishHandler";
import MiniKenoLogsHandler from "./handlers/MiniKenoLogsHandler";
import MiniKenoStatusHandler from "./handlers/MiniKenoStatusHandler";
import MiniKenoTimeHandler from "./handlers/MiniKenoTimeHandler";
import { KenoType } from "./KenoUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKeno extends SocketIOMiniGameBase {
    @property(cc.Node)
    background: cc.Node = null;

    @property({ type: cc.Enum(KenoType) })
    kenoType: KenoType = KenoType.Max;

    @property(cc.Sprite)
    kenoName: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Toggle)
    favourite: cc.Toggle = null;

    @property({ type: cc.SpriteFrame })
    headerFrames: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    headerBg: cc.Sprite = null;

    @property(cc.Node)
    body: cc.Node = null;

    @property(cc.Node)
    center: cc.Node = null;

    @property(cc.Node)
    timer: cc.Node = null;

    @property(cc.Prefab)
    timerPrefab: cc.Prefab = null;

    @property(cc.Node)
    stopBetWarning: cc.Node = null;

    @property(cc.Prefab)
    betItemsPrefab: cc.Prefab = null;

    @property(cc.Node)
    betBoardContainer: cc.Node = null;

    @property(cc.Prefab)
    betBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundResultContainer: cc.Node = null;

    @property(cc.Prefab)
    roundResultPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundResultMiniPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Button)
    rebet: cc.Button = null;

    public isMiniGameInContainer = true;
    public isMiniKeno: boolean;
    public kenoNumbers: KenoNumber[] = [];
    public roundHistory: RoundHistory;
    public roundResult: MiniKenoRoundResult;
    public betBoard: BetBoard;
    public kenoTimer: MiniKenoTimer;
    public lastBetInfo: BetInfo = null;
    public onFavoriteChanged = (favourite: boolean, type: number) => {};
    public getPreset = () => {
        return 0;
    };
    public statusCallback = (gameName: number, roundId: number, winAmount: number) => {};
    public onDataCallback = (data: any, gameName: string) => {};
    public onDisconnectCallback = () => {};

    onLoad() {
        this.initComponents();
        this.initHeaderBackground();
        this.enableRebetButton(false);

        super.onLoad();
    }

    onDisconnected() {
        this.closeGame();
        this.onDisconnectCallback();
    }

    closeGame() {
        if (!this.isAlive()) {
            return;
        }
        this.sendRetryMessage();
        this.socketIOController.closeSocket(this.gameId);
        this.showProcessingWarning(false);
    }

    onData(data: any) {
        super.onData(data);
        this.onDataCallback(data, this.gameName);
    }

    onDisable() {
        // do not stop game when disable
        this.resetDataAndUI();
    }

    public resetDataAndUI() {
        super.resetDataAndUI();
        this.roundResult.node.active = false;
        this.stopBetWarning.active = false;
        this.animatedTime.node.active = false;
        this.animatedTime.resetTime();
        this.betBoard.close();
    }

    initHeaderBackground() {
        if (!this.headerBg) {
            return;
        }

        const dict = {
            ProViet: 0,
            Max: 0,
            Max2: 0,
            Mini: 1,
            Mini2: 1,
            East: 2,
            West: 2,
            South: 2,
            North: 2
        };

        const bgIndex = dict[KenoType[this.kenoType]];
        this.headerBg.spriteFrame = this.headerFrames[bgIndex];
        this.kenoName.spriteFrame = this.getGameNameSprite(this.kenoType);
    }

    getGameNameSprite(type: KenoType) {
        const dict = {
            ProViet: "pro_viet",
            Max: "max",
            Max2: "max2",
            Mini: "mini",
            Mini2: "mini2",
            East: "dong",
            West: "tay",
            South: "nam",
            North: "bac"
        };
        const name = `header_text_${dict[KenoType[type]]}`;
        const suffix = NoticeUtil.getCurrentLanguage() !== "vi" ? "_en" : "";
        const sprite = this.atlas.getSpriteFrame(`${name}${suffix}`);
        return sprite ? sprite : this.atlas.getSpriteFrame(name);
    }

    onDestroy() {
        this.clearIntervalAndTimeout();
        this.betBoard.destroy();
        this.roundHistory.destroy();
        this.roundResult.destroy();
        super.onDestroy();
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new MiniKenoFinishHandler(this);
        this.timeHandler = new MiniKenoTimeHandler(this);
        this.logsHandler = new MiniKenoLogsHandler(this);
        this.statusHandler = new MiniKenoStatusHandler(this);
    }

    public static getTextChangeEffect(): cc.Action {
        return cc.sequence(cc.scaleTo(0.1, 1.1).easing(cc.easeBackOut()), cc.scaleTo(0.1, 1));
    }

    public onReBetClick() {
        AudioManager.getInstance().playClick();
        if (this.isDisabledBet()) {
            return;
        }

        const betInfo = { ...this.lastBetInfo };
        this.betBoard.show(betInfo);
    }

    protected isDisabledBet(): boolean {
        return (
            this.currentTimeRemaining >= this.config.betTime ||
            this.currentTimeRemaining <= this.config.stopBetTime ||
            this.gameState === GameState.Stopped
        );
    }

    public onBetItemClick(e) {
        AudioManager.getInstance().playClick();

        if (this.isDisabledBet()) {
            this.showMiniWarning(i18n.t("messages.placeBetNextRound"));
            return;
        }

        const betChoice = e.target.name;
        const info = {
            choice: betChoice,
            bet: 0,
            betItem: e.target,
            maxBet: () => this.gameConfigs.maxBetPerChoices[betChoice]
        };
        this.betBoard.show(info);
    }

    public enableRebetButton(enabled: boolean) {
        this.rebet.interactable = enabled;
        this.rebet.node.opacity = enabled ? 255 : 102;
    }

    public toggleFavorite() {
        AudioManager.getInstance().playClick();
        this.onFavoriteChanged(this.favourite.isChecked, this.kenoType);
    }

    public slideTransition(node: cc.Node, direction: string, transitionTime = 0.5, initFunc: (tempNode: cc.Node) => void = null) {
        const tempNode = cc.instantiate(this.node);

        if (initFunc) {
            initFunc(tempNode);
        }

        const nodeIndex = node.parent.children.indexOf(node);
        node.parent.insertChild(tempNode, nodeIndex + 1);
        node.opacity = 0;
        const xPosition = direction === "right" ? node.width : -node.width;

        node.runAction(
            cc.sequence(
                cc.moveBy(0, cc.v2(xPosition, 0)),
                cc.spawn(
                    cc.fadeIn(transitionTime).easing(cc.easeSineInOut()),
                    cc.moveBy(transitionTime, cc.v2(-xPosition, 0)).easing(cc.easeSineInOut())
                )
            )
        );

        tempNode.runAction(
            cc.sequence(
                cc.spawn(
                    cc.fadeOut(transitionTime).easing(cc.easeSineInOut()),
                    cc.moveBy(transitionTime, cc.v2(-xPosition, 0)).easing(cc.easeSineInOut())
                ),
                cc.delayTime(transitionTime * 1.5),
                cc.callFunc(() => {
                    tempNode.destroy();
                })
            )
        );
    }

    public updateRoundHistory() {
        this.roundHistory.setData(this.currentDataLogs);
    }

    protected bet(betData) {
        if (!this.isReadyBet()) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        } else {
            this.lockBet();
            this.sendData(betData);
        }
    }

    protected sendBet(betAmount, betChoice) {
        this.bet({ amount: betAmount, betChoice: betChoice });
    }

    public sendData(payload: any) {
        this.socket && this.socket.connected && this.socket.emit("bet", payload);
    }

    protected initComponents() {
        this.initBetItems();
        this.initRoundHistory();
        this.initRoundResult();
        this.initBetBoard();
    }

    protected initBetItems() {
        const betItemsNode = cc.instantiate(this.betItemsPrefab);
        const betItems = betItemsNode.getComponent(MiniKenoBetItems);
        this.betItems = betItems.betItems;
        this.body.addChild(betItemsNode);
        this.betItems.forEach((item) => {
            item.betCallback = (e) => {
                this.onBetItemClick(e);
            };
        });
    }

    protected initRoundHistory() {
        const roundHistoryNode = cc.instantiate(this.roundHistoryPrefab);
        this.roundHistory = roundHistoryNode.getComponent(RoundHistory);
        this.roundHistory.init(this);
        this.body.addChild(roundHistoryNode);
        this.roundHistory.node.active = true;
    }

    protected initRoundResult() {
        const roundResultNode = cc.instantiate(this.isMiniKeno ? this.roundResultMiniPrefab : this.roundResultPrefab);
        this.roundResult = roundResultNode.getComponent(MiniKenoRoundResult);
        this.roundResultContainer.addChild(roundResultNode);
        this.roundResult.init(this);
        this.roundResult.node.active = false;
    }

    protected initBetBoard() {
        const betBoardNode = cc.instantiate(this.betBoardPrefab);
        this.betBoard = betBoardNode.getComponent(BetBoard);
        this.betBoard.callback = {
            getPreset: () => {
                return this.getPreset();
            },
            acceptedBet: (info: BetInfo) => {
                if (info.bet > 0) {
                    this.enableRebetButton(true);
                    this.sendBet(info.bet, info.choice);

                    this.lastBetInfo = this.betBoard.info;
                }
                info.betItem.getComponent(MiniKenoBetItem).clearInputBet();
            },
            changedBet: (info: BetInfo) => {
                info.betItem.getComponent(MiniKenoBetItem).inputBetChanged(info.bet);
            },
            cancel: (info: BetInfo) => {
                info.betItem.getComponent(MiniKenoBetItem).clearInputBet();
            }
        };
        this.betBoard.node.active = false;
        this.betBoardContainer && this.betBoardContainer.addChild(betBoardNode);
    }

    updateDisplayForRemoteConfig() {
        super.updateDisplayForRemoteConfig();
        this.updateBetBoard();
    }

    updateBetBoard() {
        const values = GameUtils.getFilterValuesByStakeLevel(this.gameConfigs.chips, this.gameConfigs);
        this.betBoard.setItems(values);
    }

    public highlightWonItem(results: any, { isAnimated = true, showWinningEffect = false }) {
        const keys = getLowercaseObjectKeys(results);
        this.betItems.forEach((item) => {
            const miniKenoBetItem = item as MiniKenoBetItem;
            const highlight = results[keys[item.node.name.toLowerCase()]];
            miniKenoBetItem.setHighlight(highlight, isAnimated);
            miniKenoBetItem.hideWinningEffect();

            if (highlight && showWinningEffect) {
                isAnimated && miniKenoBetItem.showWinningEffect();
            }
        });
    }

    public resetWinningBetItems() {
        this.betItems.forEach((item: MiniKenoBetItem) => {
            item.resetHighlight();
        });
    }
}
