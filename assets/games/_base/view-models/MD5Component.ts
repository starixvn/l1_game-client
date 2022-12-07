import * as i18n from "i18n/runtime-scripts/LanguageData";

import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
import GameUtils from "../../../common/GameUtils";
import MD5Tooltip from "../../../common/md5-tooltip/MD5Tooltip";
import MD5Frame from "./MD5Frame";

const { ccclass, property } = cc._decorator;

export type MD5Type = {
    extraInfos: any;
    rawValue: string;
    hashValue: string;
};
@ccclass
export default class MD5Component extends cc.Component {
    @property(cc.Label)
    md5Text: cc.Label = null;

    @property(EffectAppearanceLabel)
    md5Value: EffectAppearanceLabel = null;

    @property(cc.Button)
    copyButton: cc.Button = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    @property
    lengthOfMd5 = 21;

    @property(cc.Prefab)
    md5TooltipPrefab: cc.Prefab = null;

    @property(cc.Node)
    md5TooltipContainer: cc.Node = null;

    @property
    delayShowRawValue = 0;

    public timeout: any;
    private md5CopyString: string = null;
    readonly duration: number = 0.5;
    readonly delayShowHashValue: number = 1.35;
    protected md5Tooltip: MD5Tooltip = null;
    maximumStringAllowed = 32;
    public hintLabel: cc.Label = null;

    onLoad() {
        this.initMD5Tooltip();
    }

    initMD5Wrapper(node: cc.Node) {
        const md5Wrapper = node.getComponent(MD5Frame);
        this.md5Text = md5Wrapper.md5Label;
        this.copyButton = md5Wrapper.md5CopyBtn;
        this.hintCopyNode = md5Wrapper.md5HintCopy;
        md5Wrapper.md5Node.width = this.node.getChildByName("md5-node").width;
        this.hintLabel = this.hintCopyNode.getChildByName("content").getComponent(cc.Label);
        this.hintLabel.string = i18n.t("messages.copy_success");
        this.setCaptionAndHintForMD5(false);
        md5Wrapper.onClickCopyButton = () => {
            this.onClickCopyButton();
        };
        md5Wrapper.updateLayout();
    }

    onEnable() {}

    initMD5Tooltip() {
        const mini = GameUtils.createNodeFromPrefab(this.md5TooltipPrefab);
        this.md5Tooltip = mini.getComponent(MD5Tooltip);
        this.md5TooltipContainer.addChild(mini);
    }

    updateMD5String(data: MD5Type) {
        if (!this.node.activeInHierarchy) {
            this.handleMD5Data(data);
            return;
        }

        const delayTime = !!data?.rawValue ? this.delayShowRawValue : this.delayShowHashValue;
        this.timeout = setTimeout(() => {
            this.handleMD5Data(data);
        }, delayTime * 1000);
    }

    handleMD5Data(data: MD5Type) {
        if (this.node && this.node.isValid) {
            this.setCaptionAndHintForMD5(!!data?.rawValue);
            this.generateMD5Result(data);
            this.setCopyString(data?.hashValue || data?.rawValue);
            this.handleTooltip(data);
        }
    }

    generateMD5Result(data: MD5Type) {
        const value = data?.hashValue || data?.rawValue;
        let formatValue = value;
        if (this.isShowTooltip || this.Md5HashIsShowTooltip) {
            formatValue = value.length > this.maximumStringAllowed ? value.slice(0, this.lengthOfMd5) + "..." : value;
        }
        this.md5Value.string = `${formatValue}`;
    }

    resetMd5() {
        this.md5Value.string = "";
        this.timeout && clearTimeout(this.timeout);
    }

    setCopyString(text: string) {
        this.md5CopyString = text;
    }

    onClickCopyButton() {
        GameUtils.copyToClipboard(this.md5CopyString, this.hintLabel, () => this.showHint());
        this.md5Tooltip.hideToolTip();
    }

    showHint() {
        cc.tween(this.hintCopyNode).to(0.2, { opacity: 255 }).delay(1).to(0.1, { opacity: 0 }).start();
    }

    setCaptionAndHintForMD5(isMD5Key: boolean) {
        this.md5Text.string = i18n.t(isMD5Key ? "ui.md5_result" : "ui.md5_string");
        this.md5Text.node.position = cc.v3(-5, 0, 0);
        cc.tween(this.md5Text.node)
            .to(0.3, { position: cc.v3(0, 0, 0) })
            .start();
    }

    handleTooltip(data: MD5Type) {
        !!data.hashValue && this.md5Tooltip.hideToolTip();
        if (this.Md5HashIsShowTooltip) {
            this.md5Tooltip.setData(data.rawValue || data.hashValue);
        } else {
            this.isShowTooltip && this.md5Tooltip.setData(data.rawValue);
        }
    }

    setDelayShowRawValue(delay: number) {
        this.delayShowRawValue = delay;
    }

    setParamGame(
        delayShowRawValue: number,
        lengthOfMd5: number,
        isShowTooltip: boolean,
        widthMd5Node: number,
        Md5HashIsShowTooltip: boolean
    ) {
        this.delayShowRawValue = delayShowRawValue;
        this.lengthOfMd5 = lengthOfMd5;
        this.isShowTooltip = isShowTooltip;
        this.widthMd5Node = widthMd5Node;
        this.Md5HashIsShowTooltip = Md5HashIsShowTooltip;
        this.updateWidthMD5Node();
    }

    updateWidthMD5Node() {
        this.md5Node.width = this.widthMd5Node;
    }
}
