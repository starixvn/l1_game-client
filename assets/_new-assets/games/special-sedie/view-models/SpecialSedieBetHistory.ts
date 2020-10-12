import { getStringDateByTime, getStringHourByTime, numberWithCommas } from "./../../../common/helpers/Helper";
import SpecialSedieBetHistoryItem from "./SpecialSedieBetHistoryItem";

const { ccclass, property } = cc._decorator;
@ccclass
export default class SpecialSedieBetHistory extends cc.Component {

    @property(cc.Label)
    roundIdLabel: cc.Label = null;

    @property(cc.Node)
    dots: cc.Node = null;

    @property(cc.SpriteFrame)
    redDot: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    whiteDot: cc.SpriteFrame = null;

    @property(cc.Label)
    evenBetAmount: cc.Label = null;

    @property(cc.Label)
    evenRefundAmount: cc.Label = null;

    @property(cc.Label)
    oddBetAmount: cc.Label = null;

    @property(cc.Label)
    oddRefundAmount: cc.Label = null;

    @property(cc.Node)
    evenContent: cc.Node = null;

    @property(cc.Node)
    oddContent: cc.Node = null;

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    private socket: SocketIOClient.Socket;
    private roundId: number = 0;

    data: any = {
        even: {
            bets: [{
                bet: 55,
                betwin: 52.80,
                name: "DayConvey",
                time: "2020-10-08T02:21:01.509Z",
                refund: 0
            }],
            totalAmount: 55.00,
            totalRefund: 0.00
        },
        odd: {
            bets: [{
                bet: 55,
                betwin: 0,
                name: "Farfothich",
                time: "2020-10-08T02:21:01.506Z",
                refund: 0
            }],
            totalAmount: 55.00,
            totalRefund: 0.00
        },
        result: { red1: true, red2: false, red3: false, red4: true },
        roundId: 370537,
        time: "2020-10-08T02:21:31.512Z"
    }

    init(socket:SocketIOClient.Socket, roundId: number) {
        this.socket = socket;
        this.roundId = roundId;
    }

    onDisable() {
        this.node.destroy();
    }

    onLoad() {
        if (!cc.sys.isMobile) {
            this.node.scale = 0.8;
        }

        this.getRound(this.roundId);
        //this.onData(this.data);
    }

    onNextClick() {
        this.getRound(this.roundId + 1);
    }

    onPreviousClick() {
        this.getRound(this.roundId - 1);
    }

    getRound(roundId: number) {
        this.socket.emit("getRound",{roundId});
    }

    onData(data: any) {
        this.resetData();

        const {id, time, total, result, even, odd} = data;
        this.roundId = id;
        this.roundIdLabel.string = `${id} - ${getStringDateByTime(time)}`;

        this.evenBetAmount.string = numberWithCommas(total?.even?.betAmount ?? 0);
        this.evenRefundAmount.string = numberWithCommas(total?.even?.refund ?? 0);
        this.oddBetAmount.string = numberWithCommas(total?.odd?.betAmount ?? 0);
        this.oddRefundAmount.string = numberWithCommas(total?.odd?.refund ?? 0);
        

        this.updateDotsResult(result);

        even && even.forEach(user => {
            let item = this.addItem(user);
            this.evenContent.addChild(item);
        });

        odd && odd.forEach(user => {
            let item = this.addItem(user);
            this.oddContent.addChild(item);
        });
    }

    updateDotsResult(result: any) {
        Object.keys(result).forEach((key, index)=>{
            const dot = this.dots.children[index]?.getComponent(cc.Sprite);
            dot.spriteFrame=result[key] ? this.redDot : this.whiteDot;
        });
    }

    addItem(data: any) {
        let item = cc.instantiate(this.itemPrefab);
        let itemComponent = item.getComponent(SpecialSedieBetHistoryItem);

        let isLoginUser = data.name == cc.RedT.user.name;
        itemComponent.highlight.active = isLoginUser;
        itemComponent.time.string = getStringHourByTime(data.time);
        itemComponent.username.string = data.name;
        itemComponent.betAmount.string = numberWithCommas(data.amount);
        itemComponent.refund.string = numberWithCommas(data.refund);
        
        return item;
    }

    resetData() {
        this.evenContent.destroyAllChildren();
        this.oddContent.destroyAllChildren();
    }    
}
