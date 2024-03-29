export interface ISystem {
    initSystem(): void;
}

export function isSabaPlayOperator(operator: string) {
    return operator?.toUpperCase() === OperatorAlias.SP;
}

export function isVGOperator(operator: string) {
    return operator?.toUpperCase() === OperatorAlias.VG;
}

export function isSGOperator(operator: string) {
    return operator?.toUpperCase() === OperatorAlias.SG;
}

export enum SystemType {
    SC1 = "SC1",
    SC2 = "SC2"
}

export enum OperatorAlias {
    SP = "SP",
    VG = "VG",
    SG = "SG"
}
