import LocalizedFont from "./LocalizedFont";

const { ccclass, menu } = cc._decorator;

@ccclass
@menu("i18n/LocalizedSlotFont")
export default class LocalizedSlotFont extends LocalizedFont {
    initData() {
        this.fontBases = {
            vi: "Kodchasan-ExtraLight",
            id: "Kodchasan-ExtraLight",
            en: "Kodchasan-ExtraLight",
            th: "NotoSerifThai-Bold",
            zh_cn: "NotoSerifZHCN-Bold",
            zh_tw: "NotoSerifZHTW-Bold"
        };
    }
}
