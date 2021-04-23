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

    public static getWinChoices(data: any, choices: any): any {
        const { settlementResult } = data;
        const winChoices = {};
        Object.keys(choices).forEach((choiceKey) => {
            const values = choices[choiceKey];
            Object.keys(values).forEach((choiceValue) => {
                const winCount = LotteryHelper.getWinOnChoice(choiceKey, choiceValue, settlementResult);
                if (winCount > 0) {
                    if (!winChoices[choiceKey]) {
                        winChoices[choiceKey] = [];
                    }
                    winChoices[choiceKey].push(choiceValue);
                }
            });
        });
        return winChoices;
    }

    private static calculateForSpecialCase(locations: any, winChoices: any, special: string) {
        const index = 26;
        if (winChoices["special"] || winChoices["others"]) {
            locations[index] = {
                text: [special.slice(0, special.length - 2), special.slice(-2)],
                highlight: [1]
            };
        } else {
            if (!locations[index]) {
                if (winChoices["head"]) {
                    locations[index] = {
                        text: [
                            special.slice(0, special.length - 2),
                            special.slice(special.length - 2, special.length - 1),
                            special.slice(-1)
                        ],
                        highlight: [1]
                    };
                } else {
                    locations[index] = {
                        text: [special.slice(0, special.length - 1), special.slice(-1)],
                        highlight: [1]
                    };
                }
            }
        }
    }

    private static calculateForSets(resultNumbers: string[], startIndex = 0, choice: string, locations: any) {
        const indices = [];
        resultNumbers.forEach((num, index) => {
            if (parseInt(num.slice(-2)) === parseInt(choice)) {
                indices.push(index);
            }
        });
        indices.forEach((index) => {
            const value = resultNumbers[index];
            locations[index + startIndex] = {
                text: [value.slice(0, value.length - 2), value.slice(-2)],
                highlight: [1]
            };
        });
    }

    public static getPrizeLocations(data: any, winChoices: any): any {
        const { result } = data;
        const list = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "special"];
        const resultNumbers = [];
        list.forEach((key) => {
            result[key].forEach((value) => {
                resultNumbers.push(value);
            });
        });
        const locations = {};
        const special = result.special[0];
        Object.keys(winChoices).forEach((choiceKey) => {
            const choices = winChoices[choiceKey];
            choices.forEach((choice) => {
                switch (choiceKey) {
                    case "parlay2":
                    case "parlay3":
                    case "parlay4":
                        const numbers = choice.split("-");
                        numbers.forEach((number) => {
                            const index = resultNumbers.findIndex((num) => parseInt(num.slice(-2)) === parseInt(number));
                            const value = resultNumbers[index];
                            const values = [value.slice(0, value.length - 2), value.slice(-2)];
                            locations[index] = {
                                text: values,
                                highlight: [1]
                            };
                        });
                        break;

                    case "head":
                    case "tail":
                    case "special":
                    case "others":
                        LotteryHelper.calculateForSpecialCase(locations, winChoices, special);
                        break;

                    case "4Sets":
                        {
                            const numbers4Sets = resultNumbers.slice(-5, -1);
                            LotteryHelper.calculateForSets(numbers4Sets, 22, choice, locations);
                        }
                        break;
                    case "27Sets":
                        LotteryHelper.calculateForSets(resultNumbers, 0, choice, locations);
                        break;
                    default:
                        break;
                }
            });
        });
        return locations;
    }

    public static getTotalBet(totalBets: any): number {
        let total = 0;
        Object.values(totalBets).forEach((bet) => {
            total += +bet;
        });
        return total;
    }
}
