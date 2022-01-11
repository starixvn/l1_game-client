import oddOption from "./texas-holdem-poker-odds";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TexasHoldemPokerOddsTable extends cc.Component {
    @property({ type: [oddOption] })
    oddOptions: oddOption[] = [];
}
