import "reflect-metadata";

import axios from "axios";
import { BundleManager } from "bundle-management";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import { initialize } from "./configs/GameConfigurations";
import SocketIOController from "./SocketIOController";

export class Application {
    constructor(public readonly container = new Container()) {}

    startup() {
        this.configureServices();
        this.loadGameConfigurations();
    }

    configureServices() {
        this.container.bind<SocketIOController>(SocketIOController).toSelf().inSingletonScope();
    }

    loadGameConfigurations() {
        initialize();
    }
}

BundleManager.initialize({
    adapters: {
        assetManager: () => cc.assetManager,
        http: () => ({
            get: (url: string) => axios.get(url).then((res) => res.data)
        })
    },
    listeners: []
});

const app = new Application();
app.startup();

const { lazyInject } = getDecorators(app.container);
const appContainer = app.container;
export { lazyInject, appContainer };

declare global {
    interface Window {
        reCheckInId: any;
        modules: any;
    }
}
