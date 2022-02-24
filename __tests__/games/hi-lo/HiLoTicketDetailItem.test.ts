import { getStringHourByTime } from "../../../assets/common/helpers/DateTimeHelper";
import { BetLogDetail } from "../../../assets/games/hi-lo/view-models/HiLoBetData";
import HiLoTicketDetailItem from "../../../assets/games/hi-lo/view-models/HiLoTicketDetailItem";
import * as i18n from "i18n/runtime-scripts/LanguageData";
import HiLoCardChoiceView from "../../../assets/games/hi-lo/view-models/HiLoCardChoiceView";
import { numberWithCommas } from "../../../assets/common/helpers/NumberHelper";

describe("HiLoTicketDetailItem", () => {
    describe("renderTicketDetailItem", () => {
        let node: cc.Node;
        let comp: HiLoTicketDetailItem;
        beforeAll(() => {
            node = new cc.Node();
            comp = node.addComponent(HiLoTicketDetailItem);
            comp.time = node.addComponent(cc.Label);
            comp.turn = node.addComponent(cc.Label);
            comp.betChoice = node.addComponent(cc.Label);
            comp.stake = node.addComponent(cc.Label);
            comp.win = node.addComponent(cc.Label);
            comp.baseCard = node.addComponent(HiLoCardChoiceView);
            comp.resultCard = node.addComponent(HiLoCardChoiceView);
        });
        it("should assign data into detail ticket item", () => {
            // Arrange
            const logDetail: BetLogDetail = {
                amount: 1,
                betwin: 1.9,
                cards: [
                    { suit: 2, rank: "8" },
                    { suit: 3, rank: "A" }
                ],
                choice: "h",
                order: 1,
                time: "2022-02-24T08:19:28.305Z"
            };
            const high = "hiLo.high";
            const low = "hiLo.low";
            comp.baseCard.setData = jest.fn();
            comp.resultCard.setData = jest.fn();

            //Act
            comp.renderTicketDetailItem(logDetail);

            //Assert
            expect(comp.time.string).toMatch(`${getStringHourByTime(logDetail.time)}`);
            expect(comp.turn.string).toMatch(logDetail.order.toString());
            expect(comp.betChoice.string).toMatch(logDetail.choice === "h" ? `${i18n.t(high)}` : `${i18n.t(low)}`);
            expect(comp.stake.string).toMatch(numberWithCommas(logDetail.amount));
            expect(comp.win.string).toMatch(numberWithCommas(logDetail.betwin));
        });
    });
});
