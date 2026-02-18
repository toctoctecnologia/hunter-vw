import React from 'react';
import { useParams } from 'react-router-dom';
import UserDetailPage from '@/app/(admin)/usuarios/[userId]/page';

interface Props {
  params?: { userId: string };
}

export default function UserDetailPageWrapper({ params }: Props) {
  const { id } = useParams<{ id: string }>();
  const userId = params?.userId ?? id ?? '';
  return <UserDetailPage params={{ userId }} />;
}

