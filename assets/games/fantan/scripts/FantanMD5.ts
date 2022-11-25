import MD5Component, { MD5Type } from "../../_base/view-models/MD5Component";

const { ccclass, property } = cc._decorator;

@ccclass
export default class FantanMD5 extends MD5Component {
    maximumStringAllowed = 26;

    handleTooltip(data: MD5Type) {
        this.md5Tooltip.hideToolTip();
        this.md5Tooltip.setData(data.rawValue || data.hashValue);
    }
}
