const { ccclass, property } = cc._decorator;

const FontData = cc.Class({
    name: "FontData",
    properties: {
        name: "",
        size: 18
    }
});

const LanguageFont = cc.Class({
    name: "LanguageFont",
    properties: {
        language: "",
        font: FontData
    }
});

@ccclass
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
            en: {
                name: "NotoSerif-Regular",
                size: 18
            },
            th: {
                name: "NotoSerifThai-Regular",
                size: 18
            },
            sc: {
                name: "NotoSerifSC-Regular",
                size: 20
            },
            tc: {
                name: "NotoSerifTC-Regular",
                size: 20
            }
        };
    }

    updateFont() {
        const data = this.getFontDataByLanguage();
        if (this.label) {
            this.loadFont(data.name).then((font) => {
                this.label.font = font;
                this.label.fontSize = data.size;
            });
        }
    }

    getFontDataByLanguage(): any {
        const lang = window.i18n.curLang;
        const overrideFonts = this.overrideFonts.find((data) => data.language === lang);
        return overrideFonts || this.fontBases[lang] || this.fontBases["en"];
    }

    loadFont(name: string) {
        return new Promise<cc.Font>((resolve, reject) => {
            cc.resources.load<cc.Font>(`fonts/${name}`, cc.Font, (err, font) => {
                resolve(font);
            });
        });
    }
}
