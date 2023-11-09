import { parseHTML } from 'linkedom';

export async function CleanMarkup(payload) {
  // Parse the HTML content with linkedom
  const { document } = parseHTML(payload);

  // Function to determine if a URL is absolute
  function isAbsolute(url) {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  // Iterate over all script and link elements and remove the non-relative ones
  const scriptsAndLinks = document.querySelectorAll('script[src], link[href]');
  scriptsAndLinks.forEach(el => {
    // Remove 'script' tags with absolute 'src'
    if (el.tagName === 'SCRIPT' && el.hasAttribute('src') && isAbsolute(el.getAttribute('src'))) {
      el.parentNode.removeChild(el);
    }

    // Remove 'link' tags with absolute 'href' (only for stylesheets)
    if (el.tagName === 'LINK' && el.hasAttribute('href') && isAbsolute(el.getAttribute('href')) && el.getAttribute('rel') === 'stylesheet') {
      el.parentNode.removeChild(el);
    }
  });

  // Iterate over all elements with 'src', 'href', and 'srcset' attributes to make URLs relative
  const elements = document.querySelectorAll('[src], [href], [srcset]');
  elements.forEach(el => {
    // Function to make a single URL relative and remove query strings
    function makeRelative(url) {
      let cleanUrl = url.startsWith('https://domartisan.com') ? url.replace('https://domartisan.com', '') : url;
      return cleanUrl.split('?')[0]; // Remove query parameters
    }

    // Function to make all URLs in a srcset attribute relative and remove query strings
    function makeSrcsetRelative(srcset) {
      return srcset
        .split(',')
        .map(part => {
          const [url, descriptor] = part.trim().split(' ');
          return `${makeRelative(url)} ${descriptor || ''}`.trim();
        })
        .join(', ');
    }

    // Replace 'src' if it's not relative and remove query strings
    if (el.hasAttribute('src')) {
      const src = el.getAttribute('src');
      if (!isAbsolute(src)) { // Only process relative URLs
        el.setAttribute('src', makeRelative(src));
      }
    }

    // Replace 'href' if it's not relative and remove query strings
    if (el.hasAttribute('href')) {
      const href = el.getAttribute('href');
      if (!isAbsolute(href)) { // Only process relative URLs
        el.setAttribute('href', makeRelative(href));
      }
    }

    // Replace 'srcset' if it's not relative and remove query strings
    if (el.hasAttribute('srcset')) {
      const srcset = el.getAttribute('srcset');
      el.setAttribute('srcset', makeSrcsetRelative(srcset));
    }
  });

  // Convert the document back to a string and remove any CORE_URL references and redundant query strings
  return document.toString()
    .split(import.meta.env.CORE_URL).join('') // Remove CORE_URL if it's part of any URLs
    .replace(/([?&]\w+=\w+)+/g, ''); // Remove query parameters
}
