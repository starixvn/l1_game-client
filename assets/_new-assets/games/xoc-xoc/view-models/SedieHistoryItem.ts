import MiniSedieHistoryItem from "../../mini-sedie/viewModels/MiniSedieHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistoryItem extends MiniSedieHistoryItem {
    
    @property(cc.Label)
    red2: cc.Label = null;

    @property(cc.Node)
    linkIcon: cc.Node = null;

    @property(cc.Node)
    scoinIcon: cc.Node = null;
}
