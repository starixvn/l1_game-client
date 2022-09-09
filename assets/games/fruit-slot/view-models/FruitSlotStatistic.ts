import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import { FruitSlotRoundHistory } from "../event-handlers/FruitSlotRoundHistoryHandler";
import FruitSlotMiniRoundHistoryItem from "./FruitSlotMiniRoundHistoryItem";

const { ccclass, property } = cc._decorator;

export enum CardVerificationState {
    blankNew = 0,
    serialChange,
    privateChange
}
@ccclass
export default class FruitSlotStatistic extends cc.Component {
    @property(cc.Node)
    symbolPercent: cc.Node = null;

    @property(cc.Label)
    bigPercent: cc.Label = null;

    @property(cc.Label)
    smallPercent: cc.Label = null;

    @property(cc.Node)
    history: cc.Node = null;

    @property(cc.Prefab)
    miniRoundHistoryItem: cc.Prefab = null;

    @property(CommonDialog)
    commonDialog: CommonDialog = null;

    private readonly maxItems = 100;
    private readonly maxCol = 20;
    private isRenderNext = false;
    private rounds: any[] = [];
    private items: any[] = [];

    onLoad() {
        this.commonDialog.addOnDidHide(() => {
            this.node.active = false;
        });
        this.initMiniRoundHistory();
    }

    render(roundsHistory: FruitSlotRoundHistory[]) {
        this.rounds = [...roundsHistory];
        while (this.rounds.length < this.maxItems) {
            this.rounds.unshift(null);
        }
        this.calculatePercent();
        this.setDataHistory(false);
    }

    addItem(round: FruitSlotRoundHistory) {
        if (this.isRenderNext) {
            this.isRenderNext = false;
        }
        const index = this.rounds.findIndex((r) => r !== null);
        if (index > 0) {
            this.rounds[index - 1] = round;
        } else {
            if (index === 0) {
                this.rounds[0] = round;
            } else {
                this.rounds.unshift(round);
                this.rounds.length > this.maxItems && this.rounds.pop();
            }
        }
        this.calculatePercent();
        this.setDataHistory(false);
    }

    addNextItemHistory() {
        if (this.isRenderNext) {
            return;
        }
        this.rounds.unshift(null);
        while (this.rounds.length > this.maxItems) {
            this.rounds.pop();
        }
        this.setDataHistory(true);
        this.isRenderNext = true;
    }

    private initMiniRoundHistory() {
        for (let i = 0; i < this.maxItems; i++) {
            const item = cc.instantiate(this.miniRoundHistoryItem);
            item.getComponent(FruitSlotMiniRoundHistoryItem).setData(null);
            this.history.children[Math.floor(i / this.maxCol)].addChild(item);
            this.items.push(item);
        }
    }

    private calculatePercent() {
        const symbolStatistic = { bar: 0, tripleSeven: 0, star: 0, bell: 0, watermelon: 0, orange: 0, lemon: 0, cherry: 0 };
        const bigSmallStatistic = { big: 0, small: 0 };
        let total = 0;
        this.rounds.forEach((round) => {
            if (round) {
                for (const key in symbolStatistic) {
                    total += 1;
                    round.settlementResult[key] && symbolStatistic[key]++;
                }
                if (round.settlementResult.big) {
                    bigSmallStatistic.big += 1;
                } else {
                    bigSmallStatistic.small += 1;
                }
            }
        });
        this.bigPercent.string = `${bigSmallStatistic.big}% `;
        this.smallPercent.string = ` ${bigSmallStatistic.small}%`;
        for (const key in symbolStatistic) {
            this.symbolPercent.getChildByName(key).getComponent(cc.Label).string = `${
                total === 0 ? 0 : (symbolStatistic[key] * total) / 100
            }%`;
        }
    }

    private setDataHistory(isNextItem: boolean) {
        this.rounds.forEach((round, index) => {
            this.items[index].getComponent(FruitSlotMiniRoundHistoryItem).setData(round, isNextItem);
        });
    }
}
