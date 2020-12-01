import { getStringDateByTime, numberWithCommas } from "./../../../common/helpers/Helper";
import VipSedieWarTicketDetail from "./VipSedieWarTicketDetail";
import VipSedieWarUtils from "./VipSedieWarUtils";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VipSedieWarHistoryItem extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    roundId: cc.Label = null;

    @property(cc.Label)
    bet: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.Prefab)
    ticketDetailPrefab: cc.Prefab = null;

    @property(cc.Node)
    playerResultNode: cc.Node = null;

    @property(cc.Node)
    bankerResultNode: cc.Node = null;

    @property({ type: cc.SpriteFrame })
    dotsFrame: cc.SpriteFrame[] = [];

    getMiniPanel: () => cc.Node;

    detailtData: any;

    setData(data: any) {
        const { time, phien, result, settlementResult, betwin, totalAmount, betLogDetails } = data;

        this.time.string = getStringDateByTime(time);
        this.roundId.string = phien;
        this.win.string = numberWithCommas(betwin);
        this.bet.string = numberWithCommas(totalAmount);

        const playerSprites = this.playerResultNode.children.map(child => {
            const sprite = child.getComponent(cc.Sprite);
            sprite.spriteFrame = this.dotsFrame[0];
            return sprite;
        });
        let index = 0;
        Object.keys(result.player).forEach(key => {
            if (result.player[key]) {
                playerSprites[index].getComponent(cc.Sprite).spriteFrame = this.dotsFrame[1];
                index++;
            }
        });

        const bankerSprites = this.bankerResultNode.children.map(child => {
            const sprite = child.getComponent(cc.Sprite);
            sprite.spriteFrame = this.dotsFrame[0];
            return sprite;
        });
        index = 0;
        Object.keys(result.banker).forEach(key => {
            if (result.banker[key]) {
                bankerSprites[index].getComponent(cc.Sprite).spriteFrame = this.dotsFrame[1];
                index++;
            }
        });

        const row1 = ["player", "banker", "tie", "even", "odd"];
        const row2 = ["playerEven", "playerOdd", "bankerEven", "bankerOdd"];
        const row3 = ["playerRed4", "playerRed3", "playerWhite3", "playerWhite4", "bankerRed4", "bankerRed3", "bankerWhite3", "bankerWhite4"];

        const winChoices1 = [];
        Object.keys(row1).forEach(key => {
            if (settlementResult[row1[key]]) {
                winChoices1.push(VipSedieWarUtils.getBetChoiceString(row1[key]));
            }
        });
        const winChoices2 = [];
        Object.keys(row2).forEach(key => {
            if (settlementResult[row2[key]]) {
                winChoices2.push(VipSedieWarUtils.getBetChoiceString(row2[key]));
            }
        });
        const winChoices3 = [];
        Object.keys(row3).forEach(key => {
            if (settlementResult[row3[key]]) {
                winChoices3.push(VipSedieWarUtils.getBetChoiceString(row3[key]));
            }
        });

        let winChoices: string;
        if (winChoices3.length > 0) {
            winChoices = `${winChoices1.join(', ')}\n${winChoices2.join(', ')}\n${winChoices3.join(', ')}`;
        } else {
            winChoices = `${winChoices1.join(', ')}\n${winChoices2.join(', ')}`;
        }

        this.detailtData = {
            phien,
            betLogDetails,
            winChoices
        }
    }

    onLoad() {
        this.bet.node.on('click', () => {
            this.openTicketDetail();
        }, false);
    }

    openTicketDetail() {
        const miniPanel = this.getMiniPanel();
        const node = cc.instantiate(this.ticketDetailPrefab);
        node.getComponent(VipSedieWarTicketDetail).setData(this.detailtData);
        miniPanel.addChild(node);
    }
}
