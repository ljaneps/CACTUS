export function sortOptions(options) {
  const order = ["A", "B", "C", "D"]; // orden deseado
  return [...options].sort(
    (a, b) => order.indexOf(a.value) - order.indexOf(b.value)
  );
}
