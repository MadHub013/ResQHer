import AsyncStorage from "@react-native-async-storage/async-storage";

export async function readLocalValue<T>(key: string, fallback: T): Promise<T> {
  const value = await AsyncStorage.getItem(key);
  if (value === null) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch (error) {
    throw new Error(`Unable to read saved app data for "${key}".`, {
      cause: error,
    });
  }
}

export async function writeLocalValue<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}
