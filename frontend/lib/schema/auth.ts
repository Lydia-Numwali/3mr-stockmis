import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(3, { message: "First name must be at least 3 characters" })
      .optional(),
    lastName: z
      .string()
      .min(3, { message: "Last name must be at least 3 characters" })
      .optional(),
    email: z.string().email({ message: "Invalid email address" }),
    country: z
      .string()
      .min(2, { message: "Invalid country code" })
      .max(30, { message: "Invalid country code" }),
    nationalId: z.string().optional(),
    passportNumber: z.string().optional(),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      if (data.passportNumber) {
        return !!data.firstName && !!data.lastName;
      }
      return true;
    },
    {
      message:
        "First name and Last name are required when Passport Number is provided",
      path: ["firstName"], // attach to one field, or you can duplicate for both
    }
  )
  // Rwanda-specific case
  .refine(
    (data) => {
      if (data.country.toLowerCase() === "rwanda") {
        return !!data.nationalId;
      }
      return true;
    },
    {
      message: "Rwanda users must provide National ID",
      path: ["nationalId"],
    }
  );

export const verifyEmailSchema = z.object({
  otp: z.string().min(6, { message: "OTP must be at least 6 characters long" }),
});

export const twoFactorAuthenticationSchema = z.object({
  otp: z.string().length(6, {
    message: "The OTP must be exactly 6 digits.",
  }),
});

export const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email format" }),
});
export const newPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
