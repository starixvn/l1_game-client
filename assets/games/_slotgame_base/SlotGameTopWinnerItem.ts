import { shortenName } from '../../common/helpers/NicknameHelper';
import { getStringDateByTime } from './../../common/helpers/DateTimeHelper';
import { numberWithCommas } from './../../common/helpers/NumberHelper';

const { ccclass, property } = cc._decorator;

@ccclass
export default class SlotGameTopWinnerItem extends cc.Component {
    @property(cc.Node)
    bg: cc.Node = null;

    @property(cc.Label)
    time: cc.Label = null;

    @property(cc.Label)
    player: cc.Label = null;

    @property(cc.Label)
    amount: cc.Label = null;

    @property(cc.Label)
    win: cc.Label = null;

    setData(player: any, index: number, showBigWin: boolean) {
        const isLoginUser = player.name === cc.RedT.user.name;
        this.bg.active = index % 2 > 0;
        this.time.string = getStringDateByTime(player.time);
        this.player.string = isLoginUser ? player.name : shortenName(player.name);

        if (showBigWin) {
            this.amount.string = player.freeSpin ? "Free Spin" : numberWithCommas(player.totalAmount, 1);
        } else {
            this.amount.string = numberWithCommas(player.bet, 1);
        }

        this.win.string = numberWithCommas(player.winningAmount);

        if (isLoginUser) {
            this.time.node.color = cc.Color.YELLOW;
            this.player.node.color = cc.Color.YELLOW;
            this.amount.node.color = cc.Color.YELLOW;
            this.win.node.color = cc.Color.YELLOW;
        }
    }
}
