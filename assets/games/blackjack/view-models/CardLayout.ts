import CardLayoutBase from "../../../common/new-card/view-models/CardLayoutBase";
const { ccclass, property, executeInEditMode } = cc._decorator;

@ccclass
@executeInEditMode
export default class CardLayout extends CardLayoutBase {
    updateLayout() {
        super.updateLayout();
        const width = this.cardSizeWidth + this.ratio * (this.content.childrenCount - 1) * this.spacingX;
        this.shadow.width = width + this.shadowWidth;
    }
}
