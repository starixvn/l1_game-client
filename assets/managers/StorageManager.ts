interface Storage {
    remove: (name: string) => void;
    get: (name: string) => any;
    set: (name: string, value: any, expiresDay?: number) => void;
    isAvailable: () => boolean;
}

class LocalStorage implements Storage {
    remove(name: string) {
        localStorage?.removeItem(name);
    }

    get(name: string) {
        let storage;
        try {
            storage = localStorage.getItem(name);
            if (storage === "") {
                return null;
            }
            return storage ? JSON.parse(storage) : null;
        } catch (error) {
            console.warn(`LocalStorage ${name} can not parse`);
            return storage ?? null;
        }
    }

    set(name: string, value: any) {
        localStorage?.setItem(name, JSON.stringify(value));
    }

    isAvailable() {
        const test = "test";
        try {
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            console.log("Browser not support Local Storage");
            return false;
        }
    }
}

declare global {
    interface Window {
        localMemory: any;
    }
}

class Memory implements Storage {
    localMemory: any;
    constructor() {
        window.localMemory = {};
        this.localMemory = window.localMemory;
    }
    remove(name: string) {
        delete this.localMemory[name];
    }

    get(name: string) {
        return this.localMemory[name] ? this.localMemory[name] : null;
    }

    set(name: string, value: any) {
        this.localMemory[name] = value;
    }

    isAvailable() {
        return true;
    }
}

class StorageManager {
    private static _storage: Storage;

    private static get storage() {
        if (!this._storage) {
            const storages = [new LocalStorage(), new Memory()];
            this._storage = storages.filter((storage) => storage.isAvailable())[0];
        }
        return this._storage;
    }

    static get(name: string) {
        return this.storage.get(name);
    }

    static set(name: string, value: any) {
        this.storage.set(name, value);
    }

    static remove(name: string) {
        this.storage.remove(name);
    }
}

export { StorageManager };
