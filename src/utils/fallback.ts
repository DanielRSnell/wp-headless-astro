import { z } from "zod";

// Define a schema for the options object
const OptionsSchema = z.object({
  featured_image: z.string(),
  // Add other options here as needed
});

// Create a TypeScript type from the schema
type Options = z.infer<typeof OptionsSchema>;

// Define your options using the TypeScript type
const options: Options = {
  featured_image: "https://via.placeholder.com/150",
  // Initialize other options here
};

// Define a schema for the keys of the options object
const KeySchema = z.enum(["featured_image"]); // Include other keys as needed
type Key = z.infer<typeof KeySchema>;

// Function to get the value for a given key or return null if the key is not found
export const fallbacks = (key: Key): string | null => {
  // Validate the key
  const validatedKey = KeySchema.safeParse(key);

  if (!validatedKey.success) {
    throw new Error(`The key "${key}" is not a valid option.`);
  }

  // Check if the validated key exists in the options object
  if (key in options) {
    // If it does, return the value
    return options[key];
  }
  // If the key does not exist, return null
  return null;
};

// Usage:
// try {
//   const featuredImage = fallbacks('featured_image'); // Returns 'https://via.placeholder.com/150'
//   const nonExistingOption = fallbacks('non_existing_key'); // Throws an error
// } catch (error) {
//   console.error(error);
// }
