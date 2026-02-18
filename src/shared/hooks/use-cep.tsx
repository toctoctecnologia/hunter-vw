import axios from 'axios';
import React from 'react';

interface CEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  estado: string;
  regiao: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

interface CEPDataResponse extends CEPResponse {
  error: boolean;
}

export function useCEP() {
  const handleGetCEPData = React.useCallback(async (cepValue: string) => {
    let data = {
      cep: '',
      logradouro: '',
      complemento: '',
      unidade: '',
      bairro: '',
      localidade: '',
      uf: '',
      estado: '',
      regiao: '',
      ibge: '',
      gia: '',
      ddd: '',
      siafi: '',
      error: false,
    } as CEPDataResponse;

    try {
      const response = await axios.get<CEPResponse>(`https://viacep.com.br/ws/${cepValue}/json/`);
      data = {
        ...response.data,
        error: false,
      };
    } catch {
      data = {
        ...data,
        error: true,
      };
    }

    return data;
  }, []);

  return { handleGetCEPData };
}
