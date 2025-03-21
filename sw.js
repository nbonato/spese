
const CACHE_VERSION = "v8";


self.addEventListener("install", event => {
    console.log("Service worker installed");
    // On installation, create a cache
    event.waitUntil(
        caches
            .open(CACHE_VERSION)
            .then((cache) =>
                cache.addAll([
                    "./",
                    "./index.html",
                    "./manifest.json",
                    "./icons/favicon.svg",
                    "./icons/icon-192x192.png",
                    "./icons/icon-512x512.png",
                    "./icons/icon.svg",
                    "./icons/maskable-icon.png",
                    "./scripts/app.js",
                    "./scripts/chart.min.js",
                    "./scripts/expenseList.js",
                    "./scripts/expenseTypesList.js",
                    "./scripts/manageExpense.js",
                    "./scripts/overviews.js",
                    "./scripts/storage.js",
                    "./styles/style.css"
                ]),
            ),
    );
});


// Activates only after the installation (once updated, the sw is re-installed)
self.addEventListener("activate", (event) => {
    console.log("Service worker activated");

    // Remove all cache versions different from the current
    event.waitUntil(
        caches.keys().then((keyList) =>
            Promise.all(
                keyList.map((key) => {
                    if (!CACHE_VERSION.includes(key)) {
                        return caches.delete(key);
                    }
                }),
            ),
        ),
    );
});


// Triggered by HTTP requests, this creates a cache
// containing each resource that's requested during execution
// It might be necessary to change caching strategy to cache
// resources that are not always requested
self.addEventListener("fetch", (event) => {
    event.respondWith(
      (async () => {
        const r = await caches.match(event.request);
        console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
        if (r) {
          return r;
        }
/*         const response = await fetch(event.request);
        const cache = await caches.open(CACHE_VERSION);
        console.log(`[Service Worker] Caching new resource: ${event.request.url}`);
        cache.put(event.request, response.clone());
        return response; */
      })(),
    );
  });

  
  
