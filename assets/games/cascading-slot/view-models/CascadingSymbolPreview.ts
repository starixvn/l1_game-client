import { numberWithCommas } from "../../../common/helpers/NumberHelper";
import SymbolPreview, { SymbolPreviewType } from "../../_slotgame_base/SymbolPreview";
import CascadeSlotReelItem from "./CascadeSlotReelItem";

const { ccclass, property } = cc._decorator;

export interface CascadingSymbolPreviewType extends SymbolPreviewType {
    symbolItem: CascadeSlotReelItem;
}

@ccclass
export default class CascadingSymbolPreview extends SymbolPreview {
    @property(cc.Label)
    multiplierLabel: cc.Label = null;

    @property(cc.Node)
    content: cc.Node = null;

    renderInfo(info: CascadingSymbolPreviewType) {
        const { symbolItem } = info;
        switch (symbolItem.index) {
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

    setInfo(info: CascadingSymbolPreviewType) {
        let nodeTmp = cc.instantiate(info.symbolItem.content);
        this.content.addChild(nodeTmp);
        const skeleton = nodeTmp.getComponentInChildren(sp.Skeleton);
        skeleton.skeletonData = info.spine;
        skeleton.setAnimation(0, "highlight", false);
        this.border.color = cc.Color.WHITE.fromHEX(info.borderColor);
        this.renderInfo(info);
        this.checkShowSpecialSymbol(info);
    }

    renderNormalSymbol(info: CascadingSymbolPreviewType) {
        const { odds, colorList, coinValue, betLevel, symbolItem, freespin } = info;
        let firstLabelWidth = 0;

        this.infoNode.children.forEach((node, index) => {
            let values;
            let show;

            if (symbolItem.index === 9) {
                show = index < freespin.length && freespin[index].odds > 0;
                values = [`${freespin[index].count}`, `${freespin[index].odds} FREE SPINS`];
            } else {
                show = index < odds.length && odds[index].odds > 0;
                values = [`${odds[index].from}-${odds[index].to}`, `${numberWithCommas(odds[index].odds * coinValue * betLevel)}`];
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

    showSymbolText(symbolNumber: number, textColor: string, isInfoOnLeft: boolean) {
        this.border.width = 320;
        this.bg.width = 320;
        if (isInfoOnLeft) {
            this.infoNode.position = cc.v3(-238, 0, 0);
        }
    }

    checkShowSpecialSymbol(info) {
        const index = info.symbolItem.index;
        if (index === 9) {
            this.showSymbolText(index, info.colorList[1], info.isInfoOnLeft);
        }
    }
}
