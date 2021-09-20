import { getStringDateByTime } from "../../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BauCuaHistoryItems extends cc.Component {
    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property({ type: cc.Sprite })
    dices: cc.Sprite[] = [];

    @property({ type: cc.Node })
    betList: cc.Node[] = [];

    @property(cc.Label)
    win: cc.Label = null;

    @property(cc.SpriteFrame)
    animalSprites: cc.SpriteFrame[] = [];

    setData(betLog: any) {
        const { time, phien, result, betwin, stag, crab, fish, gourd, prawn, rooster } = betLog;
        this.node.active = true;
        this.time.string = getStringDateByTime(time);
        this.round.string = phien;

        this.dices[0].spriteFrame = this.animalSprites[result.dice1];
        this.dices[1].spriteFrame = this.animalSprites[result.dice2];
        this.dices[2].spriteFrame = this.animalSprites[result.dice3];

        this.betList.forEach((node) => {
            switch (node.name) {
                case "stag":
                    this.handleUINodeBet(node, stag);
                    break;
                case "crab":
                    this.handleUINodeBet(node, crab);
                    break;
                case "fish":
                    this.handleUINodeBet(node, fish);
                    break;
                case "gourd":
                    this.handleUINodeBet(node, gourd);
                    break;
                case "prawn":
                    this.handleUINodeBet(node, prawn);
                    break;
                case "rooster":
                    this.handleUINodeBet(node, rooster);
                    break;
            }
        });

        this.win.string = numberWithCommas(betwin);
        this.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
    }

    handleUINodeBet(node: cc.Node, value: number) {
        if (value > 0) {
            node.active = true;
            node.getComponentInChildren(cc.Label).string = numberWithCommas(value);
            node.getChildByName("value").color = cc.Color.YELLOW;
        }
    }
}
