import MD5Component, { MD5Type } from "../../_base/view-models/MD5Component";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MegaKenoMd5 extends MD5Component {
    generateMD5Result(data: MD5Type) {
        const value = data?.hashValue || data?.rawValue;
        this.md5Value.string = `${value}`;
    }
}
