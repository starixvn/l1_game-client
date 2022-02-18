import { BetLog } from "../../../assets/games/hi-lo/view-models/HiLoBetData";
import HiLoTicketDetail from "../../../assets/games/hi-lo/view-models/HiLoTicketDetail";

describe("Test class HiLoTicketdetail", () => {
    let node: cc.Node;
    let comp: HiLoTicketDetail;
    beforeAll(() => {
        node = new cc.Node();
        comp = node.addComponent(HiLoTicketDetail);
        comp.content = new cc.Node();
        comp.scrollView = node.addComponent(cc.ScrollView);
        comp.view = new cc.Node();
        comp.detailTable = new cc.Node();
        comp.roundId = node.addComponent(cc.Label);
    });
    describe("setData", () => {
        //Arrange
        const betLog: BetLog = {
            time: "2022-02-17T04:28:11.289Z",
            id: 1966,
            amount: 100,
            betwin: 233.44,
            betLogDetails: [
                {
                    amount: 50,
                    betwin: 52.5,
                    cards: [
                        { suit: 0, rank: "K" },
                        { suit: 3, rank: "3" }
                    ],
                    choice: "l",
                    order: 1,
                    time: "2022-02-18T08:29:06.789Z"
                },
                {
                    amount: 52.5,
                    betwin: 52.5,
                    cards: [
                        { suit: 3, rank: "3" },
                        { suit: 0, rank: "3" }
                    ],
                    choice: "h",
                    order: 2,
                    time: "2022-02-18T08:29:09.851Z"
                },
                {
                    amount: 68.57,
                    betwin: 70.44,
                    cards: [
                        { suit: 2, rank: "3" },
                        { suit: 1, rank: "5" }
                    ],
                    choice: "h",
                    order: 6,
                    time: "2022-02-18T08:29:23.158Z"
                }
            ]
        };
    });
});
