import SocketIOGameHistoryBase from '../../../_base/view-models/SocketIOGameHistoryBase';
import RongHoHistoryItem from './RongHoHistoryItem';

const { ccclass, property } = cc._decorator;

@ccclass
export default class RongHoHistory extends SocketIOGameHistoryBase {
    @property([cc.SpriteFrame])
    cardTypes: Array<cc.SpriteFrame> = [];

    bindItemRowData(betLog) {
        const historyItemPrefab = cc.instantiate(this.itemPrefab);
        const item = historyItemPrefab.getComponent(RongHoHistoryItem);
        item.setData(betLog);
        this.content.addChild(historyItemPrefab);
    }
}
