import GameUtils from "../../../common/GameUtils";
import ItemContentMenu from "../../../common/helpers/Menu/ItemContentMenu";
import CommonDialog from "../../../common/_base/view-models/CommonDialog";
import GameBase from "../../_base/GameBase";
import GameLogControlBase from "../../_base/view-models/GameLogControlBase";
import { BitcoinMasterBetType, BitcoinMasterHeaderMenu } from "./BitcoinMasterCommon";
import BitcoinMasterRoundHistoryItem from "./BitcoinMasterRoundHistoryItem";
import BitcoinMasterStatisticPercent from "./BitcoinMasterStatisticPercent";
import BitcoinMasterUtils from "./BitcoinMasterUtils";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BitcoinMasterStatistic extends cc.Component {
    @property(cc.Node)
    header: cc.Node = null;

    @property(GameLogControlBase)
    logControl: GameLogControlBase = null;

    @property(BitcoinMasterStatisticPercent)
    leftPercent: BitcoinMasterStatisticPercent = null;

    @property(BitcoinMasterStatisticPercent)
    rightPercent: BitcoinMasterStatisticPercent = null;

    @property(CommonDialog)
    dialog: CommonDialog = null;

    protected activeTab = BitcoinMasterHeaderMenu.upDown;
    protected upDownStatistic: any = null;
    protected evenOddStatistic: any = null;
    protected data: any = null;

    onLoad() {
        this.dialog.addOnDidHide(() => this.node.destroy());
        this.loadUpDownData();
    }

    onSelectHeader(event, name) {
        this.header.children.forEach((header) => {
            const menuComponent = header.getComponent(ItemContentMenu);

            if (header.name === name) {
                this.activeTab = name;
                menuComponent.select();
            } else {
                menuComponent.unselect();
            }
        });

        name === BitcoinMasterHeaderMenu.upDown ? this.loadUpDownData() : this.loadEvenOddData();
    }

    init(main: GameBase) {
        const condition = () => {
            return main.currentTimeRemaining > main.config.betTime;
        };
        this.logControl.init(condition);
    }

    setData(currentDataLogs: any) {
        this.data = [...currentDataLogs.reverse()];
        this.calculateStatisticPercent();
    }

    private setUpDownRoundHistoryItemData() {
        const data = this.data;
        const logData = data.map((d) => {
            const result = parseFloat(BitcoinMasterUtils.getUpDownResult(d.result));
            return result > 0 ? 1 : 0;
        });
        this.logControl.setData(logData);
        const items = this.logControl.content.getComponentsInChildren(BitcoinMasterRoundHistoryItem);
        items.forEach((item, i) => item.setUpDownValue(data[i].result));
    }

    private setEvenOddRoundHistoryItemData() {
        const data = this.data;
        const logData = data.map((d) => {
            const result = parseFloat(BitcoinMasterUtils.getEvenOddResult(d.result.close));
            return result % 2 ? 1 : 0;
        });
        this.logControl.setData(logData);
        const items = this.logControl.content.getComponentsInChildren(BitcoinMasterRoundHistoryItem);
        items.forEach((item, i) => item.setEvenOddValue(data[i].result));
    }

    calculateStatisticPercent() {
        const total = this.data.length;

        if (total === 0) {
            this.setStatisticData(0, 0, 0, 0);
        }

        let upCount = 0;
        let downCount = 0;
        let evenCount = 0;
        let oddCount = 0;
        let upPecent = 0;
        let downPecent = 0;
        let evenPecent = 0;
        let oddPecent = 0;

        this.data.map((log) => {
            Object.keys(log.settlementResult).forEach((key) => {
                if (key === BitcoinMasterBetType.up && log.settlementResult[key] === true) {
                    upCount += 1;
                }

                if (key === BitcoinMasterBetType.down && log.settlementResult[key] === true) {
                    downCount += 1;
                }

                if (key === BitcoinMasterBetType.even && log.settlementResult[key] === true) {
                    evenCount += 1;
                }

                if (key === BitcoinMasterBetType.odd && log.settlementResult[key] === true) {
                    oddCount += 1;
                }
            });
        });

        upPecent = Math.round((upCount * 100) / total);
        downPecent = Math.round((downCount * 100) / total);
        evenPecent = Math.round((evenCount * 100) / total);
        oddPecent = Math.round((oddCount * 100) / total);

        this.setStatisticData(upPecent, downPecent, evenPecent, oddPecent);
    }

    setStatisticData(upValue, downValue, evenValue, oddValue) {
        this.upDownStatistic = {
            left: {
                name: GameUtils.getBetChoiceString(BitcoinMasterBetType.up),
                value: upValue
            },
            right: {
                name: GameUtils.getBetChoiceString(BitcoinMasterBetType.up),
                value: downValue
            }
        };

        this.evenOddStatistic = {
            left: {
                name: GameUtils.getBetChoiceString(BitcoinMasterBetType.even),
                value: evenValue
            },
            right: {
                name: GameUtils.getBetChoiceString(BitcoinMasterBetType.odd),
                value: oddValue
            }
        };
    }

    updateStatisticLabels(data: any) {
        this.leftPercent.text.string = data.left.name;
        this.leftPercent.value.string = `${data.left.value}%`;

        this.rightPercent.text.string = data.right.name;
        this.rightPercent.value.string = `${data.right.value}%`;
    }

    loadUpDownData() {
        this.updateStatisticLabels(this.upDownStatistic);
        const color = cc.Color.WHITE;
        this.leftPercent.setColor(color.fromHEX("#c4f738"));
        this.rightPercent.setColor(color.fromHEX("#f3485f"));
        this.setUpDownRoundHistoryItemData();
    }

    loadEvenOddData() {
        this.updateStatisticLabels(this.evenOddStatistic);
        const color = cc.Color.WHITE;
        this.leftPercent.setColor(color.fromHEX("#bac5ca"));
        this.rightPercent.setColor(color.fromHEX("#F3485F"));
        this.setEvenOddRoundHistoryItemData();
    }
}
