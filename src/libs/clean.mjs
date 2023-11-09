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
    if ((el.tagName === 'SCRIPT' or el.tagName === 'LINK') && !containsCoreUrl(el.getAttribute('src') || el.getAttribute('href'))) {
      el.parentNode.removeChild(el);
    }
  });

  // Iterate over remaining elements and modify the URLs
  const elements = document.querySelectorAll('[src], [href], [srcset]');
  elements.forEach(el => {
    if (el.hasAttribute('src') && containsCoreUrl(el.getAttribute('src'))) {
      el.setAttribute('src', makeRelative(el.getAttribute('src')));
    }
    if (el.hasAttribute('href') && containsCoreUrl(el.getAttribute('href'))) {
      el.setAttribute('href', makeRelative(el.getAttribute('href')));
    }
    if (el.hasAttribute('srcset')) {
      el.setAttribute('srcset', makeSrcsetRelative(el.getAttribute('srcset')));
    }
  });

  // Set type="text/partytown" for all absolute script tags and add defer to all script tags in the body
  const scriptTags = document.body.querySelectorAll('script');
  scriptTags.forEach(script => {
    if (script.hasAttribute('src')) {
      if (isAbsolute(script.getAttribute('src'))) {
        script.setAttribute('type', 'text/partytown');
      }
      script.setAttribute('defer', '');
    }
  });

  // Convert the document back to a string and remove any redundant query strings
  return document.body.toString().replace(/([?&]\w+=\w+)+/g, '').split(import.meta.env.CORE_URL).join('');
}
