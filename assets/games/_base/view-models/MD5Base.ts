import * as i18n from "i18n/runtime-scripts/LanguageData";
import EffectAppearanceLabel from "../../../common/EffectAppearanceLabel";
import GameUtils from "../../../common/GameUtils";
import { MenuDirectionType } from "../../../common/expandable-menu/view-models/MenuDirectionType";
import { t } from "../../../../packages/i18n/runtime-scripts/LanguageData";
import AudioManager from "../../../common/audio/AudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MD5Base extends cc.Component {
    @property(cc.Label)
    md5Text: cc.Label = null;

    @property(EffectAppearanceLabel)
    md5Value: EffectAppearanceLabel = null;

    @property(cc.Button)
    copyButton: cc.Button = null;

    @property(cc.Node)
    expandableNode: cc.Node = null;

    @property(cc.Node)
    hintCopyNode: cc.Node = null;

    @property(cc.Node)
    blockInputNode: cc.Node = null;

    @property
    defaultExpand = false;

    private md5CopyString: string = null;
    readonly duration: number = 0.5;
    protected isExpanded = false;
    blockDirection = MenuDirectionType.RIGHT;

    onLoad() {
        const hintLabel = this.hintCopyNode.getChildByName("content").getComponent(cc.Label);
        hintLabel.string = i18n.t("messages.copy_success");
        this.setCaptionAndHintForMD5(false);
        this.enableCopyButton(false);
        this.showHint = this.showHint.bind(this);

        if (this.defaultExpand) {
            this.expandBlock();
        } else {
            this.collapseBlock(false);
        }
    }

    enableCopyButton(enabled: boolean) {
        this.copyButton.interactable = enabled;
        const color = cc.Color.WHITE;
        this.copyButton.node.getChildByName("text").color = enabled ? color : color.fromHEX("#a8a8a8");
    }

    clearMD5() {
        this.updateMD5String("");
    }

    updateMD5String(data: any) {
        this.setCaptionAndHintForMD5(!!data.rawValue);
        this.md5Value.string = `<color=#ffffff>${data.hashValue || data.rawValue}</color>`;
        this.setCopyString(data.hashValue || data.rawValue);
    }

    setCopyString(text: string) {
        this.md5CopyString = text;
        this.enableCopyButton(text.length > 0);
    }

    onClickCopyButton() {
        GameUtils.copyToClipboard(this.md5CopyString, this.showHint);
    }

    showHint() {
        cc.tween(this.hintCopyNode).to(0.2, { opacity: 255 }).delay(1).to(0.1, { opacity: 0 }).start();
    }

    setCaptionAndHintForMD5(isMD5Key: boolean) {
        if (isMD5Key) {
            this.md5Text.string = i18n.t("ui.result");
        } else {
            this.md5Text.string = i18n.t("holdEmPoker.md5String");
        }
    }

    setDirection(direction: MenuDirectionType) {
        this.blockDirection = direction;
    }

    collapseBlock(animated = true) {
        this.isExpanded = false;

        if (this.blockInputNode) {
            this.blockInputNode.active = false;
        }

        if (!animated) {
            this.expandableNode.opacity = 0;
            this.expandableNode.scaleX = 0;
            return;
        }
        this.handleDirectionWhenCollapedBlock();
    }

    expandBlock() {
        this.isExpanded = true;
        if (this.blockInputNode) {
            this.blockInputNode.active = true;
        }
        this.handleDirectionWhenExpandableBlock();
    }

    onMenuClick() {
        AudioManager.getInstance().playClick();
        this.isExpanded = !this.isExpanded;
        this.isExpanded ? this.expandBlock() : this.collapseBlock();
    }

    handleDirectionWhenExpandableBlock() {
        this.expandableNode.stopAllActions();
        switch (this.blockDirection) {
            case MenuDirectionType.LEFT:
                break;
            case MenuDirectionType.RIGHT:
                cc.tween(this.expandableNode).to(0.2, { opacity: 255, scale: 1 }).start();
                break;
            case MenuDirectionType.TOP:
                break;
            case MenuDirectionType.BOTTOM:
                break;
            default:
                break;
        }
    }

    handleDirectionWhenCollapedBlock() {
        this.expandableNode.stopAllActions();
        switch (this.blockDirection) {
            case MenuDirectionType.LEFT:
                break;
            case MenuDirectionType.RIGHT:
                cc.tween(this.expandableNode).to(0.2, { opacity: 0, scaleX: 0 }).start();
                break;
            case MenuDirectionType.TOP:
                break;
            case MenuDirectionType.BOTTOM:
                break;
            default:
                break;
        }
    }

    setWidgetForBlockInput(target: cc.Node) {
        const blockInputWidget = this.blockInputNode.getComponent(cc.Widget);
        blockInputWidget.target = target;
        blockInputWidget.top = 0;
        blockInputWidget.bottom = 0;
        blockInputWidget.left = 0;
        blockInputWidget.right = 0;
    }
}
