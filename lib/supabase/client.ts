import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const remoteUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let cachedClient: SupabaseClient | null = null;

function supabaseUrl() {
  if (!remoteUrl) return "";
  if (typeof window === "undefined") return remoteUrl.replace(/\/$/, "");
  return new URL("/api/supabase", window.location.origin).toString().replace(/\/$/, "");
}

function requestParts(input: RequestInfo | URL, init?: RequestInit) {
  if (input instanceof Request) {
    const headers = new Headers(input.headers);
    if (init?.headers) new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    return {
      url: input.url,
      init: {
        method: init?.method ?? input.method,
        headers,
        body: init?.body ?? (["GET", "HEAD"].includes(input.method) ? undefined : input.body),
        signal: init?.signal ?? input.signal
      } satisfies RequestInit
    };
  }

  return { url: String(input), init: init ?? {} };
}

function xhrFetch(url: string, init: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    if (typeof XMLHttpRequest === "undefined") {
      reject(new TypeError("Failed to fetch"));
      return;
    }

    const xhr = new XMLHttpRequest();
    xhr.open(init.method ?? "GET", url);
    new Headers(init.headers).forEach((value, key) => {
      xhr.setRequestHeader(key, value);
    });
    xhr.onload = () => {
      resolve(
        new Response(xhr.responseText, {
          status: xhr.status,
          statusText: xhr.statusText
        })
      );
    };
    xhr.onerror = () => reject(new TypeError("Failed to fetch"));
    xhr.ontimeout = () => reject(new TypeError("Failed to fetch"));

    const body = init.body;
    if (body instanceof ReadableStream) {
      reject(new TypeError("Failed to fetch"));
      return;
    }
    xhr.send((body as XMLHttpRequestBodyInit | null | undefined) ?? null);
  });
}

function networkErrorResponse() {
  return new Response(
    JSON.stringify({
      message:
        "Cannot reach the farm database from this browser. Disable ad blockers on localhost (Poper Blocker is wrapping fetch), then refresh.",
      code: "NETWORK_ERROR"
    }),
    {
      status: 503,
      headers: { "Content-Type": "application/json" }
    }
  );
}

async function supabaseFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const { url, init: requestInit } = requestParts(input, init);

  try {
    return await fetch(url, requestInit);
  } catch {
    try {
      return await xhrFetch(url, requestInit);
    } catch {
      return networkErrorResponse();
    }
  }
}

export function getSupabaseClient() {
  if (!remoteUrl || !anonKey) {
    throw new Error(
      "Supabase environment variables are not set. Please define NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  if (!cachedClient) {
    cachedClient = createClient(supabaseUrl(), anonKey, {
      global: { fetch: supabaseFetch }
    });
  }

  return cachedClient;
}
