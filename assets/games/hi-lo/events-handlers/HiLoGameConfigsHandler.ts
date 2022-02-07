import HiLoEventHandler from "./HiLoEventHandler";
import HiLoGameConfigs from "../events-models/HiLoGameConfigs";
export type ConfigsType<Choices> = {
    gameConfigs: {
        maxBet: number;
        minBet: number;
        chips: any;
    };
};

export class HiLoGameConfigsHandler<Choices> extends HiLoEventHandler<ConfigsType<Choices>, Choices> {
    protected verifyEvent(data: ConfigsType<Choices>) {
        return data.gameConfigs != null;
    }

    protected handle(data: ConfigsType<Choices>) {
        const configs = this.transformToGameConfigs(data);
        this.gameData.configs.change(configs);
    }

    private transformToGameConfigs(data: ConfigsType<Choices>): HiLoGameConfigs {
        const { maxBet, minBet, chips } = data.gameConfigs;

        return Object.assign({}, this.gameData.configs, {
            maxBet,
            minBet,
            chips
        });
    }
}
