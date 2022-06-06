import { DerivedScoreboards } from "sc-scoreboards";
import BaccaratBigRoad from "../../../../baccarat/view-models/BaccaratBigRoad";
import { BaccaratSettlementResult } from "../../../../baccarat/view-models/event-models/BaccaratSettlementResult";
import BlockchainBaccaratDerivedScoreboardItem from "./BlockchainBaccaratDerivedScoreboardItem";
const { ccclass, property } = cc._decorator;

@ccclass
export default class BlockChainBaccaratBigRoad extends BaccaratBigRoad {
    readonly derivedScoreboards: DerivedScoreboards<BaccaratSettlementResult>;

    constructor() {
        super();

        this.derivedScoreboards = new DerivedScoreboards({ height: 6 });
    }

    public renderScoreBoardInGame(data: any): void {
        super.renderScoreBoardInGame(data);
        this.derivedScoreboards.update(this.bigRoadData);
    }

    public renderScoreBoardEachRound(round: BaccaratSettlementResult): void {
        super.renderScoreBoardEachRound(round);
        this.derivedScoreboards.update(this.bigRoadData);
    }

    public getData() {
        return this.bigRoadData;
    }

    // @property([cc.Node])
    // derivedScoreboardContainers: cc.Node[] = [];

    // @property([cc.Node])
    // derivedScoreboardContent: cc.Node[] = [];

    // @property([cc.Prefab])
    // derivedScoreboardItem: cc.Prefab[] = [];

    // private derivedScoreboards: DerivedScoreboards<BaccaratSettlementResult>;
    // readonly derivedScoreboardsIndex = {
    //     bigEyeBoy: 0,
    //     smallRoad: 1,
    //     cockroachPig: 2
    // };
    // readonly derivedScoreboardsKeys = ["bigEyeBoy", "smallRoad", "cockroachPig"];
    // readonly derivedScoreboardsHeight = 67;
    // readonly derivedScoreboardMinColumn = 11;

    // onLoad(): void {
    //     super.onLoad();
    //     this.derivedScoreboards = this.initialDerivedScoreboards();
    // }

    // private initialDerivedScoreboards() {
    //     return new DerivedScoreboards({ height: 6 });
    // }

    // public renderScoreBoardInGame(data: any): void {
    //     super.renderScoreBoardInGame(data);
    //     this.renderDerivedScoreboards();
    // }

    // public renderScoreBoardEachRound(round: BaccaratSettlementResult): void {
    //     super.renderScoreBoardEachRound(round);
    //     this.renderDerivedScoreboards();
    // }

    // private renderDerivedScoreboards() {
    //     this.derivedScoreboards.update(this.bigRoadData);
    //     this.updateDerivedScoreboardsUI();
    // }

    // private updateDerivedScoreboardsUI() {
    //     this.updateDerivedScoreboard(this.derivedScoreboardsIndex.bigEyeBoy);
    //     this.updateDerivedScoreboard(this.derivedScoreboardsIndex.smallRoad);
    //     this.updateDerivedScoreboard(this.derivedScoreboardsIndex.cockroachPig);
    //     this.scrollToRight();
    // }

    // private updateDerivedScoreboard(index: number) {
    //     const data = this.derivedScoreboards.getScoreboardData(this.getKey(index));
    //     const contentLength = this.derivedScoreboardContent[index].childrenCount;

    //     this.updateDerivedScoreboardContentChild(data.length - contentLength, index);

    //     for (let column = 0; column < data.length; column++) {
    //         const scoreboardItem = this.derivedScoreboardContent[index].children[column];
    //         const scoreBoardItemWorker = scoreboardItem.getComponent(BlockchainBaccaratDerivedScoreboardItem);
    //         for (let row = 0; row < 6; row++) {
    //             const bigRoadScoreBoardPoint = data[row][column];
    //             !this.firstRender && scoreBoardItemWorker.resetNode(bigRoadScoreBoardPoint);
    //             if (bigRoadScoreBoardPoint.status !== undefined) {
    //                 scoreBoardItemWorker.renderNode(bigRoadScoreBoardPoint);
    //             }
    //         }
    //     }
    // }

    // private getKey(index: number): "bigEyeBoy" | "smallRoad" | "cockroachPig" {
    //     return this.derivedScoreboardsKeys[index] as "bigEyeBoy" | "smallRoad" | "cockroachPig";
    // }

    // private updateDerivedScoreboardContentChild(numberColumnDifferent: number, index: number) {
    //     let contentWidth = this.derivedScoreboardContent[index].getContentSize().width;
    //     if (numberColumnDifferent > 0) {
    //         for (let i = 0; i < numberColumnDifferent; i++) {
    //             const scoreboardItem = cc.instantiate(this.derivedScoreboardItem[index]);
    //             this.derivedScoreboardContent[index].addChild(scoreboardItem);
    //             contentWidth += this.scoreboardItemWidth;
    //             this.derivedScoreboardContent[index].setContentSize(contentWidth, this.derivedScoreboardsHeight);
    //         }
    //     }

    //     if (numberColumnDifferent < 0) {
    //         for (let i = 0; i < Math.abs(numberColumnDifferent); i++) {
    //             if (this.derivedScoreboardContent[index].childrenCount <= this.derivedScoreboardMinColumn) return;
    //             this.derivedScoreboardContent[index].children.pop();
    //             contentWidth -= this.scoreboardItemWidth;
    //             this.derivedScoreboardContent[index].setContentSize(contentWidth, this.derivedScoreboardsHeight);
    //         }
    //     }
    // }

    // private scrollToRight() {
    //     this.derivedScoreboardContainers.forEach((item) => {
    //         item?.getComponent(cc.ScrollView).scrollToRight();
    //     });
    // }
}
