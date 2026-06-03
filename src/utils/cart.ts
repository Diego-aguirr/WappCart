export type CartItem = {
  name: string;
  price: number;
  quantity: number;
};

export function calcularTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function agregarItem(
  items: CartItem[],
  nuevo: CartItem
): CartItem[] {
  const existe = items.find((item) => item.name === nuevo.name);

  if (existe) {
    return items.map((item) =>
      item.name === nuevo.name
        ? { ...item, quantity: item.quantity + nuevo.quantity }
        : item
    );
  }

  return [...items, nuevo];
}

export function quitarItem(
  items: CartItem[],
  nombre: string
): CartItem[] {
  return items.filter((item) => item.name !== nombre);
}
