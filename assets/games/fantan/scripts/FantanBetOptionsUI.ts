import BetItem from "../../_base/view-models/BetItem";
import Fantan from "./Fantan";
const { ccclass, property } = cc._decorator;

@ccclass
export default class FantanBetOptionsUI extends cc.Component {
    betItems: BetItem[] = [];
    main: Fantan;

    initBetOptions(main: Fantan) {
        this.main = main;
        this.getComponentsInChildren(BetItem).forEach((betItem) => {
            this.betItems.push(betItem);
        });
        main.betItems = this.betItems;
    }

    onBetClick(event) {
        this.main.onBetItemClick(event);
    }
}
