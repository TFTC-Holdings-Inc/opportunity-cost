/// <reference types="chrome" />

import browser from "webextension-polyfill";

/**
 * Price-in-Sats Chrome Extension
 *
 * This module handles data storage for the extension using both Chrome Storage API
 * and IndexedDB for more complex data storage needs.
 */

// Type definitions
export interface PriceRecord {
  timestamp: number;
  currency: string;
  price: number;
  date: string;
}

export interface UserPreferences {
  id: string;
  defaultCurrency?: string;
  displayMode?: "bitcoin-only" | "dual-display";
  denomination?: "btc" | "sats" | "dynamic";
  highlightBitcoinValue?: boolean;
  disabledSites?: string[]; // Array of hostnames where the extension is disabled
  darkMode?: boolean; // Flag for dark mode (deprecated, kept for backward compatibility)
  themeMode?: "system" | "light" | "dark"; // New theme mode preference
  saylorMode?: boolean; // Saylor Mode - shows future prices at $21M BTC
  lastUpdated?: number;
}

// ==========================================
// Chrome Storage API Implementation
// ==========================================

/**
 * Chrome Storage API wrapper for simpler, key-value data storage
 * Good for user preferences, settings, and small amounts of data
 */
const BrowserStorage = {
  // Save data to Chrome storage
  save: <T>(key: string, value: T) => {
    return browser.storage.local.set({ [key]: value });
  },

  // Get data from Chrome storage
  get: async <T>(key: string) => {
    const result = await browser.storage.local.get(key);
    return result?.[key] as T;
  },

  // Remove data from Chrome storage
  remove: (key: string) => {
    return browser.storage.local.remove(key);
  },

  // Clear all data from Chrome storage
  clear: () => {
    return browser.storage.local.clear();
  },
};

// ==========================================
// IndexedDB Implementation
// ==========================================

/**
 * IndexedDB wrapper for more complex data storage
 * Good for storing large amounts of data, historical prices, etc.
 */
class IndexedDBStorage {
  dbName: string;
  version: number;
  db: IDBDatabase | null;

  constructor(dbName?: string, version?: number) {
    this.dbName = dbName || "PriceInSatsDB";
    this.version = version || 1;
    this.db = null;
  }

  // Open the database connection
  open(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (this.db) {
        resolve(this.db);
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores if they don't exist
        if (!db.objectStoreNames.contains("priceHistory")) {
          const priceStore = db.createObjectStore("priceHistory", {
            keyPath: "timestamp",
          });
          priceStore.createIndex("currency", "currency", { unique: false });
        }

        if (!db.objectStoreNames.contains("userPreferences")) {
          db.createObjectStore("userPreferences", { keyPath: "id" });
        }
      };

      request.onsuccess = (event: Event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event: Event) => {
        console.error("IndexedDB open error:", (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  }

  // Close the database connection
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }

  // Add an item to a store
  add<T>(storeName: string, item: T): Promise<IDBValidKey> {
    return this.open().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.add(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event: Event) => {
          console.error(`Error adding item to ${storeName}:`, (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  // Put (add or update) an item in a store
  put<T>(storeName: string, item: T): Promise<IDBValidKey> {
    return this.open().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.put(item);

        request.onsuccess = () => resolve(request.result);
        request.onerror = (event: Event) => {
          console.error(`Error putting item to ${storeName}:`, (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  // Get an item from a store
  get<T>(storeName: string, key: IDBValidKey): Promise<T | undefined> {
    return this.open().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.get(key);

        request.onsuccess = () => resolve(request.result as T);
        request.onerror = (event: Event) => {
          console.error(`Error getting item from ${storeName}:`, (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  // Get all items from a store
  getAll<T>(storeName: string): Promise<T[]> {
    return this.open().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = (event: Event) => {
          console.error(`Error getting all items from ${storeName}:`, (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  // Delete an item from a store
  delete(storeName: string, key: IDBValidKey): Promise<void> {
    return this.open().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);

        request.onsuccess = () => resolve();
        request.onerror = (event: Event) => {
          console.error(`Error deleting item from ${storeName}:`, (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };
      });
    });
  }

  // Clear all items from a store
  clear(storeName: string): Promise<void> {
    return this.open().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readwrite");
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = (event: Event) => {
          const target = event.target as IDBRequest;
          console.error(`Error clearing store ${storeName}:`, target?.error);
          reject(target?.error);
        };
      });
    });
  }

  // Query items using an index
  getByIndex<T>(storeName: string, indexName: string, value: IDBValidKey): Promise<T[]> {
    return this.open().then((db) => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, "readonly");
        const store = transaction.objectStore(storeName);
        const index = store.index(indexName);
        const request = index.getAll(value);

        request.onsuccess = () => resolve(request.result as T[]);
        request.onerror = (event: Event) => {
          const target = event.target as IDBRequest;
          console.error(`Error querying ${storeName} by ${indexName}:`, target?.error);
          reject(target?.error);
        };
      });
    });
  }
}

// ==========================================
// Price History-specific functions
// ==========================================

/**
 * Specialized database functions for the Price-in-Sats extension
 */
const PriceDatabase = {
  db: new IndexedDBStorage("PriceInSatsDB", 1),

  // Save a new Bitcoin price record
  saveBitcoinPrice: (currency: string, price: number): Promise<IDBValidKey> => {
    const priceRecord: PriceRecord = {
      timestamp: Date.now(),
      currency: currency.toLowerCase(),
      price: price,
      date: new Date().toISOString(),
    };

    return PriceDatabase.db.put("priceHistory", priceRecord);
  },

  // Get the most recent Bitcoin price for a currency
  getLatestBitcoinPrice: (currency: string): Promise<PriceRecord | null> => {
    return PriceDatabase.db.open().then((db) => {
      return new Promise<PriceRecord | null>((resolve, reject) => {
        const transaction = db.transaction("priceHistory", "readonly");
        const store = transaction.objectStore("priceHistory");
        const index = store.index("currency");
        const range = IDBKeyRange.only(currency.toLowerCase());

        // Open a cursor in reverse order to get the most recent entry
        const request = index.openCursor(range, "prev");

        request.onsuccess = (event: Event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            resolve(cursor.value as PriceRecord);
          } else {
            resolve(null); // No price found for this currency
          }
        };

        request.onerror = (event: Event) => {
          const target = event.target as IDBRequest;
          console.error("Error getting latest price:", target?.error);
          reject(target?.error);
        };
      });
    });
  },

  // Get price history for a currency within a date range
  getPriceHistory: (currency: string, startTime: number, endTime: number): Promise<PriceRecord[]> => {
    return PriceDatabase.db.open().then((db) => {
      return new Promise<PriceRecord[]>((resolve, reject) => {
        const transaction = db.transaction("priceHistory", "readonly");
        const store = transaction.objectStore("priceHistory");
        const index = store.index("currency");

        const currencyValue = currency.toLowerCase();
        const range = IDBKeyRange.only(currencyValue);

        const results: PriceRecord[] = [];
        const request = index.openCursor(range);

        request.onsuccess = (event: Event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const record = cursor.value as PriceRecord;
            if ((!startTime || record.timestamp >= startTime) && (!endTime || record.timestamp <= endTime)) {
              results.push(record);
            }
            cursor.continue();
          } else {
            resolve(results);
          }
        };

        request.onerror = (event: Event) => {
          const target = event.target as IDBRequest;
          console.error("Error getting price history:", target?.error);
          reject(target?.error);
        };
      });
    });
  },

  // Save user preferences
  savePreferences: (preferences: Partial<UserPreferences>): Promise<IDBValidKey> => {
    return new Promise((resolve, reject) => {
      // First get existing preferences
      PriceDatabase.db
        .get<UserPreferences>("userPreferences", "user-preferences")
        .then((existingPrefs) => {
          const basePrefs = existingPrefs || {
            id: "user-preferences",
            defaultCurrency: "usd",
            displayMode: "dual-display",
            denomination: "btc",
          };

          // Merge existing with new preferences
          const prefsRecord: UserPreferences = {
            ...basePrefs,
            ...preferences,
            id: "user-preferences", // Ensure ID is always set
            lastUpdated: Date.now(),
          };

          return PriceDatabase.db.put("userPreferences", prefsRecord);
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // Get user preferences
  getPreferences: (): Promise<UserPreferences> => {
    return new Promise((resolve) => {
      PriceDatabase.db
        .get<UserPreferences>("userPreferences", "user-preferences")
        .then((prefs) => {
          // Check if we got valid preferences
          if (prefs && typeof prefs === "object") {
            resolve(prefs);
          } else {
            // Create default preferences
            const defaultPrefs: UserPreferences = {
              id: "user-preferences",
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

            // Try to save these defaults
            PriceDatabase.savePreferences(defaultPrefs)
              .then(() => {
                resolve(defaultPrefs);
              })
              .catch((saveError) => {
                console.error("Failed to save default preferences:", saveError);
                // Still resolve with the defaults even if we couldn't save them
                resolve(defaultPrefs);
              });
          }
        })
        .catch((error) => {
          console.error("Error retrieving preferences from IndexedDB:", error);
          // Create and return default preferences on error
          const defaultPrefs: UserPreferences = {
            id: "user-preferences",
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
          resolve(defaultPrefs);
        });
    });
  },
};

// Export the storage objects
export { BrowserStorage, IndexedDBStorage, PriceDatabase };
