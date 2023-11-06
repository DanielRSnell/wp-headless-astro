import { z } from "zod";

const BASE = import.meta.env.API_URL;

// Define a schema for the arguments for getUsers
const GetUsersArgsSchema = z.object({
  extension: z.string(),
});

export async function getUsers(args) {
  GetUsersArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

// Define a schema for the arguments for getUserById
const GetUserByIdArgsSchema = z.object({
  extension: z.string(),
  id: z.number(),
});

export async function getUserById(args) {
  GetUserByIdArgsSchema.parse(args); // Validate the input
  const url = `${BASE + args.extension}/${args.id}`;
  console.log("Fetching URL:", url); // Log the URL for debugging
  const response = await fetch(url);
  const data = await response.json();
  return data;
}
