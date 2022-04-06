import * as i18n from "i18n/runtime-scripts/LanguageData";
import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
import GameUtils from "../../../common/GameUtils";
import { MenuDirectionType } from "../../../common/expandable-menu/view-models/MenuDirectionType";
import AudioManager from "../../../common/audio/AudioManager";
import { enableMD5OnGame } from "../../../configs/Configs";
import MD5Tooltip from "../../../common/md5-tooltip/MD5Tooltip";

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

    // @property(cc.Node)
    // iconToggle: cc.Node = null;

    // @property(cc.Node)
    // bgButtonCollapse: cc.Node = null;

    // @property(cc.Node)
    // bgButtonExpand: cc.Node = null;

    @property(cc.Node)
    expandableNode: cc.Node = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    @property
    defaultExpand = false;

    @property
    lengthOfMd5 = 21;

    @property
    delayShowRawValue = 0;

    @property(cc.Prefab)
    md5TooltipPrefab: cc.Prefab = null;

    @property(cc.Node)
    md5TooltipContainer: cc.Node = null;

    private md5CopyString: string = null;
    readonly duration: number = 0.5;
    readonly delayShowHashValue: number = 0.8;
    protected isExpanded = false;
    blockDirection = MenuDirectionType.RIGHT;
    protected md5Tooltip: MD5Tooltip = null;
    readonly maximumStringAllowed = 32;

    onLoad() {
        this.initMD5Tooltip();
        const hintLabel = this.hintCopyNode.getChildByName("content").getComponent(cc.Label);
        hintLabel.string = i18n.t("messages.copy_success");
        this.setCaptionAndHintForMD5(false);
        this.showHint = this.showHint.bind(this);
        if (this.defaultExpand) {
            this.expandBlock();
        } else {
            this.collapseBlock(false);
        }
    }

    initMD5Tooltip() {
        const mini = cc.instantiate(this.md5TooltipPrefab);
        this.md5Tooltip = mini.getComponent(MD5Tooltip);
        this.md5TooltipContainer.addChild(mini);
    }

    updateMD5String(data: MD5Type) {
        const delayTime = !!data.rawValue ? this.delayShowRawValue : this.delayShowHashValue;
        setTimeout(() => {
            this.handleMD5Data(data);
        }, delayTime * 1000);
    }

    handleMD5Data(data: MD5Type) {
        this.setCaptionAndHintForMD5(!!data.rawValue);
        this.generateMD5Result(data);
        this.setCopyString(data.hashValue || data.rawValue);
        this.handleTooltip(data);
    }

    generateMD5Result(data: MD5Type) {
        const value = data.hashValue || data.rawValue;
        const formatValue = value.length > this.maximumStringAllowed ? value.slice(0, this.lengthOfMd5) + "..." : value;
        this.md5Value.string = `${formatValue}`;
    }

    resetMd5Value() {
        this.md5Value.string = "";
    }

    setCopyString(text: string) {
        this.md5CopyString = text;
    }

    onClickCopyButton() {
        GameUtils.copyToClipboard(this.md5CopyString, this.showHint);
    }

    showHint() {
        cc.tween(this.hintCopyNode).to(0.2, { opacity: 255 }).delay(1).to(0.1, { opacity: 0 }).start();
    }

    setCaptionAndHintForMD5(isMD5Key: boolean) {
        this.md5Text.string = i18n.t(isMD5Key ? "ui.md5_result" : "ui.md5_string");
    }

    handleTooltip(data: MD5Type) {
        !!data.hashValue && this.md5Tooltip.hideToolTip();
        this.md5Tooltip.setData(data.rawValue);
    }

    setDirection(direction: MenuDirectionType) {
        this.blockDirection = direction;
    }

    collapseBlock(animated = true) {
        this.isExpanded = false;
        this.handleDirectionWhenCollapsedBlock();
    }

    expandBlock() {
        this.isExpanded = true;
        this.handleDirectionWhenExpandableBlock();
    }

    onMenuClick() {
        AudioManager.getInstance().playClick();
        this.isExpanded = !this.isExpanded;
        this.isExpanded ? this.expandBlock() : this.collapseBlock();
    }

    handleDirectionWhenExpandableBlock() {
        this.expandableNode.stopAllActions();
        // this.iconToggle.scaleX = 1;
        // this.bgButtonCollapse.active = false;
        // this.bgButtonExpand.active = true;
        // cc.tween(this.expandableNode)
        //     .to(0.2, { position: { value: cc.v2(-10, 0), easing: "sineIn" } })
        //     .start();
    }

    handleDirectionWhenCollapsedBlock() {
        this.expandableNode.stopAllActions();
        // this.iconToggle.scaleX = -1;
        // this.bgButtonCollapse.active = true;
        // this.bgButtonExpand.active = false;
        // cc.tween(this.expandableNode)
        //     .to(0.2, { position: { value: cc.v2(-this.expandableNode.width, 0), easing: "sineIn" } })
        //     .start();
    }

    hide(gameId: number) {
        const isShowMD5 = enableMD5OnGame.includes(gameId);
        if (!isShowMD5 && this.node) {
            this.node.active = false;
        }
    }
}
