import CardLayout from "../../../../blackjack/view-models/CardLayout";

const { ccclass, executeInEditMode, menu } = cc._decorator;

@ccclass
@executeInEditMode
export default class HoldemPokerCardLayout extends CardLayout {
    selectedPosY = 5;
    selectedPosZ = 40;
}
