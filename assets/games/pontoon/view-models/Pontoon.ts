import FadeEffectButton from "../../../common/custom-button/FadeEffectButton";
import GameUtils from "../../../common/GameUtils";
import { CardModel } from "../../../common/new-card/view-models/NewCard";
import BlackJack from "../../blackjack/view-models/BlackJack";
import IngameActionHandler from "../../blackjack/view-models/handlers/IngameActionHandler";
import PontoonDealHandler from "./handlers/PontoonDealHandler";
import PontoonFinishHandler from "./handlers/PontoonFinishHandler";
import PontoonInGameHandler from "./handlers/PontoonInGameHandler";

const { ccclass, property } = cc._decorator;

export const PontoonId = 72;

@ccclass
export default class Pontoon extends BlackJack {
    constructor() {
        super();
        this.gameId = PontoonId;
    }

    setupSpecialHandler() {
        this.dealHander = new PontoonDealHandler(this);
        this.ingameActionHander = new IngameActionHandler(this);
        this.finishHandler = new PontoonFinishHandler(this);
        this.ingameHander = new PontoonInGameHandler(this);
    }

    dealerOpenFirstCard(card: CardModel, duration: number) {
        this.dealerOpenCard(card, duration, 0);
    }

    updateOdds() {
        const odds = `${GameUtils.roundFixed(+this.gameConfigs.odds.pontoon - 1, 2)}`;
        this.blackjackOddLabel.string = GameUtils.getText("pontoon.pontoon_pay", { odds });
    }

    onDoubleClick() {
        super.onDoubleClick();
        this.doubleButton.getComponent(FadeEffectButton).setDisabled(true);
    }
}
