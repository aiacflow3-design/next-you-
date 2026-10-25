import { actionReportRepository } from '../repositories/action-report.repository';
import {
  ActionReport,
  CreateActionReportDTO,
  UpdateActionReportDTO,
} from '../domain/action-report.entity';
import { userRepository } from '../repositories/user.repository';

export interface CreateReportResult {
  success: boolean;
  authenticated: boolean;
  report?: ActionReport;
  error?: string;
}

export interface GetReportsResult {
  success: boolean;
  authenticated: boolean;
  reports: ActionReport[];
  totalCount: number;
  error?: string;
}

export interface GetSingleReportResult {
  success: boolean;
  authenticated: boolean;
  report?: ActionReport | null;
  error?: string;
}

export interface MutateReportResult {
  success: boolean;
  authenticated: boolean;
  report?: ActionReport | null;
  error?: string;
}

export async function createActionReportUseCase(
  userId: string,
  dto: CreateActionReportDTO
): Promise<CreateReportResult> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return { success: false, authenticated: false, error: 'کاربر معتبر نیست.' };
  }

  if (!dto.actionId || typeof dto.actionId !== 'string') {
    return { success: false, authenticated: true, error: 'شناسه اقدام الزامی است.' };
  }

  const report = await actionReportRepository.create(userId, dto);
  return {
    success: true,
    authenticated: true,
    report,
  };
}

export async function getUserActionReportsUseCase(
  userId: string,
  limit?: number
): Promise<GetReportsResult> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return { success: false, authenticated: false, reports: [], totalCount: 0, error: 'کاربر معتبر نیست.' };
  }

  const reports = await actionReportRepository.findByUserId(userId, limit);
  return {
    success: true,
    authenticated: true,
    reports,
    totalCount: reports.length,
  };
}

export async function getActionReportByIdUseCase(
  userId: string,
  reportId: string
): Promise<GetSingleReportResult> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return { success: false, authenticated: false, error: 'کاربر معتبر نیست.' };
  }

  const report = await actionReportRepository.findById(reportId);
  if (!report || report.userId !== userId) {
    // Strictly block access if not owned by this user
    return { success: false, authenticated: true, report: null, error: 'گزارش مورد نظر یافت نشد.' };
  }

  return {
    success: true,
    authenticated: true,
    report,
  };
}

export async function updateActionReportUseCase(
  userId: string,
  reportId: string,
  dto: UpdateActionReportDTO
): Promise<MutateReportResult> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return { success: false, authenticated: false, error: 'کاربر معتبر نیست.' };
  }

  const existing = await actionReportRepository.findById(reportId);
  if (!existing || existing.userId !== userId) {
    return { success: false, authenticated: true, error: 'گزارش یافت نشد یا دسترسی مجاز نیست.' };
  }

  const updated = await actionReportRepository.update(reportId, userId, dto);
  return {
    success: true,
    authenticated: true,
    report: updated,
  };
}

export async function deleteActionReportUseCase(
  userId: string,
  reportId: string
): Promise<MutateReportResult> {
  const user = await userRepository.findById(userId);
  if (!user) {
    return { success: false, authenticated: false, error: 'کاربر معتبر نیست.' };
  }

  const existing = await actionReportRepository.findById(reportId);
  if (!existing || existing.userId !== userId) {
    return { success: false, authenticated: true, error: 'گزارش یافت نشد یا دسترسی مجاز نیست.' };
  }

  const deleted = await actionReportRepository.delete(reportId, userId);
  return {
    success: deleted,
    authenticated: true,
  };
}
