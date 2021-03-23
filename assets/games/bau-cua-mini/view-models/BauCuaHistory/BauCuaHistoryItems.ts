import { getStringDateByTime } from '../../../../common/helpers/DateTimeHelper';
import { numberWithCommas } from '../../../../common/helpers/NumberHelper';
import BauCuaHistory from './BauCuaHistory';

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

    bauCuaHistory: BauCuaHistory;

    init(bauCuaHistory: BauCuaHistory) {
        this.bauCuaHistory = bauCuaHistory;
    }

    setData(betLog) {
        const { time, phien, result, betwin, stag, crab, fish, gourd, prawn, rooster } = betLog;
        this.node.active = true;
        this.time.string = getStringDateByTime(time);
        this.round.string = phien;

        this.dices[0].spriteFrame = this.bauCuaHistory.animalSprites[result.dice1];
        this.dices[1].spriteFrame = this.bauCuaHistory.animalSprites[result.dice2];
        this.dices[2].spriteFrame = this.bauCuaHistory.animalSprites[result.dice3];

        this.betList.forEach((node) => {
            switch (node.name) {
                case "stag":
                    this.bauCuaHistory.handleUINodeBet(node, stag);
                    break;
                case "crab":
                    this.bauCuaHistory.handleUINodeBet(node, crab);
                    break;
                case "fish":
                    this.bauCuaHistory.handleUINodeBet(node, fish);
                    break;
                case "gourd":
                    this.bauCuaHistory.handleUINodeBet(node, gourd);
                    break;
                case "prawn":
                    this.bauCuaHistory.handleUINodeBet(node, prawn);
                    break;
                case "rooster":
                    this.bauCuaHistory.handleUINodeBet(node, rooster);
                    break;
            }
        });

        this.win.string = numberWithCommas(betwin);
        this.win.node.color = betwin <= 0 ? cc.Color.WHITE : cc.Color.YELLOW;
    }
}
