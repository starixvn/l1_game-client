const { ccclass, property } = cc._decorator;
import ChanLe from "../ChanLe";
import ChanLeTurnHistoryItem from "./ChanLeTurnHistoryItem";
import { numberWithCommas, getStringDateByTime, getStringHourByTime, shortenName } from '../../../../common/helpers/Helper'

@ccclass
export default class ChanLeTurnHistory extends cc.Component {
    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Label)
    title: cc.Label = null;

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

    private static readonly LICH_SU_PHIEN = "Lịch sử phiên";
    private root: ChanLe;
    private currentTurnId: number;

    init(root: ChanLe) {
        this.root = root;
    }

    setTurnId(turnId: number) {
        this.currentTurnId = turnId;
        this.title.string = `${ChanLeTurnHistory.LICH_SU_PHIEN} ${this.root.gameTitle}`.toUpperCase();
    }

    onEnable() {
        this.getTurnData(this.currentTurnId);
    }

    onDisable() {
        this.root.hideTurnHistory();
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
        var lastTurnId = this.root.main.dataLogs[0].phien;
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
            var item = self.addItem(turnData);
            self.scrollViewLeft.content.addChild(item);
        }));

        Promise.all(data.dataR.map(function (turnData) {
            var item = self.addItem(turnData);
            self.scrollViewRight.content.addChild(item);
        }));
    }

    private addItem(turnData: any): cc.Node {
        var item = cc.instantiate(this.itemPrefab);
        var itemComponent = item.getComponent('ChanLeTurnHistoryItem') as ChanLeTurnHistoryItem;
        itemComponent.time.string = getStringHourByTime(turnData.time);
        var isLoginUser = turnData.name == cc.RedT.user.name;
        itemComponent.highlight.active = isLoginUser;
        itemComponent.userName.string = isLoginUser ? turnData.name : shortenName(turnData.name);
        itemComponent.bet.string = numberWithCommas(turnData.bet);
        itemComponent.refund.string = numberWithCommas(turnData.tralai);
        return item;
    }

    private clearData() {
        this.scrollViewLeft.content.destroyAllChildren();
        this.scrollViewRight.content.destroyAllChildren();
    }
}
