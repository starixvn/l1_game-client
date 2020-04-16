const { ccclass, property } = cc._decorator;
import ChanLe from "../ChanLe";
import ChanLeTurnHistoryItem from "./ChanLeTurnHistoryItem";
import { numberWithCommas, getStringDateByTime, getStringHourByTime } from '../../../../common/helpers/Helper'

@ccclass
export default class ChanLeTurnHistory extends cc.Component {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property([cc.Sprite])
    dices: cc.Sprite[] = [];

    @property(cc.Label)
    totalBetLeft: cc.Label = null;

    @property(cc.Label)
    totalBetRight: cc.Label = null;

    @property(cc.Label)
    totalRefundLeft: cc.Label = null;

    @property(cc.Label)
    totalRefundRight: cc.Label = null;

    @property(cc.Label)
    turnInfo: cc.Label = null;

    @property(cc.Node)
    leftBetChoice: cc.Node = null;

    @property(cc.Node)
    rightBetChoice: cc.Node = null;

    @property(cc.ScrollView)
    scrollViewLeft: cc.ScrollView = null;

    @property(cc.ScrollView)
    scrollViewRight: cc.ScrollView = null;

    @property(cc.Node)
    nextButton: cc.Node = null;

    @property(cc.Node)
    previousButton: cc.Node = null;

    private root: ChanLe;
    private currentTurnId: number;

    init(root: ChanLe, turnId: number) {
        this.root = root;
        this.currentTurnId = turnId;
    }

    onEnable() {
        this.getTurnData(this.currentTurnId);
    }

    onDisable() {
        this.node.destroyAllChildren();
        this.node.destroy();
    }

    onNextClick(event) {
        this.getTurnData(this.currentTurnId + 1);
    }

    onPreviousClick(event) {
        this.getTurnData(this.currentTurnId - 1);
    }

    getTurnData(turnId: number) {
        if (turnId) {
            cc.RedT.inGame.loading.active = true;
            this.root.sendData({ get_phien: { phien: turnId } });
        }
    }

    onData(data: any) {
        cc.RedT.inGame.loading.active = false;
        this.clearData();
        this.buildInfoData(data);
        this.buildDices(data);
        this.buildBetChoices(data);
        this.buildTurnData(data);
    }

    private buildInfoData(data: any) {
        this.totalBetLeft.string = numberWithCommas(data.tong_L);
        this.totalBetRight.string = numberWithCommas(data.tong_R);
        this.totalRefundLeft.string = numberWithCommas(data.tong_tralai_L);
        this.totalRefundRight.string = numberWithCommas(data.tong_tralai_R);
        this.turnInfo.string = data.phien + '  -  ' + getStringDateByTime(data.time);
        this.currentTurnId = data.phien;
        var lastTurnId = this.root.main.getCurrentDataLogs()[0].phien;
        this.nextButton.active = (lastTurnId - data.phien) > 0;
    }

    private buildDices(data: any) {
        var self = this;
        Promise.all(this.dices.map(function (dice, index) {
            var point = data.dice[index];
            dice.spriteFrame = self.root.main.diceFrames[point - 1];
        }));
    }

    private buildBetChoices(data: any) {
        var point = data.dice[0] + data.dice[1] + data.dice[2];

        this.leftBetChoice.color = point % 2 ? this.leftBetChoice.color.fromHEX('#ACACAC') : cc.Color.WHITE;
        this.rightBetChoice.color = point % 2 ? cc.Color.WHITE : this.rightBetChoice.color.fromHEX('#ACACAC');
        this.leftBetChoice.opacity = point % 2 ? 100 : 255;
        this.rightBetChoice.opacity = point % 2 ? 255 : 100;
    }

    private buildTurnData(data: any) {
        var self = this;

        Promise.all(data.dataL.map(function (turnData) {
            var item = cc.instantiate(self.itemPrefab);
            var itemComponent = item.getComponent('ChanLeTurnHistoryItem') as ChanLeTurnHistoryItem;
            itemComponent.time.string = getStringHourByTime(turnData.time);
            itemComponent.userName.string = turnData.name;
            itemComponent.bet.string = numberWithCommas(turnData.bet);
            itemComponent.refund.string = numberWithCommas(turnData.tralai);
            self.scrollViewLeft.content.addChild(item);
        }));

        Promise.all(data.dataR.map(function (turnData) {
            var item = cc.instantiate(self.itemPrefab);
            var itemComponent = item.getComponent('ChanLeTurnHistoryItem') as ChanLeTurnHistoryItem;
            itemComponent.time.string = getStringHourByTime(turnData.time);
            itemComponent.userName.string = turnData.name;
            itemComponent.bet.string = numberWithCommas(turnData.bet);
            itemComponent.refund.string = numberWithCommas(turnData.tralai);
            self.scrollViewRight.content.addChild(item);
        }));
    }

    private clearData() {
        this.scrollViewLeft.content.destroyAllChildren();
        this.scrollViewRight.content.destroyAllChildren();
    }
}
