const { ccclass, property } = cc._decorator;

const LanguageFontSize = cc.Class({
    name: "LanguageFontSize",
    properties: {
        language: "",
        size: 0
    }
});

@ccclass
export default class LocalizedFontSize extends cc.Component {
    @property({ type: LanguageFontSize })
    overrideSizes: LanguageFontSize[] = [];

    label: cc.Label = null;
    fontBases = {};

    onLoad() {
        this.initData();
        this.label = this.node.getComponent(cc.Label);
        this.updateFont();
    }

    initData() {
        this.fontBases = {
            en: 18,
            sc: 20,
            tc: 20
        };
    }

    updateFont() {
        const size = this.getFontSizeByLanguage();
        if (this.label) {
            this.label.fontSize = size;
        }
    }

    getFontSizeByLanguage(): any {
        const lang = window.i18n.curLang;
        const overrideSize = this.overrideSizes.find((data) => data.language === lang);
        return overrideSize?.size || this.fontBases[lang] || this.fontBases["en"];
    }
}
