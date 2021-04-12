import GameGuideBase from "../../_base/view-models/GameGuideBase";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LotteryGuide extends GameGuideBase {
    createReplaceData(configs) {
        const odds = configs.odds;

        return {};
    }
}
