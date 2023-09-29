export default class ChipFlyConfig {
    public static getInstance(): ChipFlyConfig {
        if (!this.instance) {
            this.instance = new ChipFlyConfig();
        }

        return this.instance;
    }

    private static instance: ChipFlyConfig;

    chipFly = [
        // {
        //     rotationComp1: 125,
        //     rotationComp2: 100,
        //     scaleX1: 0.45,
        //     scaleY1: 0.7,
        //     scaleX2: 0.65,
        //     scaleY2: 0.7,
        //     skewY: 21,
        //     rotationNode1: 30,
        //     rotationNode2: -10,
        //     rotationNode3: 0
        // },
        {
            rotationComp1: 0,
            rotationComp2: 0,
            scaleX1: ChipParams.scaleX,
            scaleY1: 0.35,

            scaleX2: ChipParams.scaleX,
            scaleY2: ChipParams.scaleY - 0.05,
            rotationNode1: 24,
            rotationNode2: -10,
            rotationNode3: 0
        }
    ];

    getChipFlyConfig(value: number): any {
        return this.chipFly[value];
    }
}

export const ChipParams = {
    scaleX: 0.55,
    scaleY: 0.55,
    offset: 5,
    rotation: 0,
    offsetStack: 3
};
