import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { PriceDatabase } from "./storage";

function deleteDatabase(): Promise<void> {
  PriceDatabase.db.close();
  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase("PriceInSatsDB");
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Test database deletion was blocked"));
  });
}

beforeEach(deleteDatabase);

describe("PriceDatabase", () => {
  it("migrates the collision-prone history store to a single snapshot store", async () => {
    const legacyDatabase = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("PriceInSatsDB", 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore("priceHistory", { keyPath: "timestamp" });
        request.result.createObjectStore("userPreferences", { keyPath: "id" });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    legacyDatabase.close();

    const upgradedDatabase = await PriceDatabase.db.open();

    expect(upgradedDatabase.version).toBe(2);
    expect(upgradedDatabase.objectStoreNames.contains("priceHistory")).toBe(false);
    expect(upgradedDatabase.objectStoreNames.contains("priceSnapshots")).toBe(true);
  });

  it("stores a complete snapshot atomically when batches share a timestamp", async () => {
    await PriceDatabase.saveBitcoinPrices({ usd: 100_000, eur: 90_000 }, 1_000);
    await PriceDatabase.saveBitcoinPrices({ usd: 101_000, eur: 91_000 }, 1_000);

    await expect(PriceDatabase.getBitcoinPrices()).resolves.toEqual({
      id: "latest",
      timestamp: 1_000,
      prices: { usd: 101_000, eur: 91_000 },
    });
  });

  it("clears the cached snapshot and resets preferences", async () => {
    await PriceDatabase.saveBitcoinPrices({ usd: 100_000 });
    await PriceDatabase.savePreferences({ disabledSites: ["example.com"], themeMode: "dark" });

    await PriceDatabase.clearAllData();

    await expect(PriceDatabase.getBitcoinPrices()).resolves.toBeNull();
    await expect(PriceDatabase.getPreferences()).resolves.toMatchObject({
      id: "user-preferences",
      disabledSites: [],
      themeMode: "system",
    });
  });
});
