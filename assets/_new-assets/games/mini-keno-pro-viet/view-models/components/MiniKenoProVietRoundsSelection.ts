import MiniKenoProVietRoundItem from "./MiniKenoProVietRoundItem";
import MiniKenoProViet from "../MiniKenoProViet";

const { ccclass, property } = cc._decorator;

export interface MiniKenoProVietRound {
    id: number;
    time: string;
    hasBet: boolean;
}

@ccclass
export default class MiniKenoProVietRoundsSelection extends cc.Component {
    @property(cc.Node)
    layout: cc.Node = null;

    @property(cc.Node)
    roundItem: cc.Node = null;

    private main: MiniKenoProViet;

    init(main: MiniKenoProViet) {
        this.main = main;
    }

    selectRound(e) {
        const roundItemNode = e.target as cc.Node;
        const roundItem = roundItemNode.getComponent(MiniKenoProVietRoundItem);
        this.main.changeRound(roundItem.round);
        const dialog = this.node.getComponent("CommonDialog");
        dialog.closeDialog();
    }

    setData(currentRoundId: number, rounds: MiniKenoProVietRound[]) {
        this.layout.destroyAllChildren();

        if (!rounds) {
            return;
        }

        rounds.forEach(round => {
            const roundItemNode = cc.instantiate(this.roundItem);
            const roundItem = roundItemNode.getComponent(MiniKenoProVietRoundItem);
            roundItemNode.active = true;
            roundItem.setHighlight(round.id === currentRoundId);
            roundItem.setData(round);

            this.layout.addChild(roundItemNode);
        })
    }
}
