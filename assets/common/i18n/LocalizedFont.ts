const { ccclass, property, executeInEditMode, menu } = cc._decorator;

const LanguageFont = cc.Class({
    name: "LanguageFont",
    properties: {
        language: "",
        name: ""
    }
});

@ccclass
@executeInEditMode
@menu("i18n/LocalizedFont")
export default class LocalizedFont extends cc.Component {
    @property({ type: LanguageFont })
    overrideFonts: LanguageFont[] = [];

    label: cc.Label = null;
    fontBases = {};

    onLoad() {
        this.initData();
        this.label = this.node.getComponent(cc.Label);
        this.updateFont();
    }

    initData() {
        this.fontBases = {
            en: "NotoSerif-Regular",
            th: "NotoSerifThai-Regular",
            zh_cn: "NotoSerifZHCN-Regular",
            zh_tw: "NotoSerifZHTW-Regular"
        };
    }

    updateFont() {
        const name = this.getFontNameByLanguage();
        if (this.label) {
            this.loadFont(name).then((font) => {
                this.label.font = font;
            });
        }
    }

    getFontNameByLanguage(): any {
        const lang = window.i18n.curLang;
        const overrideFonts = this.overrideFonts.find((data) => data.language === lang);
        return overrideFonts?.name || this.fontBases[lang] || this.fontBases["en"];
    }

    loadFont(name: string) {
        return new Promise<cc.Font>((resolve, reject) => {
            cc.resources.load<cc.Font>(`fonts/${name}`, cc.Font, (err, font) => {
                resolve(font);
            });
        });
    }
}
