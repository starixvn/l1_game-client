import InGameMenu, { InGameMenuEvents } from "./InGameMenu";
import HandleActionSwap from "../../games/texas-holdem-poker/cards-component/view-models/handle-action-swap";
const { ccclass, property } = cc._decorator;
@ccclass
export default class InGameMenuHasSwap extends InGameMenu {
    @property(HandleActionSwap)
    swapComp: HandleActionSwap = null;

    onClickSwapCard() {
        this.node.emit(InGameMenuEvents.CHANGE_SWAP_CARD);
    }
}
