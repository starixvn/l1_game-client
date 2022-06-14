import * as i18n from "i18n/runtime-scripts/LanguageData";
import { BlockchainBaccaratRoundHistory } from "../../../event-models/BlockchainBaccaratRoundHistory";
import BlockchainBaccaratCardsUI from "../../../view-models/BlockchainBaccaratCardsUI";
import BlockchainCard from "../../../view-models/card-list/BlockchainCard";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockchainBaccaratLastRoundInfo extends cc.Component {
    @property(cc.Label)
    lastRoundLabel: cc.Label = null;

    @property(cc.Label)
    playerLabel: cc.Label = null;

    @property(cc.Label)
    bankerLabel: cc.Label = null;

    @property(cc.Node)
    cardsUI: cc.Node = null;

    @property(cc.Node)
    playerCard3: cc.Node = null;

    @property(cc.Node)
    bankerCard3: cc.Node = null;

    @property(cc.Label)
    winNoticeLabel: cc.Label = null;

    private readonly winNotice = {
        banker: "banker_win",
        player: "player_win",
        tie: "tie_win"
    };

    onLoad() {
        this.playerLabel.string = i18n.t("ui.choice_player").toUpperCase();
        this.bankerLabel.string = i18n.t("ui.choice_banker").toUpperCase();
        this.lastRoundLabel.string = "Last Round" + ":";
    }

    updateUI(lastRound: BlockchainBaccaratRoundHistory, currentIndex: number) {
        this.cardsUI.active = true;
        if (lastRound.result.player.card3) {
            this.playerCard3.active = true;
        } else {
            this.playerCard3.active = false;
        }
        if (lastRound.result.banker.card3) {
            this.bankerCard3.active = true;
        } else {
            this.bankerCard3.active = false;
        }

        this.cardsUI.getComponent(BlockchainBaccaratCardsUI).showCardsWithoutAnimation(lastRound, currentIndex);
    }
}
