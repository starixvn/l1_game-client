import * as i18n from "i18n/runtime-scripts/LanguageData";

const { ccclass, property } = cc._decorator;

@ccclass
export default abstract class BigSmallRoundResult extends cc.Component {
    @property(cc.Sprite)
    dice1: cc.Sprite = null;

    @property(cc.Sprite)
    dice2: cc.Sprite = null;

    @property(cc.Sprite)
    dice3: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;

    @property(cc.Label)
    total: cc.Label = null;

    @property(cc.Label)
    result: cc.Label = null;

    @property(cc.Sprite)
    highlight: cc.Sprite = null;

    onLoad() {
        cc.tween(this.highlight.node)
            .repeatForever(
                cc.tween().to(0.4, { opacity: 150 }, { easing: "cubicIn" }).delay(0.4).to(0.4, { opacity: 255 }, { easing: "cubicOut" })
            )
            .start();
    }

    updateLabels(data: any) {
        const { settlementResult, result } = data;
        const choice = this.getTextFollowChoice({ settlementResult });

        this.total.string = result.dice1 + result.dice2 + result.dice3;
        this.result.string = i18n.t(`ui.scoreboard_${choice}`);
    }

    getTextFollowChoice({ settlementResult }): string {
        return settlementResult.big ? "big" : "small";
    }
}
