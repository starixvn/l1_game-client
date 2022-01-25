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
    protected verifyEvent(event: ConfigsType<Choices>) {
        return event.gameConfigs != null;
    }

    protected handle(event: ConfigsType<Choices>) {
        const configs = this.transformToGameConfigs(event);
        this.gameData.configs.change(configs);
    }

    private transformToGameConfigs(event: ConfigsType<Choices>): HiLoGameConfigs {
        const { maxBet, minBet, chips } = event.gameConfigs;

        return Object.assign({}, this.gameData.configs, {
            maxBet,
            minBet,
            chips
        });
    }
}
