'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  user: {
    id: string;
    name: string;
    role?: string;
    email?: string;
    phone?: string;
    admissionDate?: string;
    city?: string;
    uf?: string;
    cpf?: string;
    cep?: string;
    avatar?: string;
    company?: string;
    active: boolean;
  };
}

export default function UserProfileHeader({ user }: Props) {
  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2);

  const admission = user.admissionDate
    ? format(new Date(user.admissionDate), 'dd/MM/yyyy', { locale: ptBR })
    : null;

  return (
    <div className="rounded-2xl border bg-background p-6 shadow-sm">
      <div className="flex items-start gap-6">
        <Avatar className="h-32 w-32">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="text-2xl font-semibold">{initials}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{user.name}</h2>
              <Badge variant={user.active ? "success" : "secondary"}>
                {user.active ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            <p className="text-muted-foreground">{user.role} | {user.company || 'Imobiliária A'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground">Nome completo</span>
                <div className="font-medium">{user.name}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Email</span>
                <div className="font-medium">{user.email}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Telefone</span>
                <div className="font-medium">{user.phone}</div>
              </div>
              
              {user.cpf && (
                <div>
                  <span className="text-muted-foreground">CPF/CNPJ</span>
                  <div className="font-medium">{user.cpf}</div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-muted-foreground">Início na plataforma</span>
                <div className="font-medium">{admission || 'Não informado'}</div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Imobiliária vinculada</span>
                <div className="font-medium underline cursor-pointer hover:text-primary">
                  {user.company || 'Imobiliária A'}
                </div>
              </div>
              
              {user.cep && (
                <div>
                  <span className="text-muted-foreground">CEP</span>
                  <div className="font-medium">{user.cep}</div>
                </div>
              )}
              
              <div>
                <span className="text-muted-foreground">Cidade - Estado</span>
                <div className="font-medium">
                  {user.city && user.uf ? `${user.city} - ${user.uf}` : 'Não informado'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}