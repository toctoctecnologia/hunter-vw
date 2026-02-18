import { PaginationState } from '@tanstack/react-table';

import {
  LeadsReportData,
  LeadsReportFilters,
  LeadsReportSummaryData,
  PropertiesReportFilters,
  CatchersReportFilters,
  PropertyReportData,
  PropertyReportSummaryData,
  Record,
  CatcherReportData,
  ScheduleReportFilters,
  ScheduleReportData,
  ExportHistoryData,
  DistributionReportFilters,
  DistributionReportData,
} from '@/shared/types';

import { api } from '@/shared/lib/api';

export async function getLeadsReportData(pagination: PaginationState, leadsParams: LeadsReportFilters) {
  const { search, status, team, startDate, endDate } = leadsParams;
  const params = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ...(search && { search }),
    ...(status && { status }),
    ...(team && { team }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
  const { data } = await api.get<Record<LeadsReportData>>('dashboard/report/leads', { params });
  return data;
}

export async function getPropertiesReportData(pagination: PaginationState, propertiesParams: PropertiesReportFilters) {
  const { search, status, team, startDate, endDate } = propertiesParams;
  const params = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ...(search && { search }),
    ...(status && { status }),
    ...(team && { team }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data } = await api.get<Record<PropertyReportData>>('dashboard/report/properties', { params });
  return data;
}

export async function getCatchersReportData(pagination: PaginationState, catchersParams: CatchersReportFilters) {
  const { search, team, isActive } = catchersParams;

  const params = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    isActive: isActive.length === 0 ? null : isActive === '0' ? true : false,
    ...(search && { search }),
    ...(team && { team }),
  };

  const { data } = await api.get<Record<CatcherReportData>>('dashboard/report/catchers', { params });
  return data;
}

export async function getTasksReportData(pagination: PaginationState, scheduleParams: ScheduleReportFilters) {
  const { search, team, isCompleted, lead, startDate, endDate } = scheduleParams;

  const params = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    isCompleted: isCompleted.length === 0 ? null : isCompleted === '0' ? true : false,
    ...(lead && { lead }),
    ...(search && { search }),
    ...(team && { team }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data } = await api.get<Record<ScheduleReportData>>('dashboard/report/tasks', { params });
  return data;
}

export async function getDistributionReportData(
  pagination: PaginationState,
  distributionParams: DistributionReportFilters,
) {
  const { status, lead, user, queue, startDate, endDate } = distributionParams;
  const params = {
    page: pagination.pageIndex,
    size: pagination.pageSize,
    ...(status && { status }),
    ...(lead && { lead }),
    ...(user && { user }),
    ...(queue && { queue }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };

  const { data } = await api.get<Record<DistributionReportData>>('dashboard/report/distribution', { params });
  return data;
}

export async function getPropertiesReportSummaryData(propertiesParams: PropertiesReportFilters) {
  const { search, status, team, startDate, endDate } = propertiesParams;
  const params = {
    ...(search && { search }),
    ...(status && { status }),
    ...(team && { team }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
  const { data } = await api.get<PropertyReportSummaryData>('dashboard/report/properties/summary', { params });
  return data;
}

export async function getLeadsReportSummaryData(leadsParams: LeadsReportFilters) {
  const { search, status, team, startDate, endDate } = leadsParams;
  const params = {
    ...(search && { search }),
    ...(status && { status }),
    ...(team && { team }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  };
  const { data } = await api.get<LeadsReportSummaryData>('dashboard/report/leads/summary', { params });
  return data;
}

export async function newJobExportReport(reportType: string, columns: string[], filters: any, format: string) {
  const { data } = await api.post('dashboard/report/jobs', {
    reportType,
    columns,
    filters,
    format,
  });
  return data;
}

export async function getReportExportJobs(pagination: PaginationState) {
  const params = { page: pagination.pageIndex, size: pagination.pageSize };
  const { data } = await api.get<Record<ExportHistoryData>>('dashboard/report/jobs', { params });
  return data;
}

export async function downloadReport(jobId: string) {
  const { data } = await api.get<string>(`dashboard/report/jobs/${jobId}/download-url`);
  return data;
}
