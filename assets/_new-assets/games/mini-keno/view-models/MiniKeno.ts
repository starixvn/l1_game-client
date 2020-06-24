import GameMiniBase from "../../_base/GameMiniBase";
import MiniKenoConfig from "./MiniKenoConfig";
import MiniKenoFinishHandler from "./handlers/MiniKenoFinishHandler";
import KenoNumber from "../../keno-pro/view-models/KenoNumber";
import MiniKenoTimeHandler from "./handlers/MiniKenoTimeHandler";
import MiniKenoLogsHandler from "./handlers/MiniKenoLogsHandler";
import RoundHistory from "../../keno-pro/view-models/RoundHistory";
import KenoUtils, { KenoType } from "./KenoUtils";
import { GameState } from "../../_base/GameBase";
import MiniKenoBetBoard, { BetInfo } from "./components/MiniKenoBetBoard";
import MiniKenoBetItem from "./components/MiniKenoBetItem";
import MiniKenoBetItems from "./components/MiniKenoBetItems";
import MiniKenoTimer from "./components/MiniKenoTimer";
import MiniKenoRoundResult from "./components/MiniKenoRoundResult";
import MiniKenoStatusHandler from "./handlers/MiniKenoStatusHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MiniKeno extends GameMiniBase {
    @property({ type: cc.Enum(KenoType) })
    kenoType: KenoType = KenoType.Max;

    @property(cc.Label)
    kenoName: cc.Label = null;

    @property(cc.Toggle)
    favourite: cc.Toggle = null;

    @property({ type: cc.SpriteFrame })
    headerFrames: cc.SpriteFrame[] = [];

    @property(cc.Sprite)
    headerBg: cc.Sprite = null;

    @property(cc.Node)
    bodyBg: cc.Node = null;

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

    @property(cc.Prefab)
    betBoardPrefab: cc.Prefab = null;

    @property(cc.Node)
    roundResultContainer: cc.Node = null;

    @property(cc.Prefab)
    roundResultPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    roundHistoryPrefab: cc.Prefab = null;

    @property(cc.Button)
    rebet: cc.Button = null;

    public kenoNumbers: KenoNumber[] = [];
    public onFavoriteChanged = (favourite: boolean, type: number) => { };
    public getPreset = () => { return 0 };
    public roundHistory: RoundHistory;
    public roundResult: MiniKenoRoundResult;
    public betBoard: MiniKenoBetBoard;
    public kenoTimer: MiniKenoTimer;
    public lastBetInfo: BetInfo = null;
    public statusCallback = (gameName: number, roundId: number, winAmount: number) => { }
    public isMiniKeno: boolean;

    onLoad() {
        this.gameName = `keno${KenoType[this.kenoType]}`;
        this.config = new MiniKenoConfig(this.kenoType);
        this.kenoName.string = KenoUtils.getKenoName(this.kenoType);
        this.isMiniKeno = this.kenoType == KenoType.Mini || this.kenoType == KenoType.Mini2;

        this.initComponents();
        this.initHeaderBackground();
        this.enableRebetButton(false);

        super.onLoad();
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
            North: 2,
        };
        const colors = [
            new cc.Color(72, 109, 216),
            new cc.Color(137, 95, 50),
            new cc.Color(66, 130, 44),
        ];

        const bgIndex = dict[KenoType[this.kenoType]];
        this.headerBg.spriteFrame = this.headerFrames[bgIndex];
        this.bodyBg.color = colors[bgIndex];
        this.betBoard.background.color = colors[bgIndex];
    }

    onDestroy() {
        this.clearIntervalAndTimeout();
        this.betBoard.destroy();
        this.roundHistory.destroy();
        this.roundResult.destroy();
        cc.RedT.removeDataObserver(this.gameName);
        super.onDestroy();
    }

    initHandlers() {
        super.initHandlers();

        this.finishHandler = new MiniKenoFinishHandler(this);
        this.timeHandler = new MiniKenoTimeHandler(this);
        this.logsHandler = new MiniKenoLogsHandler(this);
        this.statusHandler = new MiniKenoStatusHandler(this);
    }

    public onReBetClick() {
        cc.RedT.audio.playClick();
        if (this.isDisabledBet()) {
            return;
        }

        const betInfo = { ...this.lastBetInfo };
        betInfo.title = `${KenoUtils.getKenoName(this.kenoType)} - #${this.roundId}`;
        this.betBoard.show(betInfo);
    }

    protected isDisabledBet(): boolean {
        return this.currentTimeRemaining <= this.config.stopBetTime
            || this.currentTimeRemaining >= this.config.betTime
            || this.gameState == GameState.Stopped;
    }

    public onBetItemClick(e) {
        cc.RedT.audio.playClick();

        if (this.isDisabledBet()) {
            return;
        }

        const betChoice = e.target.name;
        const betInfo = {
            title: `${KenoUtils.getKenoName(this.kenoType)}`,
            roundId: `#${this.roundId}`,
            odd: this.gameConfigs.odds[betChoice],
            choice: betChoice,
            minBet: this.gameConfigs.minbet,
            maxBet: this.gameConfigs.choices_maxbet[betChoice],
            bet: 0,
        };
        this.betBoard.show(betInfo);
    }

    public enableRebetButton(enabled: boolean) {
        this.rebet.interactable = enabled;
        this.rebet.node.opacity = enabled ? 255 : 102;
    }

    public toggleFavorite() {
        cc.RedT.audio.playClick();
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
        const xPosition = direction == "right" ? node.width : -node.width;

        node.runAction(
            cc.sequence(
                cc.moveBy(0, cc.v2(xPosition, 0)),
                cc.spawn(
                    cc.fadeIn(transitionTime).easing(cc.easeSineInOut()),
                    cc.moveBy(transitionTime, cc.v2(-xPosition, 0)).easing(cc.easeSineInOut())
                )
            )
        );

        tempNode.runAction(cc.sequence(
            cc.spawn(
                cc.fadeOut(transitionTime).easing(cc.easeSineInOut()),
                cc.moveBy(transitionTime, cc.v2(-xPosition, 0)).easing(cc.easeSineInOut())),
            cc.delayTime(transitionTime * 1.5),
            cc.callFunc(() => {
                tempNode.destroy();
            })
        ));
    }

    public updateRoundHistory() {
        this.roundHistory.setData(this.currentDataLogs);
    }

    protected sendBet(betAmount, betChoice) {
        this.bet({ bet: { amount: betAmount, betChoice: betChoice } });
    }

    protected initComponents() {
        this.initBetItems();
        this.initRoundHistory();
        this.initRoundResult();
        this.initBetBoard();
        this.initTimer();
    }

    protected initBetItems() {
        const betItemsNode = cc.instantiate(this.betItemsPrefab);
        const betItems = betItemsNode.getComponent(MiniKenoBetItems);
        this.betItems = betItems.betItems;
        this.body.addChild(betItemsNode);
        this.betItems.forEach(item => { item.betCallback = (e) => { this.onBetItemClick(e); } });
    }

    protected initRoundHistory() {
        const roundHistoryNode = cc.instantiate(this.roundHistoryPrefab);
        this.roundHistory = roundHistoryNode.getComponent(RoundHistory);
        this.body.addChild(roundHistoryNode);
        this.roundHistory.node.active = true;
    }

    protected initRoundResult() {
        this.betItems.forEach(item => {
            const miniKenoBetItem = item as MiniKenoBetItem;
            const rule = KenoUtils.getKenoRuleChoice(item.node.name, this.isMiniKeno);
            miniKenoBetItem.setRule(rule);
        });

        const roundResultNode = cc.instantiate(this.roundResultPrefab);
        this.roundResult = roundResultNode.getComponent(MiniKenoRoundResult);
        this.roundResultContainer.addChild(roundResultNode);
        this.roundResult.init(this.isMiniKeno);
    }

    protected initBetBoard() {
        const betBoardNode = cc.instantiate(this.betBoardPrefab);
        this.betBoard = betBoardNode.getComponent(MiniKenoBetBoard);
        this.betBoard.getPreset = () => { return this.getPreset(); };
        this.betBoard.betCallback = (betAmount, info) => {
            if (betAmount > 0) {
                this.enableRebetButton(true);
                this.sendBet(betAmount, info.choice);

                this.lastBetInfo = info;
                this.lastBetInfo.bet = betAmount;
            }
        };
        this.betBoard.node.active = false;
        this.center.addChild(betBoardNode);
    }

    protected initTimer() {
        const timerNode = cc.instantiate(this.timerPrefab);
        this.kenoTimer = timerNode.getComponent(MiniKenoTimer);
        this.animatedTime = this.kenoTimer;
        this.timer.addChild(this.kenoTimer.node);
    }


}
