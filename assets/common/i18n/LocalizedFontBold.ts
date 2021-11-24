import LocalizedFont from "./LocalizedFont";

const { ccclass } = cc._decorator;

@ccclass
export default class LocalizedFontBold extends LocalizedFont {
    initData() {
        this.fontBases = {
            en: "NotoSerif-Bold",
            th: "NotoSerifThai-Bold",
            zh_cn: "NotoSerifSC-Bold",
            zh_tw: "NotoSerifTC-Bold"
        };
    }
}
