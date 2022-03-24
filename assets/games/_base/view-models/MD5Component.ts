import * as i18n from "i18n/runtime-scripts/LanguageData";
import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
import GameUtils from "../../../common/GameUtils";
import { MenuDirectionType } from "../../../common/expandable-menu/view-models/MenuDirectionType";
import { t } from "../../../../packages/i18n/runtime-scripts/LanguageData";
import AudioManager from "../../../common/audio/AudioManager";

const { ccclass, property } = cc._decorator;

export type MD5Type = {
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
    iconToggle: cc.Node = null;

    @property(cc.Node)
    bgButtonCollapse: cc.Node = null;

    @property(cc.Node)
    bgButtonExpand: cc.Node = null;

    @property(cc.Node)
    expandableNode: cc.Node = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    @property
    defaultExpand = false;

    @property
    valueMd5Length = 21;

    private md5CopyString: string = null;
    readonly duration: number = 0.5;
    protected isExpanded = false;
    blockDirection = MenuDirectionType.RIGHT;

    onLoad() {
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

    updateMD5String(data: MD5Type) {
        this.setCaptionAndHintForMD5(!!data.rawValue);
        const value = data.hashValue || data.rawValue;
        const formatValue = value.slice(0, this.valueMd5Length) + "...";
        this.md5Value.string = `<color=#ffffff>${formatValue}</color>`;
        this.setCopyString(data.hashValue || data.rawValue);
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
        if (isMD5Key) {
            this.md5Text.string = i18n.t("ui.md5_result");
        } else {
            this.md5Text.string = i18n.t("ui.md5_string");
        }
    }

    setDirection(direction: MenuDirectionType) {
        this.blockDirection = direction;
    }

    collapseBlock(animated = true) {
        this.isExpanded = false;
        this.handleDirectionWhenCollapedBlock();
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
        this.iconToggle.scaleX = 1;
        this.bgButtonCollapse.active = false;
        this.bgButtonExpand.active = true;
        cc.tween(this.expandableNode)
            .to(0.2, { position: { value: cc.v2(-10, 0), easing: "sineIn" } })
            .start();
    }

    handleDirectionWhenCollapedBlock() {
        this.expandableNode.stopAllActions();
        this.iconToggle.scaleX = -1;
        this.bgButtonCollapse.active = true;
        this.bgButtonExpand.active = false;
        cc.tween(this.expandableNode)
            .to(0.2, { position: { value: cc.v2(-this.expandableNode.width, 0), easing: "sineIn" } })
            .start();
    }
}
