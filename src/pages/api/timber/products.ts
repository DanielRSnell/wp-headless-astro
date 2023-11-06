import { z } from "zod";

const BASE = import.meta.env.API_URL;

// Define a schema for the arguments for getProducts
const GetProductsArgsSchema = z.object({
  extension: z.string(),
});

export async function getProducts(args) {
  GetProductsArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Define a schema for the arguments for getProductById
const GetProductByIdArgsSchema = z.object({
  extension: z.string(),
  id: z.number(),
});

export async function getProductById(args) {
  GetProductByIdArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}/${args.id}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Define a schema for the arguments for getProductsByCategoryId
const GetProductsByCategoryIdArgsSchema = z.object({
  extension: z.string(),
  category_id: z.number(),
});

export async function getProductsByCategoryId(args) {
  GetProductsByCategoryIdArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}?category=${args.category_id}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
