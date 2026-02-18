const DIGITS_ONLY = /\D+/g;

export const digitsOnly = (value: string) => value.replace(DIGITS_ONLY, '');

const allDigitsEqual = (value: string) => /^([0-9])\1*$/.test(value);

const calculateCpfCheckDigit = (digits: string, factor: number) => {
  let total = 0;
  for (let i = 0; i < digits.length; i += 1) {
    total += Number.parseInt(digits[i]!, 10) * (factor - i);
  }
  const remainder = (total * 10) % 11;
  return remainder === 10 ? 0 : remainder;
};

export const isValidCPF = (input: string) => {
  const cpf = digitsOnly(input);
  if (cpf.length !== 11) return false;
  if (allDigitsEqual(cpf)) return false;

  const firstNine = cpf.slice(0, 9);
  const firstCheck = calculateCpfCheckDigit(firstNine, 10);
  if (firstCheck !== Number.parseInt(cpf[9]!, 10)) return false;

  const firstTen = cpf.slice(0, 10);
  const secondCheck = calculateCpfCheckDigit(firstTen, 11);
  return secondCheck === Number.parseInt(cpf[10]!, 10);
};

const calculateCnpjCheckDigit = (digits: string) => {
  const multipliers = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  let total = 0;
  let multiplierIndex = multipliers.length - digits.length;
  for (let i = 0; i < digits.length; i += 1) {
    total += Number.parseInt(digits[i]!, 10) * multipliers[multiplierIndex]!;
    multiplierIndex += 1;
  }
  const remainder = total % 11;
  return remainder < 2 ? 0 : 11 - remainder;
};

export const isValidCNPJ = (input: string) => {
  const cnpj = digitsOnly(input);
  if (cnpj.length !== 14) return false;
  if (allDigitsEqual(cnpj)) return false;

  const firstTwelve = cnpj.slice(0, 12);
  const firstCheck = calculateCnpjCheckDigit(firstTwelve);
  if (firstCheck !== Number.parseInt(cnpj[12]!, 10)) return false;

  const firstThirteen = cnpj.slice(0, 13);
  const secondCheck = calculateCnpjCheckDigit(firstThirteen);
  return secondCheck === Number.parseInt(cnpj[13]!, 10);
};

export const formatCPF = (input: string) => {
  const cpf = digitsOnly(input).slice(0, 11);
  if (cpf.length <= 3) return cpf;
  if (cpf.length <= 6) return `${cpf.slice(0, 3)}.${cpf.slice(3)}`;
  if (cpf.length <= 9) return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6)}`;
  return `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;
};

export const formatCNPJ = (input: string) => {
  const cnpj = digitsOnly(input).slice(0, 14);
  if (cnpj.length <= 2) return cnpj;
  if (cnpj.length <= 5) return `${cnpj.slice(0, 2)}.${cnpj.slice(2)}`;
  if (cnpj.length <= 8) return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5)}`;
  if (cnpj.length <= 12) {
    return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8)}`;
  }
  return `${cnpj.slice(0, 2)}.${cnpj.slice(2, 5)}.${cnpj.slice(5, 8)}/${cnpj.slice(8, 12)}-${cnpj.slice(12)}`;
};

export const formatDocument = (input: string) => {
  const value = digitsOnly(input);
  if (value.length <= 11) {
    return formatCPF(value);
  }
  return formatCNPJ(value);
};
