import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import { getLowercaseObjectKeys } from "../../../common/helpers/ObjectHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BetItem extends cc.Component {
    @property(cc.Label)
    totalBet: cc.Label = null;

    @property(cc.Label)
    ownBet: cc.Label = null;

    @property(cc.Label)
    odds: cc.Label = null;

    @property(cc.Node)
    chipNode: cc.Node = null;

    @property(cc.Node)
    highlight: cc.Node = null;

    @property(cc.Node)
    highlightBackground: cc.Node = null;

    @property(cc.Node)
    highlightBorder: cc.Node = null;

    @property(cc.Node)
    normalBorder: cc.Node = null;

    public betCallback = (e) => {};

    private setMoneyLabel(label: cc.Label, bet: number) {
        if (label) {
            label.string = bet > 0 ? numberWithCommas(bet) : "";
        }
    }

    public setOwnBet(bet: number) {
        this.setMoneyLabel(this.ownBet, bet);
    }

    public setTotalBet(bet: number) {
        this.setMoneyLabel(this.totalBet, bet);
    }

    public onBetClick(e) {
        cc.RedT.audio.playClick();
        this.betCallback(e);
    }

    public setData(data: any) {
        if (data.totalBets) {
            const totalBetsKeys = getLowercaseObjectKeys(data.totalBets);
            this.setTotalBet(data.totalBets[totalBetsKeys[this.node.name.toLowerCase()]]);
        }

        if (data.ownBets) {
            const ownBetsKeys = getLowercaseObjectKeys(data.ownBets);
            const ownBet = data.ownBets[ownBetsKeys[this.node.name.toLowerCase()]];
            ownBet && this.setOwnBet(ownBet);
        }
    }

    public setOdd(value: string) {
        if (this.odds) {
            this.odds.string = `1:${value}`;
        }
    }

    public clearBet() {
        this.setOwnBet(0);
        this.setTotalBet(0);
    }

    public setHighlight(highlight: boolean, isAnimated = true) {
        this.setHighlightItems(highlight, isAnimated);
    }

    public resetHighlight() {
        this.setHighlightItems(false);
    }

    protected setHighlightItems(highlight: boolean, isAnimated = true) {
        this.setHighlightCommon(highlight, isAnimated);
        if (this.highlightBorder) {
            this.highlightBorder.active = highlight;
        }
    }

    protected setHighlightCommon(highlight: boolean, isAnimated = true) {
        this.highlight.active = highlight && isAnimated;
        if (this.highlightBackground) {
            this.highlightBackground.active = highlight && isAnimated;
        }
        if (this.normalBorder) {
            this.normalBorder.active = !highlight;
        }
    }

    protected resetHighlightOptions() {
        this.highlight.active = false;
        if (this.highlightBackground) {
            this.highlightBackground.active = false;
        }
    }

    protected setHighlightItemsOptions(highlight: boolean, isAnimated = true) {
        this.setHighlightCommon(highlight, isAnimated);
        if (this.highlightBorder) {
            this.highlightBorder.active = highlight && !isAnimated;
        }
    }
}
