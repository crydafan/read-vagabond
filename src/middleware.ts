import { defineMiddleware } from "astro:middleware";

// Cache everything. readbagabondo.com is a static site, so we can cache everything without worrying about dynamic content.
// This will significantly improve the performance of the site, especially for repeat visitors.
// We can also set different cache durations for different types of content (e.g., longer for chapter pages, shorter for the homepage).

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.request.method !== "GET") {
    return next();
  }

  const response = await next();

  if (response.status !== 200) {
    return response;
  }

  if (context.url.pathname === "/") {
    // 1 week
    response.headers.set(
      "Cache-Control",
      "public, max-age=604800, s-maxage=604800, stale-while-revalidate=604800",
    );
  } else if (context.url.pathname.includes("/chapter-")) {
    // 1 month
    response.headers.set(
      "Cache-Control",
      "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=31536000, immutable",
    );
  } else if (context.url.pathname.includes("/volume-")) {
    // 1 week
    response.headers.set(
      "Cache-Control",
      "public, max-age=604800, s-maxage=604800, stale-while-revalidate=2592000, immutable",
    );
  } else {
    // 1 week
    response.headers.set(
      "Cache-Control",
      "public, max-age=604800, s-maxage=604800, stale-while-revalidate=604800",
    );
  }

  return response;
});
