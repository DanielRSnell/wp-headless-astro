import { parseHTML } from 'linkedom';

export async function CleanMarkup(payload) {
  // Parse the HTML content with linkedom
  const { document } = parseHTML(payload);

  // Function to check if a URL is absolute
  function isAbsolute(url) {
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
  }

  // Function to check if URL contains the CORE_URL
  function containsCoreUrl(url) {
    return url.includes(import.meta.env.CORE_URL);
  }

  // Function to make a single URL relative and remove query strings
  function makeRelative(url) {
    let cleanUrl = containsCoreUrl(url) ? url.replace(import.meta.env.CORE_URL, '') : url;
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

  // Remove any 'script' or 'link' tags that do not contain CORE_URL
  document.querySelectorAll('script[src], link[href][rel="stylesheet"]').forEach(el => {
    if ((el.tagName === 'SCRIPT' || el.tagName === 'LINK') && !containsCoreUrl(el.getAttribute('src') || el.getAttribute('href'))) {
      el.parentNode.removeChild(el);
    }
  });

  // Iterate over remaining elements and modify the URLs
  const elements = document.querySelectorAll('[src], [href], [srcset]');
  elements.forEach(el => {
    // Replace 'src' if it contains CORE_URL and remove query strings
    if (el.hasAttribute('src') && containsCoreUrl(el.getAttribute('src'))) {
      const src = el.getAttribute('src');
      el.setAttribute('src', makeRelative(src));
    }

    // Replace 'href' if it contains CORE_URL and remove query strings
    if (el.hasAttribute('href') && containsCoreUrl(el.getAttribute('href'))) {
      const href = el.getAttribute('href');
      el.setAttribute('href', makeRelative(href));
    }

    // Replace 'srcset' if it contains CORE_URL and remove query strings
    if (el.hasAttribute('srcset')) {
      const srcset = el.getAttribute('srcset');
      el.setAttribute('srcset', makeSrcsetRelative(srcset));
    }
  });

  // After processing the elements, set type="text/partytown" for all absolute script tags
  const scriptTags = document.querySelectorAll('script[src]');
  scriptTags.forEach(script => {
    if (isAbsolute(script.getAttribute('src'))) {
      script.setAttribute('type', 'text/partytown');
    }
  });

  // Convert the document back to a string and remove any redundant query strings
  return document.body.toString().replace(/([?&]\w+=\w+)+/g, '').split(import.meta.env.CORE_URL).join('');
}

// Ensure that this code runs in an environment where import.meta.env.CORE_URL is set.
