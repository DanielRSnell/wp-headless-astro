import { parseHTML } from 'linkedom';

export async function CleanMarkup(payload) {
  // Parse the HTML content with linkedom
  const { document } = parseHTML(payload);

  // Function to determine if a URL is absolute and does not contain the PROP_NAME
  function isNonRelativeAndExcludable(url) {
    return (url.startsWith('http://') || url.startsWith('https://')) &&
           !url.includes(import.meta.env.PROP_NAME);
  }

  // Iterate over all script and link elements and remove the non-relative ones that don't contain PROP_NAME
  const scriptsAndLinks = document.querySelectorAll('script[src], link[href]');
  scriptsAndLinks.forEach(el => {
    // Remove 'script' tags with non-relative 'src' that don't contain PROP_NAME
    if (el.tagName === 'SCRIPT' && el.hasAttribute('src') &&
        isNonRelativeAndExcludable(el.getAttribute('src'))) {
      el.parentNode.removeChild(el);
    }

    // Remove 'link' tags with non-relative 'href' that don't contain PROP_NAME (only for stylesheets)
    if (el.tagName === 'LINK' && el.hasAttribute('href') &&
        isNonRelativeAndExcludable(el.getAttribute('href')) && el.getAttribute('rel') === 'stylesheet') {
      el.parentNode.removeChild(el);
    }
  });

  // Function to make a single URL relative and remove query strings
  function makeRelative(url) {
    let cleanUrl = url.startsWith(import.meta.env.CORE_URL) ? url.replace(import.meta.env.CORE_URL, '') : url;
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

  // Iterate over all elements with 'src', 'href', and 'srcset' attributes to make URLs relative
  const elements = document.querySelectorAll('[src], [href], [srcset]');
  elements.forEach(el => {
    // Replace 'src' if it's not relative, doesn't contain PROP_NAME, and remove query strings
    if (el.hasAttribute('src')) {
      const src = el.getAttribute('src');
      if (!src.includes(import.meta.env.PROP_NAME)) {
        el.setAttribute('src', makeRelative(src));
      }
    }

    // Replace 'href' if it's not relative, doesn't contain PROP_NAME, and remove query strings
    if (el.hasAttribute('href')) {
      const href = el.getAttribute('href');
      if (!href.includes(import.meta.env.PROP_NAME)) {
        el.setAttribute('href', makeRelative(href));
      }
    }

    // Replace 'srcset' if it's not relative and remove query strings
    if (el.hasAttribute('srcset')) {
      const srcset = el.getAttribute('srcset');
      el.setAttribute('srcset', makeSrcsetRelative(srcset));
    }
  });

  // Convert the document back to a string and remove any redundant query strings
  return document.toString()
    .replace(/([?&]\w+=\w+)+/g, ''); // Remove query parameters
}

// Ensure that PROP_NAME is defined in the environment where this code runs.
// import.meta.env.PROP_NAME should be replaced with the actual value if necessary.
