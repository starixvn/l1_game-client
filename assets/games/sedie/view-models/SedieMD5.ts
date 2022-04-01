import MD5Component, { MD5Type } from "../../_base/view-models/MD5Component";

const { ccclass } = cc._decorator;
export type ExtraInfos = {
    red1: boolean;
    red2: boolean;
    red3: boolean;
    red4: boolean;
};
@ccclass
export default class SedieMD5 extends MD5Component {
    readonly CHIP_RED = `<img src="chip_do" />`;
    readonly CHIP_WHITE = `<img src="chip_trang" />`;
    generateMD5Result(data: MD5Type) {
        let result = "";
        if (!!data.extraInfos) {
            const chipResult = this.generateChips(data.extraInfos);
            const suffix = data.rawValue.split("_");
            const suffixFormatLength = suffix[1].slice(0, this.lengthOfMd5) + "...";
            result = `{${chipResult}}_${suffixFormatLength}`;
        }
        if (!!data.hashValue) {
            result = data.hashValue;
        }

        this.md5Value.string = `${result}`;
    }

    generateChips(extraInfos: ExtraInfos) {
        const totalRed = Object.values(extraInfos).filter((value) => value === true).length;
        switch (totalRed) {
            case 0:
                return `${this.CHIP_WHITE} ${this.CHIP_WHITE} ${this.CHIP_WHITE} ${this.CHIP_WHITE}`;
            case 1:
                return `${this.CHIP_RED} ${this.CHIP_WHITE} ${this.CHIP_WHITE} ${this.CHIP_WHITE}`;
            case 2:
                return `${this.CHIP_RED} ${this.CHIP_RED} ${this.CHIP_WHITE} ${this.CHIP_WHITE}`;
            case 3:
                return `${this.CHIP_RED} ${this.CHIP_RED} ${this.CHIP_RED} ${this.CHIP_WHITE}`;
            case 4:
                return `${this.CHIP_RED} ${this.CHIP_RED} ${this.CHIP_RED} ${this.CHIP_RED}`;
        }
    }
}
