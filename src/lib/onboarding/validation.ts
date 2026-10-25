import { z } from 'zod';

export const PRIMARY_GOAL_CHOICES = [
  'نظم شخصی',
  'تمرکز',
  'اعتمادبه‌نفس',
  'سلامت و تناسب اندام',
  'روابط و ارتباطات',
  'مسیر شغلی',
  'آرامش و ذهن',
  'هنوز مطمئن نیستم',
] as const;

export const MAIN_OBSTACLE_CHOICES = [
  'بی‌نظمی',
  'اهمال‌کاری',
  'حواس‌پرتی',
  'کمبود انرژی',
  'نداشتن مسیر مشخص',
  'ترس و تردید',
  'نداشتن استمرار',
  'نمی‌دانم',
] as const;

export const AVAILABLE_TIME_CHOICES = [
  'کمتر از ۱۰ دقیقه',
  '۱۰–۲۰ دقیقه',
  '۲۰–۳۰ دقیقه',
  '۳۰–۶۰ دقیقه',
  'بیشتر از یک ساعت',
] as const;

export const CONSISTENCY_PATTERN_CHOICES = [
  'شروع می‌کنم ولی ادامه نمی‌دهم',
  'خیلی خوب شروع می‌کنم',
  'زیاد فکر می‌کنم ولی شروع نمی‌کنم',
  'معمولاً استمرار دارم',
  'هنوز نمی‌دانم',
] as const;

export const DESIRED_SUPPORT_CHOICES = [
  'شناخت بهتر خودم',
  'ساختن عادت‌های بهتر',
  'پیدا کردن مسیر رشد',
  'داشتن برنامه و اقدام روزانه',
  'پیگیری پیشرفتم',
  'همه این‌ها',
] as const;

export const completeOnboardingSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'لطفاً نام خود را وارد کنید (حداقل ۲ نویسه).')
    .max(80, 'نام وارد شده طولانی است.'),
  primaryGoal: z
    .string()
    .trim()
    .min(1, 'لطفاً مهم‌ترین هدف مورد نظرتان را مشخص کنید.'),
  mainObstacle: z
    .string()
    .trim()
    .min(1, 'لطفاً مانع اصلی را انتخاب کنید.'),
  availableTime: z
    .string()
    .trim()
    .min(1, 'لطفاً زمان در دسترس روزانه را انتخاب کنید.'),
  consistencyPattern: z
    .string()
    .trim()
    .min(1, 'لطفاً الگوی استمرار خود را مشخص کنید.'),
  desiredSupport: z
    .string()
    .trim()
    .min(1, 'لطفاً نوع پشتیبانی مورد علاقه خود را انتخاب کنید.'),
  futureSelfVision: z
    .string()
    .trim()
    .min(2, 'لطفاً دیدگاه خود را برای ۶ ماه آینده بنویسید.')
    .max(1000, 'دیدگاه ثبت شده بیش از حد طولانی است.'),
});

export type CompleteOnboardingInput = z.infer<typeof completeOnboardingSchema>;
