import { injectable } from "inversify";

import { ICashSystem, ICreditSystem, System } from "../../../System";

@injectable()
export default class ChipConfig extends System implements ICreditSystem, ICashSystem {
    constructor() {
        super();
    }

    private chipSpriteDict: any;
    public chipOption: number[];

    chipColor = {
        0.5: "#f4e818",
        1: "#848484",
        5: "#2cb400",
        10: "#ff930d",
        20: "#962bfa",
        50: "#ff48e4",
        100: "#1477ff",
        200: "#10e3ff",
        500: "#ff3818",
        1000: "#193c66",
        2000: "#8c6f01",
        3000: "#222222",
        5000: "#be000b",
        10000: "#7b004b",
        20000: "#007866"
    };

    customizeCredit(): void {
        this.chipSpriteDict = {
            0.5: 13,
            1: 0,
            5: 2,
            10: 3,
            20: 12,
            50: 4,
            100: 5,
            200: 6,
            500: 7,
            1000: 8,
            2000: 9,
            3000: 10,
            5000: 11
        };
        this.chipOption = Object.keys(this.chipSpriteDict)
            .map((key) => +key)
            .sort((a, b) => b - a); //sort ascending
    }

    customizeCash(): void {
        this.chipSpriteDict = {
            5: 13,
            10: 0,
            20: 1,
            50: 2,
            100: 3,
            200: 4,
            500: 5,
            1000: 6,
            2000: 14,
            5000: 7,
            10000: 12,
            20000: 8
        };
        this.chipOption = Object.keys(this.chipSpriteDict)
            .map((key) => +key)
            .sort((a, b) => b - a); //sort ascending
    }

    getChipColor(value: number): cc.Color {
        return cc.Color.BLACK.fromHEX(this.chipColor[value]);
    }
}
