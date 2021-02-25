import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";
import "reflect-metadata";
import ChipConfig from "./common/bet-chips/view-models/ChipConfig";
import SocketIOController from "./SocketIOController";

export class Application {
    constructor(public readonly container = new Container()) {}

    startup() {
        this.configureServices();
    }

    configureServices() {
        this.container.bind<SocketIOController>(SocketIOController).toSelf().inSingletonScope();
        this.container.bind<ChipConfig>(ChipConfig).toSelf().inSingletonScope();
    }
}

const app = new Application();
app.startup();

const { lazyInject } = getDecorators(app.container);
const appContainer = app.container;
export { lazyInject, appContainer };
