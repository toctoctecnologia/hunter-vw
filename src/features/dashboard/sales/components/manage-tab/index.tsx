'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import {
  getConversionMetrics,
  getPerformanceMetrics,
  getQualificationTimeMetrics,
} from '@/features/dashboard/sales/api/lead-manage';

import { ContactTimeQualification } from '@/features/dashboard/sales/components/manage-tab/contact-time-qualification';
import { ConversionChannels } from '@/features/dashboard/sales/components/manage-tab/conversion-channels';
import { Metrics } from '@/features/dashboard/sales/components/manage-tab/metrics';
import { Filters } from '@/features/dashboard/sales/components/manage-tab/filters';
import { ErrorCard } from '@/shared/components/error-card';
import { Loading } from '@/shared/components/loading';

export function ManageTab() {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState((currentDate.getMonth() + 1).toString().padStart(2, '0'));
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear().toString());

  const month = parseInt(selectedMonth, 10);
  const year = parseInt(selectedYear, 10);

  const {
    data: performanceData,
    isLoading: isLoadingPerformance,
    error: performanceError,
  } = useQuery({
    queryKey: ['performance-metrics', month, year],
    queryFn: () => getPerformanceMetrics(month, year),
  });

  const {
    data: conversionData,
    isLoading: isLoadingConversion,
    error: conversionError,
  } = useQuery({
    queryKey: ['conversion-metrics', month, year],
    queryFn: () => getConversionMetrics(month, year),
  });

  const {
    data: qualificationData,
    isLoading: isLoadingQualification,
    error: qualificationError,
  } = useQuery({
    queryKey: ['qualification-metrics', month, year],
    queryFn: () => getQualificationTimeMetrics(month, year),
  });

  const isLoading = isLoadingPerformance || isLoadingConversion || isLoadingQualification;
  const hasError = performanceError || conversionError || qualificationError;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Filters
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <Loading />
      </div>
    );
  }

  if (hasError || !performanceData || !conversionData || !qualificationData) {
    return (
      <div className="space-y-4">
        <Filters
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
        />
        <ErrorCard error={hasError} title="Erro ao carregar métricas de gestão" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Filters
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      <Metrics data={performanceData} />
      <ConversionChannels channels={conversionData} />
      <ContactTimeQualification qualifications={qualificationData} />
    </div>
  );
}
