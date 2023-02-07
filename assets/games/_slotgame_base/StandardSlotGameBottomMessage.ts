import SlotGameBottomMessage from "./SlotGameBottomMessage";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardSlotGameBottomMessage extends SlotGameBottomMessage {
    updateMessageContent(msg) {
        this.msgText.string = msg.toUpperCase();
    }
}
