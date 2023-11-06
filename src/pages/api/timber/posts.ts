// Import the zod library to use for input validation
import { z } from "zod";

// Define a constant for the base URL to be used in API requests
const BASE = import.meta.env.API_URL;

// Define a schema to validate the arguments for the getPosts function
const GetPostsArgsSchema = z.object({
  extension: z.string(), // Require an extension property of type string
  params: z.object({}).optional(), // Optional params property of type object
  _fields: z.string().nullable().optional(), // Optional _fields property of type string, which can also be null
});

// Define an asynchronous function to get posts
export async function getPosts(args) {
  // Validate the input arguments against the GetPostsArgsSchema
  // If validation fails, zod will throw an error
  GetPostsArgsSchema.parse(args);

  // Create a copy of args.params to avoid modifying the original object
  const params = { ...args.params };

  // If args._fields is not null, add it to params
  if (args._fields !== null) {
    params._fields = args._fields;
  }

  // Convert params to a URL query string
  // The URLSearchParams constructor takes an object and converts it to a query string
  const queryString = new URLSearchParams(params).toString();

  // If queryString is truthy (i.e., not an empty string), prefix it with ?
  // This forms the query string to be appended to the URL
  const query = queryString ? `?${queryString}` : "";

  // Construct the URL for the API request
  // Concatenate the base URL, the extension from args, and the query string
  const url = `${BASE + args.extension + query}`;

  // Log the URL to the console for debugging purposes
  console.log("Fetching URL:", url);

  // Send an HTTP GET request to the constructed URL
  // Await the response before proceeding to the next line
  const response = await fetch(url);

  // Parse the response body as JSON
  // Await the result before proceeding to the next line
  const data = await response.json();

  // Return the parsed data from the function
  return data;
}

// Define a schema to validate the arguments for the getPostById function
const GetPostByIdArgsSchema = z.object({
  extension: z.string(), // Require an extension property of type string
  id: z.number(), // Require an id property of type number
});

// Define an asynchronous function to get a post by its ID
export async function getPostById(args) {
  // Validate the input arguments against the GetPostByIdArgsSchema
  // If validation fails, zod will throw an error
  GetPostByIdArgsSchema.parse(args);

  // Construct the URL for the API request
  // Concatenate the base URL, the extension from args, and the id from args
  const url = `${BASE + args.extension}/${args.id}`;

  // Log the URL to the console for debugging purposes
  console.log("Fetching URL:", url);

  // Send an HTTP GET request to the constructed URL
  // Await the response before proceeding to the next line
  const response = await fetch(url);

  // Parse the response body as JSON
  // Await the result before proceeding to the next line
  const data = await response.json();

  // Return the parsed data from the function
  return data;
}

// Define a schema to validate the arguments for the getPostBySlug function
const GetPostBySlugArgsSchema = z.object({
  extension: z.string(), // Require an extension property of type string
  slug: z.string(), // Require a slug property of type string
});

// Define an asynchronous function to get a post by slug
export async function getPostBySlug(args) {
  // Validate the input arguments against the GetPostBySlugArgsSchema
  // If validation fails, zod will throw an error
  GetPostBySlugArgsSchema.parse(args);

  // Construct the URL for the API request
  // Concatenate the base URL, the extension from args, and the slug
  const url = `${BASE + args.extension}?slug=${args.slug}`;

  // Log the URL to the console for debugging purposes
  console.log("Fetching URL:", url);

  // Send an HTTP GET request to the constructed URL
  // Await the response before proceeding to the next line
  const response = await fetch(url);

  // Parse the response body as JSON
  // Await the result before proceeding to the next line
  const data = await response.json();

  // If data is an array and has at least one element, return the first element
  // Otherwise, return null
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}
