export const formatNumber = (number) => {
  return new Intl.NumberFormat("uz-UZ").format(number);
};
