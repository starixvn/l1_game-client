import MD5Component, { MD5Type } from "../../_base/view-models/MD5Component";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MegaKenoMd5 extends MD5Component {
    isMiniType: boolean;

    generateMD5Result(data: MD5Type) {
        const bigPointsType = {
            normall: 811,
            mini: 206
        };

        const value = data?.hashValue || data?.rawValue;
        let formatValue = value.length > this.maximumStringAllowed ? value.slice(0, this.lengthOfMd5) + "..." : value;

        if (data?.rawValue) {
            const suffix = formatValue.split("_");
            const totalPoints = suffix[0].replace(/([{}])/g, "");
            const bigPoints = this.isMiniType ? bigPointsType.mini : bigPointsType.normall;
            formatValue = `{<color=${parseInt(totalPoints) >= bigPoints ? "#0066ff" : "#ff0000"}>${totalPoints}</color>}_${suffix[1]}`;
        }

        this.md5Value.string = `${formatValue}`;
    }
}
