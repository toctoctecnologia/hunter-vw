import { httpJSON } from '@/lib/http';
import type { ImovelMedia } from '@/types/imovel';

export async function getImovelById(id: string) {
  // Simulated API call returning mock data for property update form
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        status: 'Vago/Disponível',
        valores: {
          venda: '',
          valorAnterior: '',
          condominio: '',
          iptuMensal: '',
          iptuAnual: '',
          rentabilidade: '',
          comissaoVenda: '',
          valorSobConsulta: false,
        },
        dados: {
          codigo: '1771',
          codigoAuxiliar: '',
          destinacao: 'Residencial',
          situacao: 'Vago/Disponível',
          finalidade: 'Venda',
          tipoImovel: 'Apartamento',
          segundoTipo: '',
          localChaves: 'Proprietário',
          identificadorChaves: '',
          numChaves: '',
          numControles: '',
          construtora: 'Grupo Pavoni',
          edificio: 'Olímpia Tower',
          condominio: 'Olímpia Residence - Centro',
          idade: '0 ano(s)',
          horarioVisita: '',
          identificadorImovel: '',
          placaFaixa: 'Placa não autoriza',
        },
        conteudoSeo: {
          tituloAnuncio:
            'Apartamento 4 suítes no Olímpia Tower em Balneário Camboriú',
          descricao:
            'Descubra o que é viver com conforto próximo do mar e das melhores lojas em Balneário Camboriú:\n\n- 163,39m²\n- 4 suítes\n- 3 vagas\n- Living integrado\n- Sacada com churrasqueira à carvão\n- R. 1451, 1 - Centro, Balneário Camboriú - SC',
          metaDescription:
            'Descubra o Olímpia Residence com um apartamento de 4 quartos no Centro de Balneário Camboriú. Conforto e exclusividade. Saiba mais!',
        },
        pessoas: {
          proprietarios: [{ nome: 'Natali', porcentagem: 100 }],
          captadores: [
            {
              captador: 'Daniel Capelani Custodio',
              porcentagem: 100,
              indicadoPor: '',
              principal: true,
            },
          ],
        },
        medias: [],
        updates: [],
        situacao: {
          tipo: 'vago' as const,
          dataLiberacao: '',
          observacao: '',
        },
      });
    }, 500);
  });
}

export async function updateImovelStatusMeta(id: string, status: string, meta: any) {
  return httpJSON(`/imoveis/${id}/status-meta`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status, meta }),
  });
}

export async function updateImovelMediaSeo(
  propertyId: string,
  mediaId: string,
  seo: NonNullable<ImovelMedia['seo']>,
) {
  // Mock API call to persist SEO information for a media item
  return new Promise(resolve => {
    setTimeout(() => {
      console.info('Mock SEO update', { propertyId, mediaId, seo });
      resolve({ success: true, mediaId, seo });
    }, 600);
  });
}
