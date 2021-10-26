import MiniRoundHistory from "../../../common/mini-round-history/MiniRoundHistory";
import MiniRoundHistoryItem from "../../../common/mini-round-history/MiniRoundHistoryItem";
import BitcoinMasterUpDownRoundHistoryTip from "./BitcoinMasterUpDownRoundHistoryTip";

const { property, ccclass } = cc._decorator;

@ccclass
export default class BitcoinMasterUpDownMiniRoundHistory extends MiniRoundHistory {
    @property(BitcoinMasterUpDownRoundHistoryTip)
    bitcoinTip: BitcoinMasterUpDownRoundHistoryTip = null;

    public handleBetHistory = (roundId: number) => {};

    onLoad() {
        super.onLoad();
        this.items.forEach((item) => {
            item.node.on("click", () => {
                this.openBetHistory(item.data.roundId);
            });
        });
    }

    openBetHistory(roundId: number) {
        this.handleBetHistory(roundId);
    }

    private listener = {
        onEnter: (node: cc.Node) => {
            this.selectedNode = node;
            this.bitcoinTip.node.position = cc.v3(node.x, this.bitcoinTip.node.y, 0);
            const data = node.getComponent(MiniRoundHistoryItem).data;
            this.bitcoinTip.setData(data);
            this.bitcoinTip.show();
        },
        onLeave: (node: cc.Node) => {
            this.selectedNode = null;
            this.bitcoinTip.show(false);
        }
    };

    protected onUpdate(node: cc.Node) {
        const data = node.getComponent(MiniRoundHistoryItem).data;
        this.bitcoinTip.node.active && this.bitcoinTip.setData(data);
    }

    hideTooltip() {
        this.bitcoinTip.show(false);
    }
}
