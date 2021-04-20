export default class LotteryHelper {
    public static getNameChoiceType(type: number) {
        const dict = {
            0: "ĐỀ ĐẦU",
            1: "ĐỀ ĐẶC BIỆT",
            2: "SỐ ĐẦU",
            3: "SỐ CUỐI",
            4: "LÔ",
            5: "XIÊN 2",
            6: "XIÊN 3",
            7: "XIÊN 4",
            8: "HAI CỬA"
        };
        return dict[type];
    }

    public static getNameChoiceKey(key: string): string {
        const list = ["4Sets", "special", "head", "tail", "27Sets", "parlay2", "parlay3", "parlay4", "others"];
        const index = list.findIndex((item) => item === key);
        if (index > -1) {
            return LotteryHelper.getNameChoiceType(index);
        } else {
            return "";
        }
    }

    public static getChoiceTypeKey(type: number) {
        const dict = {
            0: "4Sets",
            1: "special",
            2: "head",
            3: "tail",
            4: "27Sets",
            5: "parlay2",
            6: "parlay3",
            7: "parlay4",
            8: "others"
        };
        return dict[type];
    }

    public static getWinOnChoice(choiceKey, choice, settlementResult): number {
        const { occurrences } = settlementResult;
        let winCount = 0;
        switch (choiceKey) {
            case "4Sets":
                if (settlementResult[choiceKey].some((x) => x === choice)) {
                    winCount = occurrences.seventh[choice];
                }
                break;
            case "special":
                if (settlementResult.special === choice) {
                    winCount = 1;
                }
                break;
            case "head":
                if (settlementResult.head === choice) {
                    winCount = 1;
                }
                break;
            case "tail":
                if (settlementResult.tail === choice) {
                    winCount = 1;
                }
                break;
            case "27Sets":
                if (settlementResult[choiceKey].some((x) => x === choice)) {
                    winCount = occurrences.all[choice];
                }
                break;
            case "parlay2":
            case "parlay3":
            case "parlay4":
                const numbers = choice.split("-");
                if (numbers.every((x) => settlementResult["27Sets"].includes(x))) {
                    winCount = 1;
                }
                break;
            case "others":
                if (settlementResult.others[choice]) {
                    winCount = 1;
                }
                break;
        }
        return winCount;
    }

    public static getTotalBet(totalBets: any): number {
        let total = 0;
        Object.values(totalBets).forEach((bet) => {
            total += +bet;
        });
        return total;
    }
}
