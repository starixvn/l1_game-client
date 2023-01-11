import GameUtils from "../../../common/GameUtils";
import SocketIOGameHistoryBase from "../../_base/view-models/SocketIOGameHistoryBase";
import VipFishPrawnCrabHistoryItem from "./VipFishPrawnCrabHistoryItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabHistory extends SocketIOGameHistoryBase {
    start() {
        super.start();
        const header = this.wrapperContent.children[1];
        GameUtils.setFontSizeLabelsInNode(header, true, cc.Label.Overflow.RESIZE_HEIGHT);
    }
    @property(cc.SpriteFrame)
    animalSprites: cc.SpriteFrame[] = [];

    bindItemRowData(betLog, index) {
        const itemNode = cc.instantiate(this.itemPrefab);
        const item = itemNode.getComponent(VipFishPrawnCrabHistoryItem);
        item.setData(betLog, index);
        item.setAnimalSprites(betLog.result, this.animalSprites);
        this.content.addChild(itemNode);
    }
}
