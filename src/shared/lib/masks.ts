export const normalizePhoneNumber = (value: string | undefined, withCountryCode = false) => {
  if (!value) return '';

  const cleaned = value.replace(/\D/g, '');

  if (withCountryCode) {
    return cleaned
      .replace(/(\d{2})(\d{2})(\d)/, '+$1 ($2) $3')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})(\d+?)/, '$1');
  }

  return cleaned
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .replace(/(-\d{4})(\d+?)/, '$1');
};

export const normalizeCnpjNumber = (value: string | undefined) => {
  if (!value) return '';

  return value
    .replace(/[\D]/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .replace(/(-\d{2})\d+?$/, '$1');
};

export const normalizeCpfNumber = (value: string | undefined) => {
  if (!value) return '';

  return value
    .replace(/[\D]/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{2})$/, '$1-$2');
};

export const normalizeBirthDate = (value: string | undefined) => {
  if (!value) return '';

  return value
    .replace(/[\D]/g, '')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{4})\d+?$/, '$1');
};

export const normalizeCepNumber = (value: string | undefined) => {
  if (!value) return '';
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{5})(\d{3})+?$/, '$1-$2')
    .replace(/(-\d{3})(\d+?)/, '$1');
};

export const removeNonNumeric = (value: string | undefined) => {
  if (!value) return '';
  return value.replace(/\D/g, '');
};

export const formatPriceForBackend = (price: string) => {
  return parseFloat(price.replace(/[^\d,]/g, '').replace(',', '.'));
};

export const formatBackendDate = (dateString: string) => {
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

export const normalizeDateTimeInput = (value: string | undefined) => {
  if (!value) return '';

  const cleaned = value.replace(/\D/g, '');

  return cleaned
    .replace(/(\d{2})(\d)/, '$1/$2') // DD/
    .replace(/(\d{2})\/(\d{2})(\d)/, '$1/$2/$3') // DD/MM/
    .replace(/(\d{2})\/(\d{2})\/(\d{4})(\d)/, '$1/$2/$3 $4') // DD/MM/YYYY
    .replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2})(\d)/, '$1/$2/$3 $4:$5') // DD/MM/YYYY HH:
    .replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})\d+?$/, '$1/$2/$3 $4:$5'); // DD/MM/YYYY HH:MM
};

export const parseDateTimeToISO = (dateTimeString: string): string => {
  // Converte DD/MM/YYYY HH:MM para ISO format
  const match = dateTimeString.match(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})/);

  if (!match) return '';

  const [, day, month, year, hour, minute] = match;
  return new Date(`${year}-${month}-${day}T${hour}:${minute}:00`).toISOString();
};

export const formatISOToDateTime = (isoString: string): string => {
  // Converte ISO format para DD/MM/YYYY HH:MM
  if (!isoString) return '';

  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hour}:${minute}`;
};
