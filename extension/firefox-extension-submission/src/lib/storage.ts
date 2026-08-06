/// <reference types="chrome" />

export interface PriceSnapshot {
  id: "latest";
  timestamp: number;
  prices: Record<string, number>;
}

export interface UserPreferences {
  id: string;
  defaultCurrency?: string;
  displayMode?: "bitcoin-only" | "dual-display";
  denomination?: "btc" | "sats" | "dynamic";
  highlightBitcoinValue?: boolean;
  disabledSites?: string[];
  darkMode?: boolean;
  themeMode?: "system" | "light" | "dark";
  saylorMode?: boolean;
  lastUpdated?: number;
}

const DATABASE_NAME = "PriceInSatsDB";
const DATABASE_VERSION = 2;
const PRICE_STORE = "priceSnapshots";
const PREFERENCES_STORE = "userPreferences";
const PREFERENCES_ID = "user-preferences";

function createDefaultPreferences(): UserPreferences {
  return {
    id: PREFERENCES_ID,
    defaultCurrency: "usd",
    displayMode: "dual-display",
    denomination: "dynamic",
    highlightBitcoinValue: false,
    disabledSites: [],
    darkMode: false,
    themeMode: "system",
    saylorMode: false,
    lastUpdated: Date.now(),
  };
}

class IndexedDBStorage {
  private connection: IDBDatabase | null = null;

  constructor(
    private readonly dbName = DATABASE_NAME,
    private readonly version = DATABASE_VERSION,
  ) {}

  open(): Promise<IDBDatabase> {
    if (this.connection) {
      return Promise.resolve(this.connection);
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = () => {
        const database = request.result;

        // Version 1 stored one record per currency using a timestamp-only key.
        // Those records collided when a batch shared the same millisecond, so the
        // migration intentionally removes the unused history and keeps one snapshot.
        if (database.objectStoreNames.contains("priceHistory")) {
          database.deleteObjectStore("priceHistory");
        }

        if (!database.objectStoreNames.contains(PRICE_STORE)) {
          database.createObjectStore(PRICE_STORE, { keyPath: "id" });
        }

        if (!database.objectStoreNames.contains(PREFERENCES_STORE)) {
          database.createObjectStore(PREFERENCES_STORE, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        this.connection = request.result;
        this.connection.onversionchange = () => this.close();
        resolve(this.connection);
      };

      request.onerror = () => reject(request.error ?? new Error("Unable to open local storage"));
      request.onblocked = () => reject(new Error("Local storage upgrade is blocked by another extension page"));
    });
  }

  close(): void {
    this.connection?.close();
    this.connection = null;
  }

  async get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    const database = await this.open();

    return new Promise((resolve, reject) => {
      const request = database.transaction(storeName, "readonly").objectStore(storeName).get(key);
      request.onsuccess = () => resolve(request.result as T | undefined);
      request.onerror = () => reject(request.error ?? new Error(`Unable to read ${storeName}`));
    });
  }

  async put<T>(storeName: string, value: T): Promise<IDBValidKey> {
    const database = await this.open();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeName, "readwrite");
      const request = transaction.objectStore(storeName).put(value);
      let key: IDBValidKey;

      request.onsuccess = () => {
        key = request.result;
      };
      transaction.oncomplete = () => resolve(key);
      transaction.onerror = () => reject(transaction.error ?? new Error(`Unable to write ${storeName}`));
      transaction.onabort = () => reject(transaction.error ?? new Error(`Writing ${storeName} was aborted`));
    });
  }

  async clearStores(storeNames: string[]): Promise<void> {
    const database = await this.open();

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(storeNames, "readwrite");
      for (const storeName of storeNames) {
        transaction.objectStore(storeName).clear();
      }
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error ?? new Error("Unable to clear local data"));
      transaction.onabort = () => reject(transaction.error ?? new Error("Clearing local data was aborted"));
    });
  }
}

const storage = new IndexedDBStorage();

const PriceDatabase = {
  db: storage,

  saveBitcoinPrices(prices: Record<string, number>, timestamp = Date.now()): Promise<IDBValidKey> {
    const snapshot: PriceSnapshot = {
      id: "latest",
      timestamp,
      prices: { ...prices },
    };

    return storage.put(PRICE_STORE, snapshot);
  },

  async getBitcoinPrices(): Promise<PriceSnapshot | null> {
    return (await storage.get<PriceSnapshot>(PRICE_STORE, "latest")) ?? null;
  },

  async savePreferences(preferences: Partial<UserPreferences>): Promise<IDBValidKey> {
    const existingPreferences = await storage.get<UserPreferences>(PREFERENCES_STORE, PREFERENCES_ID);
    const preferencesRecord: UserPreferences = {
      ...(existingPreferences ?? createDefaultPreferences()),
      ...preferences,
      id: PREFERENCES_ID,
      lastUpdated: Date.now(),
    };

    return storage.put(PREFERENCES_STORE, preferencesRecord);
  },

  async getPreferences(): Promise<UserPreferences> {
    try {
      const preferences = await storage.get<UserPreferences>(PREFERENCES_STORE, PREFERENCES_ID);
      if (preferences && typeof preferences === "object") {
        return preferences;
      }

      const defaultPreferences = createDefaultPreferences();
      await PriceDatabase.savePreferences(defaultPreferences);
      return defaultPreferences;
    } catch (error) {
      console.error("Unable to read local preferences:", error);
      return createDefaultPreferences();
    }
  },

  clearAllData(): Promise<void> {
    return storage.clearStores([PRICE_STORE, PREFERENCES_STORE]);
  },
};

export { IndexedDBStorage, PriceDatabase };
