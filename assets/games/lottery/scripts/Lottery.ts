import SocketIOTableGameBase from "../../_base/SocketIOTableGameBase";
import ItemLayout from "./ItemLayout";
import { LotteryChoicesBoard } from "./LotteryChoicesBoard";
import LotteryGameConfig from "./LotteryGameConfig";
import LotteryTicketConfirmation from "./LotteryTicketConfirmation";
import LotteryTypeItem from "./LotteryTypeItem";
import { games } from "../../../configs/SabaConfigs";
import LotteryHelper from "./LotteryHelper";
import GameUtils from "../../../common/GameUtils";
import LotteryFinishHandler from "./handlers/LotteryFinishHandler";
import LotteryLogsHandler from "./handlers/LotteryLogsHandler";
import LotteryTimeHandler from "./handlers/LotteryTimeHandler";
import LabelItem from "./LabelItem";
import LotteryBetHandler from "./handlers/LotteryBetHandler";
import LotteryResult from "./LotteryResult";
import LotteryExtraResult from "./LotteryExtraResult";
import LotteryHistory from "./LotteryHistory";
import LotteryMiniRoundHistory from "./LotteryMiniRoundHistory";
import LotteryStatusHandler from "./handlers/LotteryStatusHandler";

const { ccclass, property } = cc._decorator;

export enum ChoiceType {
    Set4 = 0,
    Special,
    Head,
    Tail,
    Set27,
    Parlay2,
    Parlay3,
    Parlay4,
    Others
}

@ccclass
export default class Lottery extends SocketIOTableGameBase {
    @property(cc.Node)
    headerContainer: cc.Node = null;

    @property({ type: LotteryChoicesBoard })
    boards: LotteryChoicesBoard[] = [];

    @property(cc.Button)
    confirmButton: cc.Button = null;

    @property({ type: ItemLayout })
    itemLayout: ItemLayout = null;

    @property(cc.Label)
    parlayReminderLabel: cc.Label = null;

    @property(cc.Prefab)
    confirmationPrefab: cc.Prefab = null;

    @property({ type: LabelItem })
    lastSpecialNumbers: LabelItem[] = [];

    @property(cc.Label)
    lastRoundId: cc.Label = null;

    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Prefab)
    resultPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    historyPrefab: cc.Prefab = null;

    @property(cc.Node)
    resultConainer: cc.Node = null;

    @property(cc.Node)
    winningBetLocation: cc.Node = null;

    @property({ type: LotteryMiniRoundHistory })
    miniRoundHistories: LotteryMiniRoundHistory[] = [];

    @property({ type: cc.Node })
    itemLayoutBackgrounds: cc.Node[] = [];

    lotteryTypeItems: LotteryTypeItem[] = [];
    currentTypeIndex = 0;
    selectedItems: string[] = [];
    result: LotteryResult = null;
    extraResult: LotteryExtraResult = null;
    historyComponent: LotteryHistory = null;
    ticketConfirmation: LotteryTicketConfirmation = null;
    ownBets = {};

    constructor() {
        super();
        this.init("Lottery", new LotteryGameConfig(), null, 1, games.Lottery.id);
    }

    onLoad() {
        super.onLoad();
        this.headerContainer.children.forEach((child) => {
            const item = child.getComponent(LotteryTypeItem);
            if (item) {
                this.lotteryTypeItems.push(item);
            }
        });
        this.boards.forEach((board) => {
            board.choiceBoardChanged = (name, selected) => this.onSelectedItemChanged(name, selected);
        });
        this.checkAvailableConfirmation();
        this.animatedTime.setAnimatedY(0, 0);
        this.animatedTime.setRedTime(this.config.stopBetTime);
        this.initMiniHistories();
    }

    initHandlers() {
        super.initHandlers();
        this.timeHandler = new LotteryTimeHandler(this);
        this.logsHandler = new LotteryLogsHandler(this);
        this.finishHandler = new LotteryFinishHandler(this);
        this.betHandler = new LotteryBetHandler(this);
        this.statusHandler = new LotteryStatusHandler(this);
    }

    showWinningBet(bet: number) {
        const winningBet = GameUtils.addFlyingText(this.winningBetLocation, true, bet, 3, 0, 50);
        winningBet.name = "winningBet";
    }

    updateOddsFromConfigs() {
        if (this.gameConfigs.odds) {
            this.lotteryTypeItems.forEach((item, index) => {
                item.setOdds(this.gameConfigs.odds[LotteryHelper.getChoiceTypeKey(index)]);
            });
        }
    }

    protected onGameHide() {
        this.resetDataAndUI();
    }

    resetDataAndUI() {
        super.resetDataAndUI();
        this.animatedTime.setTime("0");
        this.totalBet.string = "";
        if (this.result) {
            this.result.node.active = false;
            this.result = null;
            this.extraResult = null;
        }
        this.clearHighlight();
    }

    showAcceptedBet(bet: number) {
        GameUtils.addFlyingText(this.noticeNode, false, bet, 1);
    }

    onSelectedItemChanged(name: string, selected: boolean) {
        if (selected) {
            this.selectedItems.push(name);
        } else {
            const index = this.selectedItems.findIndex((item) => item === name);
            if (index !== -1) {
                this.selectedItems.splice(index, 1);
            }
        }
        this.updateDisplaySelectedItems();
        this.checkLockSelection();
        this.checkAvailableConfirmation();
    }

    checkLockSelection() {
        const count = this.selectedItems.length;
        let shouldLock = false;
        if (
            this.currentTypeIndex === ChoiceType.Parlay2 ||
            this.currentTypeIndex === ChoiceType.Parlay3 ||
            this.currentTypeIndex === ChoiceType.Parlay4
        ) {
            shouldLock = count > 0 && count >= this.currentTypeIndex - ChoiceType.Parlay2 + 2;
        } else {
            shouldLock = count >= 10;
        }

        if (shouldLock) {
            this.lockItemSelection();
        } else {
            this.unlockItemSelection();
        }
    }

    checkAvailableConfirmation() {
        const count = this.selectedItems.length;
        let available = false;
        if (
            this.currentTypeIndex === ChoiceType.Parlay2 ||
            this.currentTypeIndex === ChoiceType.Parlay3 ||
            this.currentTypeIndex === ChoiceType.Parlay4
        ) {
            available = count > 0 && count === this.currentTypeIndex - ChoiceType.Parlay2 + 2;
        } else {
            available = count > 0;
        }

        const isInBetTime = this.currentTimeRemaining > this.config.stopBetTime && this.currentTimeRemaining <= this.config.betTime;
        this.confirmButton.interactable = available && isInBetTime && (!this.ticketConfirmation || this.ticketConfirmation.isClosed);
    }

    hideTicketConfirmation() {
        if (this.ticketConfirmation && this.ticketConfirmation.node) {
            this.ticketConfirmation.close();
            this.ticketConfirmation = null;
        }
    }

    lockItemSelection() {
        const boardIndex = this.getBoardIndex(this.currentTypeIndex);
        const currentBoard = this.boards[boardIndex];
        currentBoard.lockSelection();
    }

    unlockItemSelection() {
        this.boards.forEach((board) => board.unlockSelection());
    }

    updateDisplaySelectedItems() {
        if (
            this.currentTypeIndex === ChoiceType.Parlay2 ||
            this.currentTypeIndex === ChoiceType.Parlay3 ||
            this.currentTypeIndex === ChoiceType.Parlay4
        ) {
            this.parlayReminderLabel.node.parent.active = true;
            this.updateParlayReminderText();
        } else {
            this.parlayReminderLabel.node.parent.active = false;
        }

        this.itemLayoutBackgrounds.forEach((bg) => (bg.active = false));
        let backgroundIndex = 0;
        switch (this.currentTypeIndex) {
            case ChoiceType.Parlay2:
            case ChoiceType.Parlay3:
            case ChoiceType.Parlay4:
            case ChoiceType.Others:
                backgroundIndex = this.currentTypeIndex - ChoiceType.Parlay2 + 1;
                break;
            default:
                break;
        }

        this.itemLayoutBackgrounds[backgroundIndex].active = true;
        this.itemLayout.updateItems(
            this.selectedItems,
            this.currentTypeIndex !== ChoiceType.Others,
            this.itemLayoutBackgrounds[backgroundIndex]
        );
    }

    updateParlayReminderText() {
        const count = this.currentTypeIndex - ChoiceType.Parlay2 + 2;
        this.parlayReminderLabel.string = `Chọn ${count} số cho một lần cược`;
    }

    clearSelectedItems() {
        this.selectedItems = [];
        this.updateDisplaySelectedItems();
    }

    onLotteryTypeChanged(toggle: cc.Toggle) {
        const id = this.lotteryTypeItems.findIndex((item) => item.toggle === toggle);
        this.currentTypeIndex = id;
        this.showChoiceBoard(this.currentTypeIndex);
        this.unlockItemSelection();
        this.clearSelectedItems();
        this.checkAvailableConfirmation();
    }

    getBoardIndex(index: number): number {
        let selectedIndex: number;
        switch (index) {
            case ChoiceType.Head:
            case ChoiceType.Tail:
                selectedIndex = 1;
                break;
            case ChoiceType.Set4:
            case ChoiceType.Set27:
            case ChoiceType.Special:
            case ChoiceType.Parlay2:
            case ChoiceType.Parlay3:
            case ChoiceType.Parlay4:
                selectedIndex = 0;
                break;
            case ChoiceType.Others:
                selectedIndex = 2;
                break;
        }
        return selectedIndex;
    }

    showChoiceBoard(index: number) {
        const selectedIndex = this.getBoardIndex(index);
        const highlightData = this.getHighlightData();
        this.boards.forEach((board, i) => {
            const show = i === selectedIndex;
            board.node.active = show;
            if (show) {
                board.resetBoard();
                board.resetScrolling();
                board.setHighlightResult(highlightData);
            }
        });
    }

    onConfirmClick() {
        this.confirmButton.interactable = false;

        const node = cc.instantiate(this.confirmationPrefab);
        this.currentMiniPanel.addDialog(node);
        const dialog = node.getComponent(LotteryTicketConfirmation);
        const key = LotteryHelper.getChoiceTypeKey(this.currentTypeIndex);
        dialog.show({
            choiceType: this.currentTypeIndex,
            roundId: this.roundId,
            odds: this.gameConfigs.odds[key],
            maxBet: Math.min(this.gameConfigs.maxbet, this.gameConfigs.choices_maxbet[key]),
            bet: 0,
            selectedItems: this.selectedItems,
            maxBetTotal: this.gameConfigs.maxbet,
            ownBets: this.ownBets
        });

        dialog.callback.acceptedBet = this.acceptedBet.bind(this);
        dialog.callback.cancel = () => this.checkAvailableConfirmation();
        this.ticketConfirmation = dialog;
    }

    acceptedBet(info: any) {
        if (this.isDisableGame) {
            return;
        }

        if (this.waitingProcessing) {
            this.showProcessingWarning(true);
        } else {
            this.waitingProcessing = true;
            const betData = {
                betChoice: this.createBetChoice(this.currentTypeIndex, this.selectedItems, info.bet)
            };
            this.socket && this.socket.connected && this.socket.emit("bet", betData);
            this.clearSelectedItems();
            const boardIndex = this.getBoardIndex(this.currentTypeIndex);
            const currentBoard = this.boards[boardIndex];
            currentBoard.resetBoard();
            this.checkAvailableConfirmation();
        }
    }

    createBetChoice(choiceType: number, selectedItems: string[], bet: number): any {
        const key = LotteryHelper.getChoiceTypeKey(choiceType);
        const result = {};
        const subInfo = {};
        result[key] = subInfo;
        if (choiceType === ChoiceType.Parlay2 || choiceType === ChoiceType.Parlay3 || choiceType === ChoiceType.Parlay4) {
            subInfo[selectedItems.join("-")] = bet;
            return result;
        } else {
            selectedItems.forEach((item) => (subInfo[item] = bet));
            return result;
        }
    }

    setSpecialNumbers(lastSpecial: string) {
        for (let i = 0; i < lastSpecial.length; i++) {
            const num = lastSpecial.charAt(i);
            this.lastSpecialNumbers[i].setValue(num);
        }
    }

    setLastRoundId(roundId: number) {
        this.lastRoundId.string = `#${roundId}`;
    }

    showResult(dataFinish: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this.showResultDialog();
            cc.tween(this.node)
                .call(async () => {
                    await this.setResult(dataFinish, true);
                    resolve();
                })
                .start();
        });
    }

    showLastSpecialResult(show: boolean) {
        this.lastRoundId.node.parent.active = show;
        this.lastSpecialNumbers[0].node.parent.active = show;
    }

    showResultDialog() {
        if (this.result) {
            return;
        }
        const node = cc.instantiate(this.resultPrefab);
        this.resultConainer.addChild(node);
        this.result = node.getComponent(LotteryResult);
        this.extraResult = node.getComponent(LotteryExtraResult);
    }

    async setResult(data: any, animated) {
        if (!this.result) {
            return;
        }
        await this.result.setData(data.result, animated);
        this.extraResult.setData(this.calculateFinishNumberStatistics(data.settlementResult["27Sets"]));
    }

    calculateFinishNumberStatistics(data: string[]): string[] {
        const result = {};
        for (let i = 0; i < 10; i++) {
            const key = i.toString();
            const list = [];
            data.forEach((num) => {
                if (num.charAt(0) === key) {
                    const secondChar = num.charAt(1);
                    list.push(secondChar);
                }
            });

            list.sort((a, b) => +a - +b);
            result[key] = list.join(",");
        }
        return Object.values(result);
    }

    hideResultDialog() {
        if (!this.result) {
            return;
        }
        this.result.close();
        this.result = null;
        this.extraResult = null;
    }

    updateLastResult() {
        const lastFinish = this.currentDataLogs[0];
        const result = lastFinish.result;
        const lastSpecial = result.special[0];
        this.setSpecialNumbers(lastSpecial);
        this.setLastRoundId(lastFinish.roundId);
    }

    highlightLastResult() {
        this.boards.forEach((board) => {
            board.showHighlight(true);
        });
        const boardIndex = this.getBoardIndex(this.currentTypeIndex);
        const currentBoard = this.boards[boardIndex];
        currentBoard.setHighlightResult(this.getHighlightData());
    }

    clearHighlight() {
        this.boards.forEach((board) => board.clearHighlight());
    }

    getHighlightData(): string[] {
        const lastData = this.currentDataLogs[0];
        switch (this.currentTypeIndex) {
            case 0:
                return lastData.settlementResult["4Sets"];
            case 1:
                return [...lastData.result.special.slice(-2)];
            case 2:
                return [...lastData.settlementResult.head];
            case 3:
                return [...lastData.settlementResult.tail];
            case 4:
            case 5:
            case 6:
            case 7:
                return lastData.settlementResult["27Sets"];
            case 8:
                const arr = [];
                const others = lastData.settlementResult.others;
                Object.keys(others).forEach((key) => {
                    if (others[key]) {
                        arr.push(key);
                    }
                });
                return arr;
        }
        return [];
    }

    initMiniHistories() {
        const condition = () => {
            return this.currentTimeRemaining < this.config.stopBetTime;
        };

        this.miniRoundHistories.forEach((history) => history.init(condition));
    }

    updateMiniRoundHistories() {
        this.miniRoundHistories.forEach((history) => history.setData(this.currentDataLogs));
    }

    onDataGameRoom(data) {
        if (data.history) {
            this.historyComponent.onData(data.history);
        }

        super.onDataGameRoom(data);
    }

    onOpenGuide() {
        cc.RedT.audio.playClick();
        // const node = cc.instantiate(this.guidePrefab);
        // this.currentMiniPanel.addDialog(node);
        // this.guideComponent = node.getComponent(LotteryGuide);
    }

    onOpenHistory() {
        cc.RedT.audio.playClick();
        const node = cc.instantiate(this.historyPrefab);
        this.historyComponent = node.getComponent(LotteryHistory);
        this.historyComponent.init(this.socket);
        this.currentMiniPanel.addDialog(node);
    }
}
