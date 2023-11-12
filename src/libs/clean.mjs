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

  // Target the main content of the document
  const mainContent = document.querySelector('main');
  if (!mainContent) {
    // Handle cases where there is no main tag
    console.error('No main content found in the document.');
    return;
  }

  // Process the main content as needed
  // For example, modify URLs in the main content
  const elements = mainContent.querySelectorAll('[src], [href], [srcset]');
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

  // Remove any 'script' or 'link' tags that do not contain CORE_URL from the main content
  mainContent.querySelectorAll('script[src], link[href][rel="stylesheet"]').forEach(el => {
    const url = el.getAttribute('src') || el.getAttribute('href');
    if (!containsCoreUrl(url)) {
      el.parentNode.removeChild(el);
    }
  });

  // Convert the main content back to a string
  return mainContent.outerHTML;
}

// Note: This function now focuses only on the <main> element of the HTML document.
// Adjust the querySelector as needed to target different parts of the document.
