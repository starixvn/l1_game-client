import { Label } from "../../../../creator";
import SymbolPreview, { SymbolPreviewType } from "../../_slotgame_base/SymbolPreview";

const { ccclass, property } = cc._decorator;

@ccclass
export default class CascadingSymbolPreview extends SymbolPreview {
    @property(cc.Label)
    multiplierLabel: cc.Label = null;

    renderInfo(info: SymbolPreviewType) {
        const { symbol } = info;
        switch (symbol) {
            case 10:
                this.showInfoNode(false);
                this.renderMultiplier();
                break;
            default:
                this.showInfoNode(true);
                this.renderNormalSymbol(info);
        }
    }

    showInfoNode(status: boolean) {
        this.infoNode.active = status;
        this.multiplierLabel.node.active = !status;
    }

    renderNormalSymbol(info: SymbolPreviewType) {
        const { odds, colorList, coinValue, betLevel, symbol, freespin } = info;
        let firstLabelWidth = 0;

        this.infoNode.children.forEach((node, index) => {
            let values;
            let show;

            if (symbol === 9) {
                show = index < freespin.length && freespin[index].odds > 0;
                values = [`${freespin[index].count}`, `${freespin[index].odds} FREE SPINS`];
            } else {
                show = index < odds.length && odds[index].odds > 0;
                values = [`${odds[index].from}-${odds[index].to}`, `${odds[index].odds * coinValue * betLevel}`];
            }

            if (!show) {
                return;
            }

            node.children.forEach((child, childIndex) => {
                const label = child.getComponent(cc.Label);
                label.string = values[childIndex];
                child.color = cc.Color.WHITE.fromHEX(colorList[childIndex]);
                label._forceUpdateRenderData();
            });

            firstLabelWidth = this.findGreaterWidth(node, firstLabelWidth);
        });
        this.updateLabelWidth(firstLabelWidth);
    }

    renderMultiplier() {
        this.multiplierLabel.string = "Multiplier Bonus will apply for Tumble Win";
    }

    findGreaterWidth(node, firstLabelWidth) {
        const firstLabel = node.children[0].getComponent(cc.Label);
        const labelWidth = firstLabel.node.width;
        labelWidth > firstLabelWidth && (firstLabelWidth = labelWidth);
        return firstLabelWidth;
    }

    updateLabelWidth(newWidth: number) {
        this.infoNode.children.forEach((node) => {
            const firstLabel = node.children[0].getComponent(cc.Label);
            firstLabel.overflow = cc.Label.Overflow.CLAMP;
            firstLabel.node.width = newWidth;
            firstLabel.enableWrapText = false;
        });
    }
}
