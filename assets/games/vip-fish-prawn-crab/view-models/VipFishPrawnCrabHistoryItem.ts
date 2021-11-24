import { getStringDateByTime } from "../../../common/helpers/DateTimeHelper";
import { numberWithCommas } from "../../../common/helpers/NumberHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabHistoryItem extends cc.Component {
    @property(cc.Node)
    background: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    round: cc.Label = null;

    @property(cc.Sprite)
    dices: cc.Sprite[] = [];

    @property(cc.Label)
    gourd: cc.Label = null;

    @property(cc.Label)
    crab: cc.Label = null;

    @property(cc.Label)
    prawn: cc.Label = null;

    @property(cc.Label)
    fish: cc.Label = null;

    @property(cc.Label)
    rooster: cc.Label = null;

    @property(cc.Label)
    stag: cc.Label = null;

    @property(cc.Label)
    anyTriple: cc.Label = null;

    @property(cc.Label)
    mountain: cc.Label = null;

    @property(cc.Label)
    ocean: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    setData(betLog: any, index: number) {
        this.node.active = true;
        this.background.active = index % 2 > 0;

        const { time, phien, settlementResult, betwin } = betLog;

        this.time.string = getStringDateByTime(time);
        this.round.string = phien;
        Object.keys(settlementResult).forEach((choice) => {
            this[choice].string = numberWithCommas(betLog[choice]);
            if (settlementResult[choice]) {
                this[choice].node.color = cc.Color.YELLOW;
            } else {
                this[choice].node.color = cc.Color.WHITE;
            }
        });

        this.win.string = numberWithCommas(betwin, 2);
    }

    setAnimalSprites(result: any, animalSprites: cc.SpriteFrame[]) {
        this.dices[0].spriteFrame = animalSprites[result.dice1];
        this.dices[1].spriteFrame = animalSprites[result.dice2];
        this.dices[2].spriteFrame = animalSprites[result.dice3];
    }
}
