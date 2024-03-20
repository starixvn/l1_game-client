export interface ISystem {
    initSystem(): void;
}

export function isSabaPlay(operator: string) {
    return operator === SystemType.SP;
}

export enum SystemType {
    SC1 = "SC1",
    SC2 = "SC2",
    SP = "SP"
}
