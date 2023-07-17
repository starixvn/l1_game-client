import CascadingSlotTumbleItem from "./CascadingSlotTumbleItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class StandardCascadingSlotTumbleItem extends CascadingSlotTumbleItem {
    prefixSymbol = "symbol-";
    index = 0;
    namespace = "cascadingSlot";
}
