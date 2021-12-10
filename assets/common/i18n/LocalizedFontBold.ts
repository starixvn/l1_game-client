import LocalizedFont from "./LocalizedFont";

const { ccclass, executeInEditMode, menu } = cc._decorator;

@ccclass
@executeInEditMode
@menu("i18n/LocalizedFontBold")
export default class LocalizedFontBold extends LocalizedFont {
    initData() {
        this.fontBases = {
            en: "NotoSerif-Bold",
            th: "NotoSerifThai-Bold",
            zh_cn: "NotoSerifZHCN-Bold",
            zh_tw: "NotoSerifZHTW-Bold"
        };
    }
}
