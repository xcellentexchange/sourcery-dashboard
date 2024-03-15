export const useFormatter = {
  currency: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
  number: (val) => new Intl.NumberFormat('en-US').format(val),
}
