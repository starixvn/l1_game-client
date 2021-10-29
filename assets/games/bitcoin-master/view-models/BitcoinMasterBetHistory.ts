import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import ItemContentMenu from "../../../common/helpers/Menu/ItemContentMenu";
import GameBetHistoryBase from "../../_base/view-models/GameBetHistoryBase";
import { BitcoinMasterBetType, BitcoinMasterHeaderMenu } from "./BitcoinMasterCommon";
import BitcoinMasterEvenOddResultDetail from "./BitcoinMasterEvenOddResultDetail";
import BitcoinMasterGapAmount from "./BitcoinMasterGapAmount";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterBetHistory extends GameBetHistoryBase {
    @property(cc.Node)
    header: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    openValue: cc.Label = null;

    @property(cc.Label)
    closeValue: cc.Label = null;

    @property(BitcoinMasterGapAmount)
    gapAmountComp: BitcoinMasterGapAmount = null;

    @property(cc.Node)
    generalInfoNode: cc.Node = null;

    @property(cc.Label)
    evenOddResult: cc.Label = null;

    @property(BitcoinMasterEvenOddResultDetail)
    evenOddResultDetail: BitcoinMasterEvenOddResultDetail = null;

    @property(cc.Node)
    titleNode: cc.Node = null;

    protected activeTab = BitcoinMasterHeaderMenu.upDown;

    onData(data: any) {
        super.onData(data);
        this.data = data;
        this.roundIdLabel.string = `#${data.id}`;
        this.time.string = getStringDateByTime(data.time);
        this.loadUpDownData();
    }

    onSelectHeader(event, name) {
        this.header.children.forEach((header) => {
            const menuComponent = header.getComponent(ItemContentMenu);

            if (header.name === name) {
                this.activeTab = name;
                menuComponent.select();
            } else {
                menuComponent.unselect();
            }
        });

        name === BitcoinMasterHeaderMenu.upDown ? this.loadUpDownData() : this.loadEvenOddData();
    }

    loadUpDownData() {
        this.resetBettingUserList();

        this.generalInfoNode.getChildByName(BitcoinMasterHeaderMenu.upDown).active = true;
        this.generalInfoNode.getChildByName(BitcoinMasterHeaderMenu.evenOdd).active = false;

        const { result } = this.data;
        this.openValue.string = result.open;
        this.closeValue.string = result.close;
        this.gapAmountComp.setData(result);

        this.showUpDownTitle(true);
        this.loadBettingUserList(BitcoinMasterBetType.up, BitcoinMasterBetType.down);
    }

    loadEvenOddData() {
        this.resetBettingUserList();

        this.generalInfoNode.getChildByName(BitcoinMasterHeaderMenu.upDown).active = false;
        this.generalInfoNode.getChildByName(BitcoinMasterHeaderMenu.evenOdd).active = true;

        this.evenOddResult.string = this.data.result.close;
        this.evenOddResultDetail.setData(this.data.result.close);
        this.evenOddResultDetail.setColor();

        this.showUpDownTitle(false);
        this.loadBettingUserList(BitcoinMasterBetType.even, BitcoinMasterBetType.odd);
    }

    showUpDownTitle(show = true) {
        this.titleNode.getChildByName(BitcoinMasterBetType.up).active = show;
        this.titleNode.getChildByName(BitcoinMasterBetType.down).active = show;
        this.titleNode.getChildByName(BitcoinMasterBetType.even).active = !show;
        this.titleNode.getChildByName(BitcoinMasterBetType.odd).active = !show;
    }
}
