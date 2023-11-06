// utils/argsUtil.js
import { z } from "zod";

// Define a Zod schema for the arguments
const ArgsSchema = z.object({
  post_type: z.string(),
  params: z.object({
    per_page: z.number(),
    page: z.number(),
  }),
  _fields: z.string().optional(),
  extension: z.string().optional(),
});

export function ValidManyQuery(args) {
  // Build Dynamic Args with the extension property
  const updatedArgs = {
    ...args,
    extension: `${args.post_type}`,
  };

  // Validate updatedArgs against the schema
  const validatedArgs = ArgsSchema.parse(updatedArgs);

  return validatedArgs;
}
