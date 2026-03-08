import { z } from "zod";

export const createInstitutionSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().optional(),
  phone: z.string().min(6, { message: "Phone must be at least 6 characters" }),
  location: z.string().optional(),
  address: z.string().min(1, "Location of institution is required"),
  openingTime: z.string().optional(),
  closingTime: z.string().optional(),
  websiteUrl: z
    .string()
    .url({ message: "Invalid URL format" })
    .optional()
    .or(z.literal("")),
  clientType: z
    .enum(["INSTITUTION", "ESTATE", "NGOs", "INDUSTRY"])
    .default("INSTITUTION"),
});

export type CreateInstitutionDto = z.infer<typeof createInstitutionSchema>;
