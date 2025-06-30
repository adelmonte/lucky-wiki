// This script runs in the context of the search page
(function() {
  console.log("Wiki Search Detector loaded");
  
  // Function to get query parameter from URL
  function getQueryParam(url, param) {
    const searchParams = new URLSearchParams(new URL(url).search);
    return searchParams.get(param);
  }
  
  // Function to check if query contains standalone "wiki"
  function containsStandaloneWiki(query) {
    if (!query) return false;
    const regex = /\bwiki\b/i;
    return regex.test(query);
  }
  
  // Monitor for URL changes
  let lastUrl = location.href;
  
  // Function to process the current URL and redirect if needed
  function processUrl() {
    const currentUrl = location.href;
    
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
    
    // Check if query contains standalone "wiki" OR if we're searching from address bar
    if (query && (containsStandaloneWiki(query) || 
        document.querySelector('input[name="q"]')?.value?.toLowerCase()?.includes('wiki'))) {
      
      console.log("Wiki detected, redirecting...");
      
      // Get the actual search term including wiki
      let searchTerm = query;
      const searchInput = document.querySelector('input[name="q"]');
      if (searchInput && searchInput.value && searchInput.value.toLowerCase().includes('wiki')) {
        searchTerm = searchInput.value;
      }
      
      // If "wiki" isn't in the search term, add it
      if (!searchTerm.toLowerCase().includes('wiki')) {
        searchTerm = searchTerm + ' wiki';
      }
      
      // Use Google's I'm Feeling Lucky directly
      const encodedQuery = encodeURIComponent(searchTerm);
      const redirectUrl = `https://www.google.com/search?q=${encodedQuery}&btnI=1`;
      
      // Notify the background script to perform the redirect
      browser.runtime.sendMessage({
        action: 'redirect',
        url: redirectUrl
      });
    }
  }
  
  processUrl();
  document.addEventListener('DOMContentLoaded', processUrl);
  
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
  
  window.addEventListener('popstate', processUrl);
  
  const observer = new MutationObserver(function(mutations) {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        if (location.href !== lastUrl) {
          processUrl();
        }
      }
    }
  });
  
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