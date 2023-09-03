let redirectUrls = {};

browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = new URL(details.url);
    const query = url.searchParams.get("q");
    const tabId = details.tabId;

    // Check if the word "wiki" is standing alone in the query string
    const regex = /\bwiki\b/i;
    const isStandaloneWiki = regex.test(query);
    
    if (isStandaloneWiki && !(tabId in redirectUrls)) {
      const encodedQuery = encodeURIComponent(query);
      const redirectUrl = `https://www.google.com/search?q=${encodedQuery}&btnI=I%27m+Feeling+Lucky`;
      redirectUrls[tabId] = redirectUrl;
      return { redirectUrl: redirectUrl };
    }
    
    delete redirectUrls[tabId];
  },
  { urls: ["<all_urls>"], types: ["main_frame"] },
  ["blocking"]
);
