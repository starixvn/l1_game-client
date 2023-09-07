import NewCard, { CardModel } from "../../../common/new-card/view-models/NewCard";
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
}
