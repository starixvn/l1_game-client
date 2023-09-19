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
            scaleX1: 0.7,
            scaleY1: 0.45,

            scaleX2: 0.7,
            scaleY2: 0.6,
            rotationNode1: 24,
            rotationNode2: -12,
            rotationNode3: 0
        }
    ];

    getChipFlyConfig(value: number): any {
        return this.chipFly[value];
    }
}
