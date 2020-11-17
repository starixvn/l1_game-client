import * as _ from "lodash";

import GameBase from "../../_base/GameBase";
import GameBaseFinishHandler from "../../_base/handlers/GameBaseFinishHandler";
import LogControl from "../../keno-pro/view-models/LogControl";
import VipFishPrawnCrabStatsItem from "./VipFishPrawnCrabStatsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabStats extends cc.Component {

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    characterView: cc.Node = null;

    @property(cc.Node)
    characterContent: cc.Node = null;

    @property(LogControl)
    logControl: LogControl = null;

    @property({ type: cc.Label })
    characterCountLabels: cc.Label[] = [];

    @property({ type: cc.SpriteFrame })
    characterIcons: cc.SpriteFrame[] = [];

    @property({ type: cc.SpriteFrame })
    highlightCharacterIcons: cc.SpriteFrame[] = [];

    @property(cc.Label)
    mountainPercent: cc.Label = null;

    @property(cc.Label)
    oceanPercent: cc.Label = null;

    private isCharacterMode = true;

    public init(main: GameBase) {
        const condition = () => {
            const finishHandler = main.finishHandler as GameBaseFinishHandler;
            return main.currentTimeRemaining < main.config.stopBetTime || main.currentTimeRemaining > main.config.fullTime - finishHandler.getResultAnimationTime() + 0.5;
        }
        this.logControl.init(condition);
    }

    renderData(dataLogs: any[]) {
        if (!dataLogs || !dataLogs.length) {
            return;
        }

        const characterCounts = {};
        let mountainCount = 0;
        let statsData = [];
        this.characterContent.removeAllChildren();

        dataLogs.forEach((log, roundIndex) => {
            const node = cc.instantiate(this.itemPrefab);
            const itemComponent = node.getComponent(VipFishPrawnCrabStatsItem);
            const { result, settlementResult } = log;

            mountainCount += settlementResult.mountain ? 1 : 0;
            statsData.unshift(settlementResult.mountain ? 0 : 1);

            _.values(result).forEach((character: number, index: number) => {
                characterCounts[character] = (characterCounts[character] ?? 0) + 1;
                itemComponent.icons[index].node.stopAllActions();

                if (roundIndex == 0) {
                    itemComponent.icons[index].spriteFrame = this.highlightCharacterIcons[character];
                    cc.tween(itemComponent.icons[index].node)
                        .delay(index)
                        .call(() => {
                            cc.tween(itemComponent.icons[index].node)
                                .repeatForever(
                                    cc.tween()
                                        .to(0.2, { scale: 0.40, opacity: 200 }, { easing: "cubicIn" })
                                        .delay(0.1)
                                        .to(0.2, { scale: 0.45, opacity: 255 }, { easing: "cubicOut" })
                                        .delay(0.1)
                                        .to(0.2, { scale: 0.40, opacity: 200 }, { easing: "cubicIn" })
                                        .delay(0.1)
                                        .to(0.2, { scale: 0.45, opacity: 255 }, { easing: "cubicOut" })
                                        .delay(3)
                                )
                                .start();
                        }).start();
                } else {
                    itemComponent.icons[index].spriteFrame = this.characterIcons[character];
                }
            });

            this.characterContent.addChild(node);
        });
        this.characterContent.getComponent(cc.Layout).updateLayout();
        this.characterView.getComponent(cc.ScrollView).horizontal = this.characterView.width < this.characterContent.width;
        this.characterContent.getComponent(cc.Widget).updateAlignment();

        const mountainPercent = Math.floor(mountainCount * 100 / dataLogs.length);
        this.mountainPercent.string = `${mountainPercent} %`;
        this.oceanPercent.string = `${100 - mountainPercent} %`;

        this.logControl.setData(statsData);
        this.updateCountLabels(characterCounts);
    }

    private updateCountLabels(characterCounts) {
        this.characterCountLabels.forEach((label, index) => {
            label.string = characterCounts[index] ?? "0";
        });
    }

    changeDisplayMode() {
        this.isCharacterMode = !this.isCharacterMode;

        this.characterView.active = this.isCharacterMode;
        this.logControl.node.active = !this.isCharacterMode;
    }
}
