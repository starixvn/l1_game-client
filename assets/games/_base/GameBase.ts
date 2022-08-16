import * as i18n from "i18n/runtime-scripts/LanguageData";
import * as _ from "lodash";

import AnimatedTime from "../../common/animated-time/view-models/AnimatedTime";
import AudioManager from "../../common/audio/AudioManager";
import { getLanguage, getLocale } from "../../common/auth/SessionManager";
import UserService from "../../common/auth/UserService";
import BetChips from "../../common/bet-chips/view-models/BetChips";
import GameUtils from "../../common/GameUtils";
import InGameMenu, { InGameMenuEvents } from "../../common/in-game-menu/InGameMenu";
import ProcessingWarning from "../../common/processing-warning/view-models/ProcessingWarning";
import TypingLabel from "../../common/typing-label/view-models/TypingLabel";
import UmWarning from "../../common/um-warning/UmWarning";
import UserProfile from "../../common/user-profile/UserProfile";
import WebViewGuide from "../../common/webview-guide/WebViewGuide";
import { getGameConfiguration } from "../../configs/GameConfigurations";
import { BoostedOddsHandler } from "../../lobby/promotions/BoostedOddsHandler";
import { GameState } from "./GameState";
import GameViewBase from "./GameViewBase";
import DataHandler from "./handlers/DataHandler";
import GameBaseBetHandler from "./handlers/GameBaseBetHandler";
import GameBaseOddsHandler from "./handlers/GameBaseOddsHandler";
import GameBaseConfigsHandler from "./handlers/GameBaseConfigsHandler";
import GameBaseErrorHandler from "./handlers/GameBaseErrorHandler";
import GameBaseFinishHandler from "./handlers/GameBaseFinishHandler";
import GameBaseLogsHandler from "./handlers/GameBaseLogsHandler";
import GameBaseMd5Handler from "./handlers/GameBaseMd5Handler";
import GameBaseNoticeHandler from "./handlers/GameBaseNoticeHandler";
import { GameBaseStatusHandler } from "./handlers/GameBaseStatusHandler";
import GameBaseTimeHandler from "./handlers/GameBaseTimeHandler";
import GameBaseUmDataHandler from "./handlers/GameBaseUmDataHandler";
import BetItem from "./view-models/BetItem";
import GameAudios from "./view-models/GameAudios";
import { GameConfigBase } from "./view-models/GameConfigBase";
import MD5Component from "./view-models/MD5Component";
import SocketIOGameHistoryBase from "./view-models/SocketIOGameHistoryBase";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameBase extends GameViewBase {
    @property({ type: BetItem })
    betItems: BetItem[] = [];

    @property(cc.Prefab)
    processWarningPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    miniNoticePrefab: cc.Prefab = null;

    @property(cc.Node)
    noticeNode: cc.Node = null;

    @property(UmWarning)
    umNotice: UmWarning = null;

    @property(cc.Node)
    timeWaitNode: cc.Node = null;

    @property(cc.Label)
    timeWaitLabel: cc.Label = null;

    @property({ type: AnimatedTime })
    animatedTime: AnimatedTime = null;

    @property({ type: MD5Component })
    md5Component: MD5Component = null;

    @property(cc.Label)
    gameRound: cc.Label = null;

    @property
    enableChips = false;

    @property({
        type: cc.Node,
        visible: function (this: GameBase) {
            return this.enableChips;
        }
    })
    betChipsContainer: cc.Node = null;

    @property({
        type: cc.Prefab,
        visible: function (this: GameBase) {
            return this.enableChips;
        }
    })
    betChipsPrefab: cc.Prefab = null;

    @property({
        visible: function (this: GameBase) {
            return this.enableChips;
        }
    })
    enablePlaceChips = false;

    @property({
        type: cc.Node,
        visible: function (this: GameBase) {
            return this.enablePlaceChips;
        }
    })
    dealerChipBox: cc.Node = null;

    @property(cc.Prefab)
    gameAudiosPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    guidePrefab: cc.Prefab = null;

    userProfile: UserProfile;

    protected historyComponent: SocketIOGameHistoryBase;

    public get gameName() {
        const gameConfiguration = getGameConfiguration(this.gameId);

        return gameConfiguration?.key;
    }

    public gameState = GameState.None;
    public get isStopGame() {
        return this.gameState === GameState.Stopped;
    }
    public get isDisableGame() {
        return this.gameState === GameState.Disabled;
    }
    public waitingProcessing = false;
    public currentTimeRemaining: number;
    public config: GameConfigBase;
    public currentDataLogs = [];
    public roundId = -1;
    public gameConfigs: any;
    public finishShowResult = true;

    public umHandler: DataHandler;
    public noticeHandler: DataHandler;
    public statusHandler: GameBaseStatusHandler;
    public betHandler: DataHandler;
    public timeHandler: GameBaseTimeHandler;
    public errorHandler: DataHandler;
    public logsHandler: DataHandler;
    public finishHandler: DataHandler;
    public configsHandler: DataHandler;
    public md5Handler: DataHandler;
    public oddsHandler: DataHandler;

    inGameMenu: InGameMenu;
    public betChips: BetChips;
    public currentBet: number;
    public gameAudios: GameAudios;
    private readonly dataHandlers: DataHandler[] = [];
    private processingWarning: cc.Node;
    public needHideNextDotRoundHistory = false;
    public boostedOddsHandler: BoostedOddsHandler;

    hideUmDataKeys = ["remainingTime"]

    setConfig(config: GameConfigBase) {
        this.config = config;
    }

    isReadyBet(): boolean {
        return !this.isDisableGame && this.gameConfigs !== undefined;
    }

    getUserBalance(): number {
        if (!cc.RedT || !cc.RedT.user) {
            return 0;
        }
        return cc.RedT.user.red;
    }

    onLoad() {
        super.onLoad();
        this.boostedOddsHandler = BoostedOddsHandler.getInstance();
        this.boostedOddsHandler.addDataObserver();
        this.setUpHandlers();
        this.initBetChips();
        this.initGameAudios();
        this.setGameRound(0);
        this.resetDataAndUI();
    }

    onDestroy() {
        super.onDestroy();
        this.md5Component = null;
    }

    setUpHandlers() {
        this.initHandlers();
        this.addHandlers(
            this.umHandler,
            this.configsHandler,
            this.noticeHandler,
            this.statusHandler,
            this.betHandler,
            this.timeHandler,
            this.errorHandler,
            this.logsHandler,
            this.finishHandler,
            this.md5Handler,
            this.oddsHandler
        );
    }

    joinGame() {
        this.startGame();
        this.registerViewGame();
        this.boostedOddsHandler.removeDataObserver();
        this.boostedOddsHandler.removeAllListeners();
    }

    onEnable() {
        this.joinGame();
    }

    onDisable() {
        this.stopGame();
    }

    onData(data: any) {
        for (let index = 0; index < this.dataHandlers.length; index++) {
            const handler = this.dataHandlers[index];
            handler && handler.handle(data);
            if (index === 0 && this.isShowingUM(data)) {
                break;
            }
        }
    }

    closeGame() {
        this.playClick();
        this.node.active = false;
        this.md5Component && this.md5Component.resetMd5();
    }

    /** Clear all intervals and timeouts in game */
    stopGame() {
        this.gameState = GameState.Stopped;
        this.clearIntervalAndTimeout();
        this.resetDataAndUI();
        this.md5Component && this.md5Component.resetMd5();
    }

    disableGame() {
        this.gameState = GameState.Disabled;
        this.clearIntervalAndTimeout();
        this.resetDataAndUI();
    }

    startGame() {
        this.gameState = GameState.Started;
    }

    /** Register with game on server */
    public registerViewGame() {}

    onSignIn() {
        if (!this.node.active) {
            return;
        }

        this.registerViewGame();
    }

    sendData(payload: any) {}

    showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.noticeNode, false, bet, 1);
    }

    showWinningBet(bet: number) {
        const winningBet = GameUtils.addFlyingText(this.noticeNode, true, bet, 4);
        winningBet.name = "winningBet";
    }

    clearGameRound() {
        this.gameRound && (this.gameRound.string = "");
    }

    setGameRound(gameRoundId) {
        if (!this.gameRound || gameRoundId < 0) {
            return;
        }

        const gameRound = this.formatGameRound(gameRoundId);
        this.gameRound.string = gameRound;

        const typingLabel = this.gameRound.node.parent.getComponent(TypingLabel);

        if (typingLabel) {
            if (this.timeHandler && this.timeHandler.isStartingNewGameRound) {
                typingLabel.playTypingEffect();
            } else {
                typingLabel.adjustWidth();
            }
        }
    }

    showProcessingWarning(show: boolean) {
        if (show) {
            if (this.processingWarning && this.processingWarning.isValid) {
                return;
            }
            const node = cc.instantiate(this.processWarningPrefab);
            this.noticeNode.addChild(node);
            this.processingWarning = node;
        } else {
            this.unlockBet();
            if (!this.processingWarning || !this.processingWarning.isValid) {
                return;
            }
            this.processingWarning.getComponent(ProcessingWarning).close();
            this.processingWarning = null;
        }
    }

    sendRetryMessage(): void {
        // handle
    }

    lockBet() {
        this.waitingProcessing = true;
        const intervalTime = 3; // 3 seconds
        this.schedule(this.sendRetryMessage, intervalTime, cc.macro.REPEAT_FOREVER, 0);
    }

    unlockBet() {
        this.waitingProcessing = false;
        this.unschedule(this.sendRetryMessage);
    }

    showUmMessage(data: any) {
        if (this.isDisableGame) {
            return;
        }

        this.umNotice && this.umNotice.show(data);
    }

    hideUmMessage() {
        this.umNotice && this.umNotice.hide();
    }

    clearAllNotices() {
        this.noticeNode.destroyAllChildren();
    }

    showMiniWarning(data): cc.Node {
        if (!this.node.activeInHierarchy) {
            return null;
        }
        const notice = cc.instantiate(this.miniNoticePrefab);
        const noticeComponent = notice.getComponent("mini_warning");
        noticeComponent.text.string = data;
        this.noticeNode.addChild(notice);
        return notice;
    }

    showMainTime(show: boolean) {
        if (this.animatedTime) {
            this.animatedTime.node.active = show;
        }
    }

    showWaittingTime(show: boolean) {
        if (this.timeWaitNode) {
            this.timeWaitNode.active = show;
        }
    }

    setWaitingTimeLabel(text: string) {
        if (this.timeWaitLabel) {
            this.timeWaitLabel.string = text;
        }
    }

    setMainTimeLabel(text: string) {
        if (this.animatedTime) {
            this.animatedTime.setTime(text);
        }
    }

    resetDataAndUI() {
        _.forEach(this.betItems, (item) => {
            item.clearBet();
            item.resetHighlight();
        });

        this.showMainTime(false);
        this.showWaittingTime(false);

        if (this.statusHandler) {
            this.statusHandler.currentStatusData = null;
        }
    }

    protected formatGameRound(gameRoundId: any) {
        return gameRoundId ? `#${gameRoundId}` : "";
    }

    protected onGameHide() {
        this.stopGame();
    }

    protected onGameShow() {
        this.joinGame();
    }

    protected initBetChips() {
        if (this.enableChips && this.betChipsContainer) {
            const betChipsNode = cc.instantiate(this.betChipsPrefab);
            this.betChipsContainer.addChild(betChipsNode);
            this.initBetChipByLoader(betChipsNode);
        }
    }

    initBetChipByLoader(node: cc.Node) {
        this.betChips = node.getComponent(BetChips);
        this.betChips.init((bet) => {
            this.onChangedBetChip(bet);
        });

        this.betChips.enableStakeLevel = this.isUsingMaxStakeLevel();
    }

    protected onChangedBetChip(bet) {
        this.currentBet = parseInt(bet);
    }

    protected initGameAudios() {
        if (!this.gameAudiosPrefab) {
            return;
        }
        const gameAudiosNode = cc.instantiate(this.gameAudiosPrefab);
        this.gameAudios = gameAudiosNode.getComponent(GameAudios);
    }

    protected initHandlers() {
        this.umHandler = new GameBaseUmDataHandler(this);
        this.noticeHandler = new GameBaseNoticeHandler(this);
        this.statusHandler = new GameBaseStatusHandler(this);
        this.betHandler = new GameBaseBetHandler(this);
        this.timeHandler = new GameBaseTimeHandler(this);
        this.errorHandler = new GameBaseErrorHandler(this);
        this.logsHandler = new GameBaseLogsHandler(this);
        this.finishHandler = new GameBaseFinishHandler(this);
        this.configsHandler = new GameBaseConfigsHandler(this);
        this.md5Handler = new GameBaseMd5Handler(this);
        this.oddsHandler = new GameBaseOddsHandler(this);
    }

    protected addHandlers(...handlers: DataHandler[]): void {
        const filterHandlers = handlers.filter((handler) => handler !== null);
        this.dataHandlers.push(...filterHandlers);
    }

    protected clearIntervalAndTimeout() {
        this.timeHandler && this.timeHandler.stopPlayTime();
        this.statusHandler && this.statusHandler.clearTimeout();
    }

    public updateOddsFromConfigs() {
        this.gameConfigs.odds && this.betItems.forEach((item) => item.setOdd(this.gameConfigs.odds[item.node.name]));
    }

    public updateOdds(values) {
        this.betItems.forEach((item) => item.setOdd(values[item.node.name]));
    }

    setGameConfigs(gameConfigs: any) {
        this.gameConfigs = gameConfigs;
        this.updateDisplayForRemoteConfig();
    }

    setBoostedChoices(boostedChoices: any) {
        if (boostedChoices) {
            this.betItems.forEach((item) => item.highLightOdds(boostedChoices.includes(item.node.name)));
        }
    }

    public updateDisplayForRemoteConfig() {
        this.updateOddsFromConfigs();

        if (this.betChips) {
            this.betChips.setChipValues(this.gameConfigs);
        }
    }

    public updateUserBalance() {
        this.node.activeInHierarchy && UserService.getBalance();
    }

    public isUsingMaxStakeLevel() {
        return true;
    }

    openGuide() {
        const dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(WebViewGuide);
        const { minBet, maxBet } = this.getBetRange();
        const locale = getLocale();
        const language = getLanguage(locale !== "vi-VN" && locale !== "en-US" ? "en-US" : locale);
        guide.initURL(this.gameId, language, { minBet, maxBet, used: this.isUsingMaxStakeLevel() });
        guide.sendDataToIframe(this.gameConfigs);
        this.currentMiniPanel.showGuide(dialog);
        guide.loadWebView();
    }

    protected openMD5Guide() {
        const dialog = cc.instantiate(this.guidePrefab);
        const guide = dialog.getComponent(WebViewGuide);
        const { minBet, maxBet } = this.getBetRange();
        const locale = getLocale();
        const language = getLanguage(locale !== "vi-VN" && locale !== "en-US" ? "en-US" : locale);
        guide.initURL(this.gameId, language, { minBet, maxBet, used: this.isUsingMaxStakeLevel() }, "&md5=1");
        guide.sendDataToIframe(this.gameConfigs);
        this.currentMiniPanel.showGuide(dialog);
        guide.loadWebView();
    }

    getBetRange() {
        return this.isUsingMaxStakeLevel() ? this.getVipBetRange() : this.getNormalBetRange();
    }

    getMaxBet(): number {
        return Math.min(this.gameConfigs.maxBet, cc.RedT.userStakeLevel.maxBet);
    }

    getMinBet(): number {
        return Math.max(this.gameConfigs.minBet, cc.RedT.userStakeLevel.minBet);
    }

    protected getNormalBetRange() {
        const { minBet, maxBet } = this.gameConfigs;
        return {
            minBet: minBet,
            maxBet: maxBet
        };
    }

    protected getVipBetRange() {
        return cc.RedT.userStakeLevel;
    }

    showMiniWarningLimitBetChanged() {
        this.showMiniWarning(i18n.t("messages.limitBetChanged"));
    }

    updateUserStakeLevel(data): boolean {
        let updated = false;

        if (data.maxBet && data.minBet && this.node.activeInHierarchy) {
            updated = cc.RedT.userStakeLevelData(data);
        }
        return updated;
    }

    public playClick() {
        AudioManager.getInstance().playClick();
    }

    getBetChoiceString(choice: string): string {
        return GameUtils.getBetChoiceString(choice);
    }

    onIngameMenuInitialized(node: cc.Node) {
        const inGameMenu = node.getComponent(InGameMenu);
        if (inGameMenu) {
            this.inGameMenu = inGameMenu;
            this.initEventForInGameMenu();
        }
    }

    initEventForInGameMenu(): cc.Node {
        const node = this.inGameMenu.node;

        node.on(InGameMenuEvents.OPEN_HISTORY, this.openHistory, this);
        node.on(InGameMenuEvents.OPEN_GUIDE, this.openGuide, this);
        node.on(InGameMenuEvents.CLOSE_GAME, this.onCloseGame, this);
        return node;
    }

    isShowingUM(data) {
        return data.um && this.checkShowUmMessage(data);
    }

    checkShowUmMessage(data: any) {
        return this.currentTimeRemaining <= this.config.betTime || data.remainingTime === this.config.fullTime;
    }

    checkHideUmMessage(data: any) {
        return this.hideUmDataKeys.some(key => data[key] !== undefined);
    }

    openHistory() {}

    onCloseGame() {}

    needShowNextDot() {
        return !this.needHideNextDotRoundHistory && this.normalShowNextDotCondition();
    }

    normalShowNextDotCondition() {
        return this.currentTimeRemaining < this.config.stopBetTime || this.currentTimeRemaining > this.config.fullTime;
    }

    saveSettingKey(key: string, value: any) {
        const gameSetting = GameUtils.getGameSetting(this.gameId);
        gameSetting[key] = value;
        GameUtils.setGameSetting(this.gameId, gameSetting);
    }

    getSettingKey(key: string) {
        const gameSetting = GameUtils.getGameSetting(this.gameId);
        return gameSetting[key];
    }
}
