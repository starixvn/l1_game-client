import { numberWithCommas } from '../../../../common/helpers/NumberHelper';
import SocketIOGameHistoryBase from '../../../_base/view-models/SocketIOGameHistoryBase';
import BauCuaHistoryItems from './BauCuaHistoryItems';

const { ccclass, property } = cc._decorator;
@ccclass
export default class BauCuaHistory extends SocketIOGameHistoryBase {
    @property(cc.SpriteFrame)
    animalSprites: cc.SpriteFrame[] = [];

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(BauCuaHistoryItems);
        item.init(this);
        item.setData(betLog);
        this.content.addChild(itemNode);
    }

    handleUINodeBet(node: cc.Node, value: number) {
        if (value > 0) {
            node.active = true;
            node.getComponentInChildren(cc.Label).string = numberWithCommas(value);
            node.getChildByName("value").color = cc.Color.YELLOW;
        }
    }
}
