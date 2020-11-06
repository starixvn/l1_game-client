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
    renderData(roundResults: any[]) {
        const characterCounts = {};
        this.content.removeAllChildren();

        roundResults.forEach((result) => {
            const node = cc.instantiate(this.itemPrefab);
            const itemComponent = node.getComponent(VipFishPrawnCrabStatsItem);

            _.values(result).forEach((character: number, index: number) => {
                characterCounts[character] = (characterCounts[character] ?? 0) + 1;
                itemComponent.icons[index].spriteFrame = this.characterIcons[character];
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
