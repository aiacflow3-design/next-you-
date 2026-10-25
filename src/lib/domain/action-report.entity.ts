export interface ActionReportImage {
  id: string;
  reportId: string;
  imageUrl: string;
  createdAt: string;
}

export interface ActionReport {
  id: string;
  userId: string;
  actionId: string;
  pathSlug: string;
  stageOrder: number;
  actionTitle: string;
  text: string;
  images: ActionReportImage[];
  createdAt: string;
  updatedAt: string;
  // Computed display helpers
  dateLabel?: string;
  timeLabel?: string;
  pathTitle?: string;
  stageTitle?: string;
}

export interface CreateActionReportDTO {
  actionId: string;
  text?: string;
  images?: string[];
  pathSlug?: string;
  stageOrder?: number;
  actionTitle?: string;
}

export interface UpdateActionReportDTO {
  text?: string;
  images?: string[];
}
