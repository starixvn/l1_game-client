import BlackJackHistory from "../../blackjack/view-models/BlackJackHistory";
import ChineseBlackjackHistoryItemGroup from "./ChineseBlackjackHistoryItemGroup";

const { ccclass } = cc._decorator;

@ccclass
export default class ChineseBlackjackHistory extends BlackJackHistory {
    constructor() {
        super();
        this.enablePF = true;
    }

    onData(data) {
        const { page, pageSize, total, betLogs } = data;
        this.pagination.onSet(page, pageSize, total);
        this.content.destroyAllChildren();
        this.scrollView && this.scrollView.scrollToTop(0.1);

        if (!betLogs || !betLogs.length) {
            return;
        }

        this.updateUI(betLogs);
    }

    updateUI(betLogs) {
        let currentRoundId = 0;
        let currentItemGroupComponent: ChineseBlackjackHistoryItemGroup;
        let enableBg = true;
        betLogs.forEach((betLog, index) => {
            const isFirstRow = index == 0;
            const isNewRound = currentRoundId != betLog.roundId;

            function addNewGroupItem() {
                const itemGroup = cc.instantiate(this.itemGroupPrefab);
                currentItemGroupComponent = itemGroup.getComponent(ChineseBlackjackHistoryItemGroup);
                this.content.addChild(itemGroup);
                currentItemGroupComponent.init(this.socket);
                currentItemGroupComponent.setBackground(enableBg);
                currentItemGroupComponent.addItem(betLog);
                currentItemGroupComponent.roundId = betLog.roundId;
            }

            if (isFirstRow) {
                addNewGroupItem.call(this);
            } else if (isNewRound) {
                enableBg = !enableBg;
                addNewGroupItem.call(this);
            } else {
                currentItemGroupComponent.addItem(betLog);
            }
            currentRoundId = betLog.roundId;
        });
    }
}
