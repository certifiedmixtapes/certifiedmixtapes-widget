const cmtzHostname = "dev.certifiedmixtapez.com"

const init = {
  headers: {
    "content-type": "application/json;charset=UTF-8",
  },
}

async function handleRequest(event) {
  let request = event.request
  const requestUrl = new URL(request.url)

  var hostname = requestUrl.hostname;
  var originalUrl = request.url;
  var url = originalUrl.replace(hostname, cmtzHostname);

  const newRequest = new Request(
    url,
    new Request(request),
  )

  const cacheKey = new Request(url, newRequest)
  const cache = caches.default


  let response = await cache.match(cacheKey)

  if (!response) {
    //If not in cache, get it from origin
    response = await fetch(newRequest)
    response = new Response(response.body, response)
    response.headers.append("Cache-Control", "max-age=600")
    event.waitUntil(cache.put(cacheKey, response.clone()))
  }
  
  const results = await gatherResponse(response)
  var newResponse = new Response(results, init)

  newResponse.headers.set("Access-Control-Allow-Origin", "*")

  newResponse.headers.append("Vary", "Origin")

  return newResponse;

}

async function gatherResponse(response) {
  const { headers } = response
  const contentType = headers.get("content-type") || ""
  if (contentType.includes("application/json")) {
    return JSON.stringify(await response.json())
  }
  else if (contentType.includes("application/text")) {
    return await response.text()
  }
  else if (contentType.includes("text/html")) {
    return await response.text()
  }
  else {
    return await response.text()
  }
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event))
})
