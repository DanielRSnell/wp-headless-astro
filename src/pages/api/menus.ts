// Import the zod library to use for input validation
import { z } from "zod";

// Define a constant for the base URL to be used in API requests
const BASE = import.meta.env.API_URL;

// Define a schema to validate the arguments for getting all menus
const GetAllMenusArgsSchema = z.object({
  extension: z.literal("/menus/v1/menus"), // The extension is fixed for this endpoint
});

// Define an asynchronous function to get all menus
export async function getMenus() {
  // Validate the extension against the GetAllMenusArgsSchema
  GetAllMenusArgsSchema.parse({ extension: "/menus/v1/menus" });

  // Construct the URL for the API request
  const url = `${BASE}/menus/v1/menus`;

  // Log the URL to the console for debugging purposes
  console.log("Fetching URL:", url);

  // Send an HTTP GET request to the constructed URL
  const response = await fetch(url);

  // Parse the response body as JSON
  const menus = await response.json();

  // Return the parsed data from the function
  return menus;
}

// Define a schema to validate the arguments for getting a specific menu by slug
const GetMenuBySlugArgsSchema = z.object({
  slug: z.string(), // Require a slug property of type string
});

// Define an asynchronous function to get a specific menu by slug
export async function getMenuBySlug(args: { slug: string }) {
  // Validate the input arguments against the GetMenuBySlugArgsSchema
  GetMenuBySlugArgsSchema.parse(args);

  // Construct the URL for the API request
  const url = `${BASE}/menus/v1/menus/${args.slug}`;

  // Log the URL to the console for debugging purposes
  console.log("Fetching URL:", url);

  // Send an HTTP GET request to the constructed URL
  const response = await fetch(url);

  console.log(response);

  // Parse the response body as JSON
  const menu = await response.json();

  // Return the parsed data from the function
  return menu;
}

// You can continue to define more functions for other endpoints such as:
// getMenuLocations, getMenuLocationBySlug, etc., following the same format.

// Be sure to export all the functions so they can be imported elsewhere
export default {
  getMenus,
  getMenuBySlug,
  // other functions...
};
