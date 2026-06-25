export const documentTypesData = {
  cpf: {
    placeholder: '___.___.___-__',
    length: 11,
    formattedLength: 14,
    format(value) {
      let valueFormatted = value.replace(/\D/g, '');
      valueFormatted = valueFormatted.replace(/(\d{3})(\d)/, '$1.$2');
      valueFormatted = valueFormatted.replace(/(\d{3})(\d)/, '$1.$2');
      valueFormatted = valueFormatted.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
      return valueFormatted;
    }
  },
  cnpj: {
    placeholder: '__.___.___/____-__',
    length: 14,
    formattedLength: 18,
    format(value) {
      let valueFormatted = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
      valueFormatted = valueFormatted.replace(/^([A-Z0-9]{2})([A-Z0-9])/i, '$1.$2');
      valueFormatted = valueFormatted.replace(/^([A-Z0-9]{2})\.([A-Z0-9]{3})([A-Z0-9])/i, '$1.$2.$3');
      valueFormatted = valueFormatted.replace(/\.([A-Z0-9]{3})([A-Z0-9])/i, '.$1/$2');
      valueFormatted = valueFormatted.replace(/([A-Z0-9]{4})(\d)/i, '$1-$2');
      return valueFormatted;
    },
  },
};

export function isAlphanumericCnpj(value) {
  const cnpj = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();

  if (cnpj.length !== 14) return false;
  if (/^(.)\1+$/.test(cnpj)) return false;
  if (!/^\d$/.test(cnpj[12]) || !/^\d$/.test(cnpj[13])) return false;

  const charToNum = c => (/\d/.test(c) ? parseInt(c, 10) : c.charCodeAt(0) - 55);

  const calcDigit = (str, weights) => {
    const sum = str.split('').reduce((acc, c, i) => acc + charToNum(c) * weights[i], 0);
    const rem = sum % 11;
    return rem < 2 ? 0 : 11 - rem;
  };

  const d1 = calcDigit(cnpj.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (d1 !== parseInt(cnpj[12], 10)) return false;

  const d2 = calcDigit(cnpj.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return d2 === parseInt(cnpj[13], 10);
}
