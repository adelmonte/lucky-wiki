// Track redirects to avoid loops
let redirected = {};

// Listen for messages from content script
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.action === 'redirect' && sender.tab) {
    const tabId = sender.tab.id;
    
    // Prevent redirect loops
    if (redirected[tabId]) {
      delete redirected[tabId];
      return;
    }
    
    // Mark this tab for redirection
    redirected[tabId] = true;
    
    // Perform the redirect
    browser.tabs.update(tabId, { url: message.url });
  }
});

// Handle redirect notices from Google
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Check if this is a Google redirect URL
    if (details.url.includes('google.com/url') && 
        details.url.includes('?q=')) {
      
      // Get the destination URL from the q parameter
      const url = new URL(details.url);
      const redirectTarget = url.searchParams.get('q');
      
      if (redirectTarget) {
        return { redirectUrl: redirectTarget };
      }
    }
    return {};
  },
  { urls: ["*://*.google.com/url?*"] },
  ["blocking"]
);

// Clean up redirected object when tabs are closed
browser.tabs.onRemoved.addListener(function(tabId) {
  if (tabId in redirected) {
    delete redirected[tabId];
  }
});

// Listen for navigation to handle popup page behaviors
browser.webNavigation.onCommitted.addListener(function(details) {
  // Check if navigation is a Google Search
  if (details.url.includes('/search') && details.tabId) {
    // Reset any existing redirect flags to avoid lockouts
    delete redirected[details.tabId];
  }
});