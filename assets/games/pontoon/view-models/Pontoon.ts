import BlackJack from "../../blackjack/view-models/BlackJack";

const { ccclass, property } = cc._decorator;

export const PontoonId = 72;

@ccclass
export default class Pontoon extends BlackJack {
    constructor() {
        super();
        this.gameId = PontoonId;
    }
}
