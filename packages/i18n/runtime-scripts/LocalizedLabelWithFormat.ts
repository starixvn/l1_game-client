import * as i18n from "i18n/runtime-scripts/LanguageData";

const { ccclass, property, executeInEditMode, menu } = cc._decorator;
function debounce(func, wait, immediate = null) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

export enum FormationHandler {
    UPPER,
    LOWER
}

@ccclass
@executeInEditMode
@menu("i18n/LocalizedLabelWithFormat")
export default class LocalizedLabelWithFormat extends cc.Component {
    @property
    _dataId: string = "";

    @property
    get dataId() {
        return this._dataId;
    }

    set dataId(value: string) {
        if (this._dataId !== value) {
            this._dataId = value;
            if (CC_EDITOR) {
                this._debouncedUpdateLabel();
            } else {
                this.updateLabel();
            }
        }
    }

    @property({ type: cc.Enum(FormationHandler) })
    format = FormationHandler.UPPER;

    _debouncedUpdateLabel: Function;
    label: cc.Label;

    onLoad() {
        if (CC_EDITOR) {
            if (!i18n.inst) {
                i18n.init("vi");
            }
            this._debouncedUpdateLabel = debounce(this.updateLabel, 200);
        }
        if (!i18n.inst) {
            i18n.init();
        }

        this.fetchRender();
    }

    fetchRender() {
        const label = this.getComponent(cc.Label);
        if (label) {
            this.label = label;
            this.updateLabel();
            return;
        }
    }

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
