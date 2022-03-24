import MD5Component, { MD5Type } from "../../_base/view-models/MD5Component";
const { ccclass } = cc._decorator;

@ccclass
export default class BigSmallMd5 extends MD5Component {
    displayMd5Value(data: MD5Type) {
        this.setCaptionAndHintForMD5(!!data.rawValue);
        const newMd5Value = (data.hashValue || data.rawValue).slice(0, this.valueMd5Length) + "...";
        if (!!data.rawValue) {
            const resultFormatting = newMd5Value.split("_");
            this.md5Value.string = `<size=30>${resultFormatting[0]}</>${"_"}${resultFormatting[1]}`;
        }
        if (!!data.hashValue) {
            this.md5Value.string = `<color=#ffffff>${newMd5Value}</color>`;
        }

        this.setCopyString(data.hashValue || data.rawValue);
    }
}
