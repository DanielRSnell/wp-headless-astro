import { z } from "zod";

const BASE = import.meta.env.API_URL;

// Define a schema for the arguments for getTerms
const GetTermsArgsSchema = z.object({
  extension: z.string(),
});

export async function getTerms(args) {
  GetTermsArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Define a schema for the arguments for getTermsById
const GetTermsByIdArgsSchema = z.object({
  extension: z.string(),
  id: z.number(),
});

export async function getTermsById(args) {
  GetTermsByIdArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}/${args.id}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Define a schema for the arguments for getTermsByPostId
const GetTermsByPostIdArgsSchema = z.object({
  extension: z.string(),
  post_id: z.number(),
});

export async function getTermsByPostId(args) {
  GetTermsByPostIdArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}?post=${args.post_id}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
