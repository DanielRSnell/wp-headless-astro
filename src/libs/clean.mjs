import { parseHTML } from 'linkedom';

export async function CleanMarkup(payload) {
  // Parse the HTML content with linkedom
  const { document } = parseHTML(payload);

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

  // Iterate over all elements and modify the URLs
  const elements = document.querySelectorAll('[src], [href], [srcset], script');
  elements.forEach(el => {
    // Replace 'src' if it's not relative and remove query strings
    if (el.hasAttribute('src')) {
      const src = el.getAttribute('src');
      el.setAttribute('src', makeRelative(src));
    }

    // Replace 'href' if it's not relative and remove query strings
    if (el.hasAttribute('href')) {
      const href = el.getAttribute('href');
      el.setAttribute('href', makeRelative(href));
    }

    // Replace 'srcset' if it's not relative and remove query strings
    if (el.hasAttribute('srcset')) {
      const srcset = el.getAttribute('srcset');
      el.setAttribute('srcset', makeSrcsetRelative(srcset));
    }

    // For 'script' elements, add type="text/partytown" if the source is not relative
    if (el.tagName === 'SCRIPT' && el.hasAttribute('src') && !el.getAttribute('src').startsWith('/')) {
      el.setAttribute('type', 'text/partytown');
    }
  });

  // Convert the document back to a string
  return document.toString().split(import.meta.env.CORE_URL).join('').replace(/([?&]\w+=\w+)+/g, '');
}
