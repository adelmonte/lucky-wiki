// This script runs in the context of the search page
(function() {
  // Run at document_start to intercept before page loads
  console.log("Wiki Search Detector loaded");
  
  // Function to get query parameter from URL
  function getQueryParam(url, param) {
    const searchParams = new URLSearchParams(new URL(url).search);
    return searchParams.get(param);
  }
  
  // Function to check if query contains standalone "wiki"
  function containsStandaloneWiki(query) {
    if (!query) return false;
    
    // Check if "wiki" is a standalone word
    const regex = /\bwiki\b/i;
    return regex.test(query);
  }
  
  // Monitor for URL changes (especially for SPA behavior)
  let lastUrl = location.href;
  
  // Function to process the current URL and redirect if needed
  function processUrl() {
    const currentUrl = location.href;
    
    // Don't process the same URL twice
    if (currentUrl === lastUrl && document.readyState !== 'loading') return;
    lastUrl = currentUrl;
    
    // Get search query from various search engines
    let query = null;
    
    if (currentUrl.includes('google.com')) {
      query = getQueryParam(currentUrl, 'q');
    } else if (currentUrl.includes('bing.com')) {
      query = getQueryParam(currentUrl, 'q');
    } else if (currentUrl.includes('duckduckgo.com')) {
      query = getQueryParam(currentUrl, 'q') || getQueryParam(currentUrl, 'p');
    }
    
    console.log("Current query:", query);
    
    // Check if query contains standalone "wiki"
    if (query && containsStandaloneWiki(query)) {
      console.log("Wiki detected in query, redirecting...");
      
      // Create the "I'm Feeling Lucky" URL
      const encodedQuery = encodeURIComponent(query);
      
      // Use DuckDuckGo's bang syntax for direct redirection
      const redirectUrl = `https://duckduckgo.com/?q=!+${encodedQuery}`;
      
      // Notify the background script to perform the redirect
      browser.runtime.sendMessage({
        action: 'redirect',
        url: redirectUrl
      });
    }
  }
  
  // Process URL when page is loading
  processUrl();
  
  // Also process when DOM content is loaded (for late changes)
  document.addEventListener('DOMContentLoaded', processUrl);
  
  // Modern SPA sites might use history API to change the URL without a full page load
  const pushState = history.pushState;
  history.pushState = function() {
    pushState.apply(history, arguments);
    processUrl();
  };
  
  const replaceState = history.replaceState;
  history.replaceState = function() {
    replaceState.apply(history, arguments);
    processUrl();
  };
  
  // Handle back/forward navigation
  window.addEventListener('popstate', processUrl);
  
  // For Google's search-as-you-type behavior
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        // URL may have changed via AJAX, check again
        if (location.href !== lastUrl) {
          processUrl();
        }
      }
    }
  });
  
  // Start observing once the document body is available
  if (document.body) {
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['href']
    });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      observer.observe(document.body, { 
        childList: true, 
        subtree: true,
        attributes: true,
        attributeFilter: ['href']
      });
    });
  }
})();