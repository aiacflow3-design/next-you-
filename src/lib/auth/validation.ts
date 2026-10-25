import { z } from 'zod';

export function isIranianPhone(val: string): boolean {
  const digits = val.replace(/\D/g, '');
  return /^0?9\d{9}$/.test(digits) || /^989\d{9}$/.test(digits);
}

export function isEmail(val: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
}

export function normalizeIdentifier(val: string): string {
  const trimmed = val.trim();
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (digitsOnly.length >= 10 && (digitsOnly.startsWith('09') || digitsOnly.startsWith('989') || digitsOnly.startsWith('9'))) {
    if (digitsOnly.startsWith('989')) {
      return '0' + digitsOnly.slice(2);
    }
    if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
      return '0' + digitsOnly;
    }
    return digitsOnly;
  }
  return trimmed.toLowerCase();
}

export const registerSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: 'ایمیل یا شماره موبایل الزامی است.' })
    .refine((val) => isEmail(val) || isIranianPhone(val), {
      message: 'لطفاً یک ایمیل معتبر یا شماره موبایل صحیح (مثلاً ۰۹۱۲۳۴۵۶۷۸۹) وارد کنید.',
    }),
  name: z.string().trim().optional(),
  password: z
    .string()
    .min(6, { message: 'رمز عبور باید حداقل ۶ کاراکتر باشد.' }),
});

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { message: 'ایمیل یا شماره موبایل الزامی است.' }),
  password: z.string().optional(),
  otpCode: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

