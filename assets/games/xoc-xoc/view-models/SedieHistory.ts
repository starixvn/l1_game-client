import NewSocketGameBaseHistory from "../../_base/NewSocketGameBaseHistory";
import SedieHistoryItem from "./SedieHistoryItem";
import GameHistoryBase from "./../../_base/GameHistoryBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistory extends NewSocketGameBaseHistory {
    @property(cc.SpriteFrame)
    iconRed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    iconWhite: cc.SpriteFrame = null;

    bindItemRowData(betLog, index) {
        GameHistoryBase.buildItemRowData(this, betLog, index, SedieHistoryItem);
    }
}
