import * as _ from "lodash";

import VipFishPrawnCrabStatsItem from "./VipFishPrawnCrabStatsItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VipFishPrawnCrabStats extends cc.Component {

    @property(cc.Prefab)
    itemPrefab: cc.Prefab = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property({ type: cc.Label })
    characterCountLabels: cc.Label[] = [];

    @property({ type: cc.SpriteFrame })
    characterIcons: cc.SpriteFrame[] = [];

    @property({ type: cc.SpriteFrame })
    highlightCharacterIcons: cc.SpriteFrame[] = [];

    renderData(roundResults: any[]) {
        const characterCounts = {};
        this.content.removeAllChildren();

        roundResults.forEach((result, roundIndex) => {
            const node = cc.instantiate(this.itemPrefab);
            const itemComponent = node.getComponent(VipFishPrawnCrabStatsItem);

            _.values(result).forEach((character: number, index: number) => {
                characterCounts[character] = (characterCounts[character] ?? 0) + 1;
                itemComponent.icons[index].spriteFrame = roundIndex == 0 ? this.highlightCharacterIcons[character] : this.characterIcons[character];
            });

            this.content.addChild(node);
        });

        this.updateCountLabels(characterCounts);
    }

    private updateCountLabels(characterCounts) {
        this.characterCountLabels.forEach((label, index) => {
            label.string = characterCounts[index] ?? "0";
        });
    }
}
