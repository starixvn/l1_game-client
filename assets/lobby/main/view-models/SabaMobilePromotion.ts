import GameUtils from "../../../common/GameUtils";
import BannerItem from "./BannerItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SabaMobilePromotion extends BannerItem {
    openPromotion(e) {
        GameUtils.loadResource(`lobby/promotion/SMPromotion`).then((prefab) => {
            const node = cc.instantiate(prefab);
            cc.RedT.MiniPanel.node.addChild(node);
        });
    }
}
