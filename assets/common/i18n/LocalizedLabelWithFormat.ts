import * as i18n from "i18n/runtime-scripts/LanguageData";
const LocalizedLabel = require("LocalizedLabel");

const { ccclass, property, executeInEditMode, menu } = cc._decorator;

export enum FormationHandler {
    UPPER,
    LOWER
}

@ccclass
@executeInEditMode
@menu("i18n/LocalizedLabelWithFormat")
export default class LocalizedLabelWithFormat extends LocalizedLabel {
    @property({ type: cc.Enum(FormationHandler) })
    format = FormationHandler.UPPER;

    public dataId: string;

    updateLabel() {
        if (!this.label) {
            cc.error("Failed to update localized label, label component is invalid!");
            return;
        }
        let localizedString = i18n.t(this.dataId);
        if (localizedString) {
            localizedString = this.handleFormat(localizedString);
            this.label.string = localizedString;
        }
    }
    handleFormat(value: string) {
        const data = [
            {
                condition: this.format === FormationHandler.LOWER,
                handle: this.lowerCase
            },
            {
                condition: this.format === FormationHandler.UPPER,
                handle: this.upperCase
            }
        ];
        const handler = data.filter((passed) => passed.condition);
        return handler.length ? handler[0].handle(value) : value;
    }
    upperCase(value: string) {
        return value.toUpperCase();
    }
    lowerCase(value: string) {
        return value.toLowerCase();
    }
}
