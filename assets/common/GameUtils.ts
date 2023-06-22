import { Base64 } from "base64-string";
import { BundleManager } from "bundle-management";
import * as i18n from "i18n/runtime-scripts/LanguageData";

import SocketIOController from "../SocketIOController";
import { GameConfiguration, getGameConfiguration, isUsingRemoteBundle } from "../configs/GameConfigurations";
import LobbyManager from "../lobby/main/view-models/LobbyManager";
import LobbyMenuConfig from "../lobby/main/view-models/LobbyMenuConfig";
import { appManager } from "../managers/AppManager";
import { uiManager } from "../managers/GameUIManager";
import { InternalEvents } from "../managers/InternalEvents";
import { StorageManager } from "../managers/StorageManager";
import MiniPanel from "../mini-games-panel/view-models/MiniPanel";
import { preloadAssets } from "./PreloadRemoteAsset";
import SetStaticFontSizeLabel from "./SetStaticFontSizeLabel";
import AudioManager from "./audio/AudioManager";
import BetChips from "./bet-chips/view-models/BetChips";
import ChipStack from "./chip-stack/views/ChipStack";
import { numberWithCommas } from "./helpers/NumberHelper";
import { buildMicrositeGameUrl } from "./helpers/UrlHelper";
import { FormationHandler } from "./i18n/FormationHandler";
import { userManager } from "./user/UserManager";

export const MINI_GAMES_SCALE_ON_DESKTOP = 0.8;
export const MICRO_GAMES_NOT_OFFER_BANNER = [9, 48, 49, 50];

declare global {
    interface Window {
        ReactNativeWebView: any;
    }
}

export default class GameUtils {
    static base64: Base64;

    public static base64Decode(data: string): string {
        if (!GameUtils.base64) {
            GameUtils.base64 = new Base64();
        }
        return GameUtils.base64.decode(data);
    }

    public static base64Encode(data: string): string {
        if (!GameUtils.base64) {
            GameUtils.base64 = new Base64();
        }
        return GameUtils.base64.encode(data);
    }
    public static addFlyingText(parent: cc.Node, win: boolean, value: number, duration = 1, startY = 0, destY = 100) {
        const temp = new cc.Node().addComponent(cc.Label);
        temp.string = (win ? "+" : "-") + numberWithCommas(value, 2);
        temp.font = win ? appManager.font.increaseMoney : appManager.font.decreaseMoney;
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

    public static loadRemote<T>(url: string): Promise<T> {
        return new Promise((resolve, reject) => {
            cc.assetManager.loadRemote(url, (err, asset: any) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(asset);
            });
        });
    }

    public static loadResource(path: string): Promise<cc.Prefab> {
        return new Promise((resolve) => {
            cc.resources.load(path, (err, prefab: cc.Prefab) => {
                resolve(prefab);
            });
        });
    }

    public static async loadGameIcon(gameId: number, systemPath = ""): Promise<cc.Prefab> {
        const category = StorageManager.get("current_game_category") ?? 0;
        const gameConfiguration = getGameConfiguration(gameId);
        const gameSetting = LobbyManager.getInstance().getGame(gameId, category);

        if (!!gameConfiguration?.remoteBundle) {
            const directory = systemPath === "" ? "icons" : `icons/${systemPath}`;
            const path = `${gameConfiguration.isMicrosite ? gameId + "/" : ""}${directory}/${gameSetting?.bigSize ? "Big" : "Small"}`;
            return BundleManager.getInstance().loadAsset<cc.Prefab>({
                bundleId: gameId.toString(),
                path: path,
                type: cc.Prefab
            });
        } else {
            const directory = systemPath === "" ? "lobby/games" : `lobby/games/${systemPath}`;
            const path = `${directory}/${gameId}`;

            return GameUtils.loadResource(path);
        }
    }

    public static async loadMiniPanelGameIcon(gameId: number): Promise<cc.Prefab> {
        const gameConfiguration = getGameConfiguration(gameId);

        if (!!gameConfiguration?.remoteBundle) {
            const path = `icons/SmallMiniPanel`;
            const devPath = `../games/*/${path}`;
            try {
                return await BundleManager.getInstance().loadAsset<cc.Prefab>({
                    bundleId: gameId.toString(),
                    path: path,
                    pathForDevMode: devPath,
                    type: cc.Prefab
                });
            } catch (e) {
                cc.warn(`Missing prefab for ${path} `, e);
            }
        } else {
            return await GameUtils.loadResource(`minipanel/games/${gameId}`);
        }
    }

    public static async loadMiniGamePrefab(gameId: number, onProgress: (completed: number, total: number, item?: unknown) => void) {
        const gameConfiguration = getGameConfiguration(gameId);

        if (!!gameConfiguration?.remoteBundle) {
            const prefabPath = `views/${gameConfiguration.key}`;

            return BundleManager.getInstance().loadAsset<cc.Prefab>({
                bundleId: gameId.toString(),
                path: prefabPath,
                type: cc.Prefab,
                onProgress
            });
        } else {
            const prefabPath = `games/minigame/${gameConfiguration.key}`;

            return new Promise<cc.Prefab>((resolve, reject) => {
                cc.resources.load<cc.Prefab>(prefabPath, cc.Prefab, onProgress, (error, prefab) => {
                    if (error || !prefab) {
                        reject(error);
                    } else {
                        resolve(prefab);
                    }
                });
            });
        }
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

    private static setStorageGame(key, gameId, data) {
        StorageManager.set(`${key}_${gameId}`, data);
    }

    static getStorageGame(key, gameId) {
        return StorageManager.get(`${key}_${gameId}`) ?? {};
    }

    static clearGameSetting(gameId) {
        StorageManager.remove(`UserSetting_game_${gameId}`);
    }

    /**
     * Normal Game Setting will CLEAR when enter game by user click
     * @param gameId
     * @param data
     */
    static setGameSetting(gameId, data) {
        GameUtils.setStorageGame(`UserSetting_game`, gameId, data);
    }

    static setSubGameSetting(gameId, key, subData) {
        const data = GameUtils.getSpecificGameSetting(gameId);
        data[key] = subData;
        GameUtils.setSpecificGameSetting(gameId, data);
    }

    static getSubGameSetting(gameId, key) {
        const data = GameUtils.getSpecificGameSetting(gameId);
        return data[key];
    }

    static getGameSetting(gameId) {
        return GameUtils.getStorageGame("UserSetting_game", gameId);
    }

    /**
     * Specific Game Setting will NOT CLEAR when enter game by user click
     * @param gameId
     * @param data
     */
    static setSpecificGameSetting(gameId, data) {
        GameUtils.setStorageGame("SpecificGame", gameId, data);
    }

    static getSpecificGameSetting(gameId) {
        return GameUtils.getStorageGame("SpecificGame", gameId);
    }

    public static async openGameDirect(gameId: number, socketIOController: SocketIOController) {
        const gameConfiguration = getGameConfiguration(gameId);
        if (gameConfiguration?.isMicrosite) {
            this.openGameMicrosite(gameId);
            return;
        }
        await GameUtils.tryOpenGameDirect(gameId, socketIOController);
        await this.loadSceneGame(gameId, socketIOController);
    }

    public static async tryOpenGameDirect(gameId: number, socketIOController: SocketIOController) {
        await socketIOController.openGameSocket(gameId);
        await this.preloadGameRoom(gameId);
    }

    public static openGameMicrosite(gameId: number) {
        const auData = window.authData;
        const directMode = StorageManager.get("direct_mode");
        const url = buildMicrositeGameUrl(gameId);
        const audio = AudioManager.getInstance();
        const params = {
            ss: auData.ss,
            uname: auData.username,
            lang: auData.language,
            appType: auData.system,
            ref: directMode?.ref,
            rurl: directMode?.returnUrl || GameUtils.base64Encode(window.location.href),
            musicEnable: audio.musicEnabled,
            sfxEnable: audio.sfxEnabled
        };
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach((key) => params[key] !== undefined && searchParams.append(key, params[key]));
        const encodedQueryString = GameUtils.base64Encode(searchParams.toString());

        window.location.href = `${url}/?params=${encodedQueryString}`;
    }

    public static async loadSceneGame(gameId, socketIOController: SocketIOController) {
        const sceneName = socketIOController.gameScene[gameId];
        await new Promise<void>((resolve) => {
            //start loading game
            cc.director.preloadScene(
                sceneName,
                (progress, total) => {
                    uiManager.emitter.emit(`${InternalEvents.LOADING_GAME}-${gameId}`, { progress, total });
                },
                (error) => {
                    //hide loading for game
                    if (error) {
                        this.onForceReload();
                    } else {
                        cc.director.loadScene(sceneName, resolve);
                    }
                }
            );
        });
    }

    private static onForceReload(showNotice = true, message = i18n.t("messages.newUpdateAvailable")) {
        const forceReload = () => {
            location.reload();
        };

        if (showNotice) {
            const data = {
                text: message,
                isInfo: true
            };

            uiManager.emitter.emit(InternalEvents.NOTICE, {
                data,
                onConfirm: null,
                onClose: forceReload
            });
        } else {
            forceReload();
        }
    }

    public static preloadGameRoom(gameId) {
        return new Promise((resolve) => {
            const language = window.i18n.curLang;
            if (isUsingRemoteBundle(gameId)) {
                const path = `i18n/images/${language}`;
                const preloadPath = `preload`;
                BundleManager.getInstance()
                    .loadBundle(`${gameId}`)
                    .then((bundle: cc.AssetManager.Bundle) => {
                        bundle.loadDir(preloadPath, () => {
                            bundle.loadDir(path, cc.SpriteFrame, resolve);
                        });
                    })
                    .catch(resolve);
            } else {
                cc.resources.loadDir(`image/${language}/${gameId}`, cc.SpriteFrame, null, resolve);
            }
        });
    }

    public static async openGame(
        gameId: number,
        miniPanel: MiniPanel,
        onOpenMiniGame = () => {
            // handle
        }
    ) {
        uiManager.setCurrentGameId(gameId);
        const loading = miniPanel.getGameLoadingComp(gameId);
        loading.setDefaultPercent();

        const gameConfiguration = getGameConfiguration(gameId);
        if (gameConfiguration?.isMicrosite) {
            this.openGameMicrosite(gameId);
            return;
        }

        await GameUtils.preloadGameAssets(gameConfiguration, miniPanel, gameId);

        if (!gameConfiguration.mini && gameId > 0) {
            StorageManager.remove(`orientation`);
            miniPanel.openNewSocketTableGame(null, gameId);
            return;
        }

        onOpenMiniGame && onOpenMiniGame();
        miniPanel.openNewSocketMiniGame(null, gameId);
    }

    private static async preloadGameAssets(gameConfiguration: GameConfiguration, miniPanel: MiniPanel, gameId: number) {
        if (!!gameConfiguration.remoteBundle) {
            await BundleManager.getInstance().loadBundle(gameId.toString());
            await preloadAssets(gameId.toString());
        }
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
            const name = avatarId ? avatarId : 1;
            cc.resources.load<cc.SpriteFrame>(`avatars/${name}`, cc.SpriteFrame, (err, frame) => {
                if (frame) {
                    resolve(frame);
                }
            });
        });
    }

    public static getGameNameString(gameId): string {
        if (!gameId) {
            return "";
        }
        return i18n.t(`gameNames.${gameId}`);
    }

    public static async getDisplayGameName(gameId, breakline = false): Promise<string> {
        const lobbyGameNameKey = `lobbyNames.${gameId}`;
        const generalGameNameKey = `generalGameNames.${gameId}`;
        const gameNameKey = `gameNames.${gameId}`;
        const list = [generalGameNameKey, gameNameKey];
        if (breakline) {
            list.unshift(lobbyGameNameKey);
        }
        const findNameKey = () => list.find((key) => key !== i18n.t(key));

        let key = findNameKey();
        if (key === undefined) {
            await BundleManager.getInstance().loadBundle(gameId.toString());
        }
        key = findNameKey();

        return key ? i18n.t(key) : key;
    }

    public static getValueByCurrency(value: number, otherRate?: number): number {
        if (!otherRate) {
            otherRate = 1;
        }

        return (value * otherRate) / userManager.rate;
    }

    public static getTicketValueByCurrency(value: number, userRate?: number, otherRate?: number): number {
        if (!otherRate) {
            otherRate = 1;
        }

        if (!userRate) {
            userRate = userManager.rate;
        }
        return (value * otherRate) / userRate;
    }

    public static getValueByExchangeRateCode(value: number, exchangeRateCode) {
        let currencyRate = exchangeRateCode[userManager.currencyCode];
        if (!currencyRate) {
            currencyRate = 1;
        }
        return value / (userManager.multiplier * currencyRate);
    }

    public static getFilterValuesByStakeLevel(values: number[], gameConfigs: any): number[] {
        let minBet = gameConfigs.minBet;
        let maxBet = gameConfigs.maxBet;

        const userStakeLevel = userManager.stakeLevel;
        minBet = Math.max(userStakeLevel.minBet, minBet);
        maxBet = Math.min(userStakeLevel.maxBet, maxBet);
        return values.map((a) => +a).filter((value) => value >= minBet && value <= maxBet);
    }

    public static async copyToClipboard(data: string, hintLabel: cc.Label, callback): Promise<void> {
        const showResult = (message: string) => {
            hintLabel.string = message;
            if (callback) {
                callback();
            }
        };

        try {
            if (this.isAndroidWebView()) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ eventType: "copy_to_clipboard", data: data }));
                showResult(i18n.t("messages.copy_success"));
            } else {
                await navigator.clipboard.writeText(data).then(() => {
                    showResult(i18n.t("messages.copy_success"));
                });
            }
        } catch (e) {
            showResult(i18n.t("messages.copyMD5Failed")); //e.message
        }
    }

    public static isIpad(): boolean {
        const userAgent = window.navigator.userAgent.toLowerCase();
        return /ipad/.test(userAgent);
    }

    public static isAndroidWebView(): boolean {
        return (cc.sys.os === cc.sys.OS_LINUX || cc.sys.os === cc.sys.OS_ANDROID) && window.ReactNativeWebView;
    }

    public static isAndroid(): boolean {
        return cc.sys.os === cc.sys.OS_ANDROID;
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

    public static waitUntil = async (condition, interval = 1000, maxWait = 10000) => {
        const startTime = new Date().getTime();
        for (;;) {
            try {
                if (await condition()) {
                    return true;
                }
            } catch (e) {
                throw e;
            }

            if (new Date().getTime() - startTime > maxWait) {
                throw new Error("Max wait reached");
            } else {
                await new Promise((resolve) => setTimeout(resolve, interval));
            }
        }
    };
    public static showNode(node: cc.Node, transitionTime = 0.3) {
        node.active = true;
        node.opacity = 0;
        cc.tween(node).to(transitionTime, { opacity: 255 }).start();
    }

    public static hideNode2(node: cc.Node, options: any) {
        const duration = options.duration ?? 0.3;
        const onHidden = options.onHidden;
        GameUtils.hideNode(node, duration, onHidden);
    }

    public static hideNode(node: cc.Node, transitionTime = 0.3, onHidden?: () => void) {
        cc.tween(node)
            .to(transitionTime, { opacity: 0 })
            .call(() => {
                onHidden && onHidden();
            })
            .start();
    }

    public static unCacheAndHideGameLoading(gameId: number) {
        const loading = uiManager.getLoadingWithGameID(gameId);
        if (loading) {
            loading.setLoadingVisibility(false);
            uiManager.unCacheIconLoading(gameId);
        }
    }

    public static getCurrentLanguage() {
        return window.i18n.curLang;
    }

    public static async getBanner(lobbyMenuConfig: LobbyMenuConfig, id: number, systemPath = "") {
        const newSuffix = lobbyMenuConfig.isNewGame(id) ? "_new" : "";
        const currentLang = this.getCurrentLanguage() !== "vi" ? `_${this.getCurrentLanguage()}` : "";
        const name1 = `${id}${currentLang}${newSuffix}`;
        const name2 = `${id}${newSuffix}`;
        const name3 = `${id}${currentLang}`;
        const name4 = `${id}`;

        const bannersType = [name1, name2, name3, name4];
        let frame: cc.SpriteFrame;
        for (const element of bannersType) {
            const gameConfiguration = getGameConfiguration(id);
            if (!!gameConfiguration?.remoteBundle && !MICRO_GAMES_NOT_OFFER_BANNER.includes(id)) {
                const directory = gameConfiguration.isMicrosite ? `${id}/` : "";
                const path = systemPath === "" ? `${directory}banners/${element}` : `${directory}banners/${systemPath}/${element}}`;
                try {
                    frame = await BundleManager.getInstance().loadAsset<cc.SpriteFrame>({
                        bundleId: id.toString(),
                        path: path,
                        type: cc.SpriteFrame
                    });
                } catch (error) {
                    frame = await this.getBannerSpriteFrame(id, element);
                }
            } else {
                frame = await this.getBannerSpriteFrame(id, element);
            }

            if (frame) {
                break;
            }
        }

        return frame;
    }

    public static getBannerSpriteFrame(gameId: number, imageName: string): Promise<cc.SpriteFrame> {
        return new Promise<cc.SpriteFrame>((resolve) => {
            cc.resources.load<cc.SpriteFrame>(`lobby/banner/textures/${gameId}/${imageName}`, cc.SpriteFrame, (err, spriteFrame) => {
                resolve(spriteFrame);
            });
        });
    }

    public static isMiniGame(gameId: string): boolean {
        const gameConfiguration = getGameConfiguration(gameId);
        return +gameId !== 0 && !!gameConfiguration?.mini;
    }

    public static calculateWinPercentage(originalChoices: string[], roundHistory: any) {
        const count = this.calculateWin(originalChoices, roundHistory);

        const choices = [...originalChoices].sort((a, b) => count[a] - count[b]);

        let total = 0;
        const percentage = {};
        choices.forEach((choice, index) => {
            const value = Math.floor((count[choice] * 100) / roundHistory.length);
            percentage[choice] = `${value}`;
            if (index === choices.length - 1) {
                percentage[choice] = `${100 - total}`;
            }

            total += value;
        });

        return percentage;
    }

    public static calculateWin(originalChoices: string[], roundHistory: any) {
        return roundHistory.reduce((count: any, history) => {
            originalChoices.forEach((choice) => {
                count[choice] = count[choice] ?? 0;
                if (history.settlementResult[choice]) {
                    count[choice] = count[choice] + 1;
                }
            });
            return count;
        }, {});
    }

    public static checkIntersectNodes(container: cc.Node, child: cc.Node) {
        const box = container.getBoundingBox();
        const pos = container.convertToWorldSpaceAR(cc.v2(0, 0));
        const srcBox = cc.rect(pos.x - box.width / 2, pos.y - box.height / 2, box.width, box.height);
        const destBox = child.getBoundingBoxToWorld();
        return srcBox.intersects(destBox);
    }

    public static createChipStack(bet: number, betChips: BetChips, shadowFrame: cc.SpriteFrame, skewX: number) {
        const values = GameUtils.getChipQuantity(bet, betChips.chipValues);
        const node = new cc.Node();
        const chipStack = node.addComponent(ChipStack);
        chipStack.chipSize = 26;
        chipStack.thickness = 10;
        chipStack.skewX = skewX;

        const keys = Object.keys(values).sort((a, b) => +b - +a);
        let firstChip = true;
        keys.forEach((chip) => {
            const count = values[chip];
            for (let i = 0; i < count; i++) {
                let chipNode: cc.Node;
                if (+chip === 0) {
                    chipNode = betChips.createLowValueChip();
                } else {
                    chipNode = betChips.createBigChip(+chip);
                }
                chipStack.addChip(chipNode);

                if (firstChip && i === 0) {
                    firstChip = false;
                    const shadow = new cc.Node();
                    shadow.addComponent(cc.Sprite).spriteFrame = shadowFrame;
                    chipNode.addChild(shadow);
                }
            }
        });
        return node;
    }

    public static setFontSizeLabelsInNode(node: cc.Node, isCustom = false, fontSize = 36) {
        let parentNode;
        node.getComponentsInChildren(cc.Label).forEach((label) => {
            const labelNode = label.node;
            if (!labelNode.getComponent(SetStaticFontSizeLabel)) {
                labelNode.scale = 0.535;
                label.fontSize = fontSize;
                label.lineHeight = fontSize + 4;
            }

            if (isCustom) {
                labelNode.color = cc.Color.BLACK.fromHEX("#ffe800");
                const labelFormat = labelNode.getComponent("LocalizedLabelWithFormat");
                if (labelFormat) {
                    labelFormat.format = FormationHandler.TITLE;
                    labelFormat.updateLabel();
                } else {
                    console.warn("Label doesnt has LocalizedLabelWithFormat: ", labelNode.name);
                }
            }
            if (parentNode !== labelNode.parent) {
                parentNode = labelNode.parent;
                const layout = parentNode.getComponent(cc.Layout);
                layout && (layout.affectedByScale = true);
            }
        });
    }

    public static updateSpineDuration(spine: sp.Skeleton, animationName: string, duration: number) {
        const original = spine.findAnimation(`${animationName}`).duration;
        spine.timeScale = original / duration;
    }

    public static setColorAndOpacity(color: string, node: cc.Node) {
        node.color = cc.Color.WHITE.fromHEX(color);
        node.opacity = cc.Color.WHITE.fromHEX(color).getA();
    }
}
