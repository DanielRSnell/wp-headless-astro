export async function GET({ params, request }) {
     const { slug } = params;
    
     // get the pathname and search from request
    const { pathname, search } = new URL(request.url);

    const url = import.meta.env.CORE_URL + pathname + search;

    // Fetch the content from the CORE_URL
    const response = await fetch(url);

    // Get the content type from the response
    const contentType = response.headers.get('content-type');

    // Create a new response with the content from CORE_URL and Cache headers
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=3200',
      },
    });

    // Return the response
    return newResponse;
}
