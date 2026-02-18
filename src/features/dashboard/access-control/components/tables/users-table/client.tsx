'use client';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { DataTable } from '@/shared/components/ui/data-table';

import { getUsers } from '@/features/dashboard/access-control/api/user';

import { columns } from '@/features/dashboard/access-control/components/tables/users-table/columns';
import { Loading } from '@/shared/components/loading';

interface UserClientProps {
  searchTerm?: string;
}

export function UserClient({ searchTerm }: UserClientProps) {
  const [pagination, setPagination] = useState<{ pageIndex: number; pageSize: number }>({ pageIndex: 0, pageSize: 20 });

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', pagination, searchTerm],
    queryFn: () => getUsers(pagination, searchTerm || undefined),
  });

  return (
    <>
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <DataTable
          pagination={pagination}
          setPagination={setPagination}
          pageCount={users?.totalPages || 0}
          columns={columns}
          data={users?.content || []}
        />
      )}
    </>
  );
}
