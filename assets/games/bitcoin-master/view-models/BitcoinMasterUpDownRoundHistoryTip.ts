import BitcoinMasterUpDownResultDetail from "./BitcoinMasterUpDownResultDetail";

const { property, ccclass } = cc._decorator;

@ccclass
export default class BitcoinMasterUpDownRoundHistoryTip extends cc.Component {
    @property(cc.Label)
    roundId: cc.Label = null;

    @property(BitcoinMasterUpDownResultDetail)
    resultDetail: BitcoinMasterUpDownResultDetail = null;

    public show(show = true) {
        this.node.active = show;
    }

    public setData(data: any) {
        this.roundId.string = `#${data.roundId}`;
        this.resultDetail.setData(data.result);
    }
}
