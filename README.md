# Feeling-Lucky-Wiki (Firefox Addon)

If you're anything like me, you've been using search engines to get to the first link for years. I cannot be bothered to type out @wikipedia or remember any other shortcuts. I just search something like "example wiki" and click the first link 99% of the time.

This Firefox addon redirects search queries in the URL bar through Google's 'I'm Feeling Lucky" function if the phrase contains the stand-alone word "wiki".

For instance:
"tree wiki" will redirect to https://en.wikipedia.org/wiki/Tree 
"intel arch wiki" will redirect to https://wiki.archlinux.org/title/intel_graphics

***NOTE***
This addon is **NOT** compatable with **ClearURLs** addon.
It also **MUST** be used in conjunction with the **Skip-Redirect** addon to avoid the Google interception warning. 
For Skip-Redirect, I use the Mode "Skip all redirects except for URLs matching any of the lines in the no-skip-urls-list".

https://addons.mozilla.org/en-US/firefox/addon/skip-redirect/



I don't like Google, but it's the fastest for this purpose. 

 The javascript injects the query into https://www.google.com/search?q=${encodedQuery}&btnI=I%27m+Feeling+Lucky, but I suppose if you edited that url, it should work for any other website. 

I have half a mind to do something like this for Reddit, but search engines are more straightforward to me than Reddit's search function for the time being.

This addon is 24 lines of simple javascript. I'm not a programmer by any means so I would appreciate anyone elses help making this prettier or more fully featured. I'd like it to borrow from Skip-Redirect's code so this stands alone, but for now it works for me.
