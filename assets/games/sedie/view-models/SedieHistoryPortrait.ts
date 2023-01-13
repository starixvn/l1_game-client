import SedieHistory from "./SedieHistory";

const { ccclass, property } = cc._decorator;

@ccclass
export default class SedieHistoryPortrait extends SedieHistory {
    HEIGHT_CONTENT = 800;
    AUTO_SCALE_NODE_WIDTH = 850;
}
