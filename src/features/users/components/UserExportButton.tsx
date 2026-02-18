'use client';

import { useCallback, useMemo } from 'react';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import type { UserReportData } from '@/features/users/types';
import {
  generateUserReportCSV,
  generateUserReportExcel,
  generateUserReportPDF,
} from '@/services/userReportsService';

interface UserExportButtonProps {
  userId: string;
  userData: UserReportData;
}

export default function UserExportButton({ userId, userData }: UserExportButtonProps) {
  const { toast } = useToast();

  const isDisabled = useMemo(() => {
    if (!userData) {
      return true;
    }

    return !userData.personalInfo?.id || !userData.personalInfo?.name;
  }, [userData]);

  const handleExport = useCallback(
    async (format: 'pdf' | 'excel' | 'csv') => {
      if (!userData) {
        toast({
          title: 'Dados indisponíveis',
          description: 'Não foi possível gerar o relatório deste corretor.',
          variant: 'destructive',
        });
        return;
      }

      try {
        if (format === 'pdf') {
          await generateUserReportPDF(userId);
        } else if (format === 'excel') {
          await generateUserReportExcel(userId);
        } else {
          await generateUserReportCSV(userId);
        }

        toast({
          title: 'Download iniciado',
          description: `Gerando relatório em formato ${format.toUpperCase()}.`,
        });
      } catch (error) {
        console.error(error);
      }
    },
    [toast, userData, userId],
  );

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <DropdownMenu>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2" disabled={isDisabled}>
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Baixar relatório do corretor
          </TooltipContent>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem className="cursor-pointer" onSelect={() => handleExport('pdf')}>
              PDF
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onSelect={() => handleExport('excel')}>
              Excel
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onSelect={() => handleExport('csv')}>
              CSV
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Tooltip>
    </TooltipProvider>
  );
}
