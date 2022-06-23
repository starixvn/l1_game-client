import { BundleManager } from "bundle-management";
import * as i18n from "i18n/runtime-scripts/LanguageData";

import { GameInfos } from "../configs/SabaConfigs";
import MiniPanel from "../mini-games-panel/view-models/MiniPanel";
import { numberWithCommas } from "./helpers/NumberHelper";

export default class GameUtils {
    public static addFlyingText(parent: cc.Node, win: boolean, value: number, duration = 1, startY = 0, destY = 100) {
        const temp = new cc.Node().addComponent(cc.Label);
        temp.string = (win ? "+" : "-") + numberWithCommas(value, 2);
        temp.font = win ? cc.RedT.util.fontCong : cc.RedT.util.fontTru;
        temp.lineHeight = 130;
        temp.fontSize = 30;
        temp.node.position = cc.v3(0, startY, 0);
        parent.addChild(temp.node);
        temp.node.runAction(
            cc.sequence(
                cc.moveTo(duration, cc.v2(0, startY + destY)),
                cc.callFunc(function () {
                    this.node.destroy();
                }, temp)
            )
        );
        return temp.node;
    }

    public static getText(key: string, opt: any = {}) {
        return i18n.t(key, opt);
    }

    public static getBetChoiceString(choice: string): string {
        return i18n.t(`ui.choice_${choice}`);
    }

    public static capitalizeWords(str: string) {
        return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.slice(0, 1).toLowerCase();
        });
    }

    public static capitalizeWordIntoString(str: string) {
        const words = str.split(" ");
        return words.map((word) => word[0] + word.substring(1).toLowerCase()).join(" ");
    }

    public static loadResource(path: string): Promise<cc.Prefab> {
        return new Promise((resolve) => {
            cc.resources.load(path, (err, prefab: cc.Prefab) => {
                resolve(prefab);
            });
        });
    }

    public static getChipValues(bet: number, options: number[]): any {
        const chipValue = this.calcChipValue(options, bet);
        return chipValue.values;
    }

    public static getChipQuantity(bet: number, options: number[]): any {
        const list = [...options].reverse();
        const chipValue = this.calcChipValue(list, bet);
        const values = chipValue.values;

        if (chipValue.chipTotal > 0) {
            values[0] = 1;
        }
        return values;
    }

    private static calcChipValue(list, total) {
        const values = {};
        let chipTotal = total;
        list.forEach((value) => {
            const count = Math.floor(chipTotal / value);
            values[value] = count;
            chipTotal = chipTotal % value;
        });

        return { values, chipTotal };
    }

    static clearGameSetting(gameId) {
        cc.sys.localStorage.setItem(`UserSetting_game_${gameId}`, "");
    }

    static setGameSetting(gameId, data) {
        cc.sys.localStorage.setItem(`UserSetting_game_${gameId}`, JSON.stringify(data));
    }

    static getGameSetting(gameId) {
        const storage = cc.sys.localStorage.getItem(`UserSetting_game_${gameId}`);
        if (!storage || !storage.length) {
            return {};
        }
        return JSON.parse(storage);
    }

    public static async openGame(
        gameId: number,
        miniPanel: MiniPanel,
        openLuckyWheelFunc = () => {
            // handle
        },
        callBackLobby = () => {
            // handle
        }
    ) {
        const info = GameInfos[gameId];

        if (info.remote && !info.mini) {
            const bundleManager = BundleManager.getInstance();

            await bundleManager.loadBundle(gameId.toString());
        }

        if (!info.mini && gameId > 0) {
            cc.sys.localStorage.setItem(`orientation`, "");
            miniPanel.openNewSocketTableGame(null, gameId);
            return;
        }

        openLuckyWheelFunc && openLuckyWheelFunc();

        if (gameId === 0) {
            callBackLobby && callBackLobby();
            return;
        }

        if (info.mainSocket) {
            miniPanel.openGame(null, gameId);
            return;
        }

        if (info.gameContainer) {
            miniPanel.openMiniContainerGame(gameId);
            return;
        }

        miniPanel.openNewSocketMiniGame(null, gameId);
    }

    public static roundFixed(num: number, fixedNumber: number): number {
        const numToFixedDp = Number(num).toFixed(fixedNumber);
        return Number(numToFixedDp);
    }

    public static moveToOtherNode(node: cc.Node, destNode: cc.Node) {
        const position = destNode.convertToNodeSpaceAR(node.convertToWorldSpaceAR(cc.v3(0, 0, 0)));
        node.parent = destNode;
        node.position = position;
    }

    public static floatToNumber2(opt: {
        label: cc.Label;
        amount: number;
        start?: number;
        prefixStr?: string;
        formatNumber?: (value) => string;
        stepValue?: number;
        stepTime?: number;
    }) {
        return new Promise<void>((resolve) => {
            const { label, amount: end, start } = opt;
            const prefixStr = opt.prefixStr ?? "";
            const defaultFormater = (v) => numberWithCommas(v, 2, false);
            const formatNumber = opt.formatNumber ?? defaultFormater;
            const stepValue = opt.stepValue ?? 0.01;
            const stepTime = opt.stepTime ?? 0.02;
            const startStr = label.string.replace(prefixStr, "");
            const startValue = start || parseFloat(startStr.replace(/,/g, "")) || 0;
            const range = Math.abs(end - startValue);
            if (!range) {
                resolve();
                return;
            }

            const repeatCount = Math.floor(range / stepValue);

            let value = startValue;
            label.node.stopAllActions();
            const formatText = (value) => prefixStr + formatNumber(value);
            cc.tween(label.node)
                .repeat(
                    repeatCount,
                    cc
                        .tween(label.node)
                        .call(() => {
                            label.string = formatText(value);
                            value += stepValue;
                        })
                        .delay(stepTime)
                )
                .call(() => {
                    label.string = formatText(end);
                    resolve();
                })
                .start();
        });
    }

    public static floatToNumber(opt: {
        label: cc.Label;
        amount: number;
        duration: number;
        start?: number;
        noZeroSuffix?: boolean;
        prefixStr?: string;
    }) {
        const { label, amount: end, start, duration } = opt;
        const noZeroSuffix = opt.noZeroSuffix ?? true;
        const prefixStr = opt.prefixStr ?? "";
        const startStr = label.string.replace(prefixStr, "");
        const startValue = start || parseFloat(startStr.replace(/,/g, "")) || 0;
        const range = Math.abs(end - startValue);
        if (!range) {
            return;
        }

        let stepTime, repeatCount, stepValue;
        if (duration !== undefined) {
            stepTime = Math.max(duration / range, 0.05);
            repeatCount = Math.floor(duration / stepTime);
            stepValue = +(range / repeatCount).toFixed(2);
        } else {
            stepValue = 0.01;
            stepTime = 0.1;
            repeatCount = Math.floor(range / stepValue);
        }

        let value = startValue;
        label.node.stopAllActions();
        cc.tween(label.node)
            .repeat(
                repeatCount,
                cc
                    .tween(label.node)
                    .call(() => {
                        label.string = prefixStr + numberWithCommas(value, 2, noZeroSuffix);
                        value += stepValue;
                    })
                    .delay(stepTime)
            )
            .call(() => {
                label.string = prefixStr + numberWithCommas(end, 2, noZeroSuffix);
            })
            .start();
    }

    public static getAvatarSprite(avatarId: number): Promise<cc.SpriteFrame> {
        return new Promise((resolve) => {
            cc.resources.load<cc.SpriteAtlas>("profile-picture", cc.SpriteAtlas, (err, atlas) => {
                const name = avatarId ? avatarId : 1;
                const frame = atlas.getSpriteFrame(name.toString());
                resolve(frame);
            });
        });
    }

    public static getGameNameString(gameId): string {
        if (!gameId) {
            return "";
        }
        return i18n.t(`gameNames.${gameId}`);
    }

    public static getValueByCurrency(value: number, otherRate?: number): number {
        if (!otherRate) {
            otherRate = 1;
        }
        return (value * otherRate) / cc.RedT.user.rate;
    }

    public static getTicketValueByCurrency(value: number, userRate?: number, otherRate?: number): number {
        if (!otherRate) {
            otherRate = 1;
        }

        if (!userRate) {
            userRate = cc.RedT.user.rate;
        }
        return (value * otherRate) / userRate;
    }

    public static getFilterValuesByStakeLevel(values: number[], gameConfigs: any): number[] {
        let minBet = gameConfigs.minBet;
        let maxBet = gameConfigs.maxBet;

        if (cc.RedT.userStakeLevel) {
            const minStake = cc.RedT.userStakeLevel.minBet;
            const maxStake = cc.RedT.userStakeLevel.maxBet;

            minBet = Math.max(minStake, minBet);
            maxBet = Math.min(maxStake, maxBet);
        }

        return values.map((a) => +a).filter((value) => value >= minBet && value <= maxBet);
    }

    public static async copyToClipboard(data: string, hintLabel: cc.Label, callback): Promise<void> {
        try {
            await navigator.clipboard.writeText(data).then(() => {
                if (callback) {
                    callback();
                }
            });
        } catch {
            hintLabel.string = i18n.t("messages.copyMD5Failed");
            if (callback) {
                callback();
            }
        }
    }

    public static isIpad(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /ipad/.test(userAgent);
    }

    public static isPhone(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /android|iphone/i.test(userAgent);
    }

    public static isSafariIOSPhone(): boolean {
        return cc.sys.os === cc.sys.OS_IOS && !window.navigator.userAgent.match(/CriOS/i);
    }

    public static createNodeFromPrefab(prefab: cc.Prefab) {
        return cc.instantiate(prefab);
    }

    public static delayTime(time: number) {
        return new Promise<void>((resolve) => {
            cc.tween({})
                .delay(time)
                .call(() => resolve())
                .start();
        });
    }

    public static showNode(node: cc.Node, transitionTime = 0.3) {
        node.active = true;
        node.opacity = 0;
        cc.tween(node).to(transitionTime, { opacity: 255 }).start();
    }

    public static hideNode(node: cc.Node, transitionTime = 0.3, onHidden?: () => void) {
        cc.tween(node)
            .to(transitionTime, { opacity: 0 })
            .call(() => {
                node.active = false;
                onHidden && onHidden();
            })
            .start();
    }
}
