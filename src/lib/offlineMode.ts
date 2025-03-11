// Network status tracking
let isOffline = false;

// The timestamp of the last successful database connection
let lastSuccessfulConnection = 0;

// Detect if network is available
export async function checkNetworkStatus(): Promise<boolean> {
  try {
    // Simple test to see if we can connect to a known server
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 7000);

    const response = await fetch("https://www.google.com/favicon.ico", {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-store",
      mode: "no-cors",
    });

    clearTimeout(timeoutId);
    isOffline = !response.ok;
    return !isOffline;
  } catch (e) {
    isOffline = true;
    return false;
  }
}

// Function to safely generate a cache key
function generateCacheKey(dbQuery: Function, params?: any): string {
  try {
    // Create a base key from function name or toString
    const baseKey = dbQuery.name || dbQuery.toString().slice(0, 50);

    // Add params hash if available
    const paramsHash = params ? JSON.stringify(params).slice(0, 50) : "";

    return `cache_${baseKey}_${paramsHash}`;
  } catch (e) {
    // If anything fails, create a simpler key
    return `cache_${Math.random().toString(36).slice(2, 10)}`;
  }
}

// Get data from localStorage cache
function getFromCache<T>(cacheKey: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const cached = localStorage.getItem(cacheKey);
    if (!cached) return null;

    const { data, expire } = JSON.parse(cached);

    // Only use cache if it hasn't expired
    if (expire > Date.now()) {
      return data as T;
    }
    return null;
  } catch (e) {
    console.warn("Failed to retrieve from offline cache", e);
    return null;
  }
}

// Store data in localStorage cache
function storeInCache<T>(
  cacheKey: string,
  data: T,
  cacheDuration: number
): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
        expire: Date.now() + cacheDuration,
      })
    );
  } catch (e) {
    console.warn("Failed to store in offline cache", e);
  }
}

// Get cached data or try database query with fallback
export async function safeDbOperation<T>(
  dbQuery: () => Promise<T>,
  fallbackData: T,
  options: { cacheDuration?: number; forceFresh?: boolean; params?: any } = {}
): Promise<T> {
  const {
    cacheDuration = 60 * 60 * 1000, // 1 hour by default
    forceFresh = false,
    params = undefined,
  } = options;

  // Generate a cache key for this operation
  const cacheKey = generateCacheKey(dbQuery, params);

  // If it's been more than 30 seconds since the last successful connection,
  // or we're forcing fresh, or we don't know if we're offline yet
  const shouldTryFresh =
    forceFresh || !isOffline || Date.now() - lastSuccessfulConnection < 30000;

  if (shouldTryFresh) {
    try {
      // Use a reasonable timeout for the DB query
      const result = await Promise.race([
        dbQuery(),
        new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("Database query timeout")), 15000);
        }),
      ]);

      // If we got here, we're online and got a result
      isOffline = false;
      lastSuccessfulConnection = Date.now();

      // Store in localStorage for offline use
      storeInCache(cacheKey, result, cacheDuration);

      return result;
    } catch (error) {
      console.warn("Database query failed, trying cache", error);
      isOffline = true;

      // Try to get from cache
      const cachedData = getFromCache<T>(cacheKey);
      if (cachedData !== null) {
        console.log("Using cached data", cacheKey);
        return cachedData;
      }
    }
  } else {
    // We're offline, try cache first
    const cachedData = getFromCache<T>(cacheKey);
    if (cachedData !== null) {
      console.log("Using cached data (offline mode)", cacheKey);
      return cachedData;
    }
  }

  // If all else fails, use the fallback data
  console.log("Using fallback data", cacheKey);
  return fallbackData;
}
