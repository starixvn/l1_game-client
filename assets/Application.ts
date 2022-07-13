import "reflect-metadata";

import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

import SocketIOController from "./SocketIOController";
import { BundleManager } from "bundle-management";
import axios from "axios";
import { modules } from "./ClientModules";

export class Application {
    constructor(public readonly container = new Container()) {}

    startup() {
        this.configureServices();
    }

    configureServices() {
        this.container.bind<SocketIOController>(SocketIOController).toSelf().inSingletonScope();
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

window.modules = modules;
console.log("load client modules", window.modules);
