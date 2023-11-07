import { z } from "zod";

const BASE = import.meta.env.API_URL;

// Define a schema for the arguments for getPosts
const GetPostsArgsSchema = z.object({
  extension: z.string(),
});

export async function getPosts(args) {
  GetPostsArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Define a schema for the arguments for getPostById
const GetPostByIdArgsSchema = z.object({
  extension: z.string(),
  id: z.number(),
});

export async function getPostById(args) {
  GetPostByIdArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}/${args.id}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
