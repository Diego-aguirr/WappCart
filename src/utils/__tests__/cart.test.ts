import { describe, it, expect } from 'vitest';
import { calcularTotal, agregarItem, quitarItem, type CartItem } from '../cart';

describe('calcularTotal', () => {
  it('devuelve 0 si el carrito está vacío', () => {
    expect(calcularTotal([])).toBe(0);
  });

  it('suma precio × cantidad de un solo item', () => {
    const items: CartItem[] = [
      { name: 'Pizza Muzzarella', price: 5000, quantity: 2 },
    ];
    expect(calcularTotal(items)).toBe(10000);
  });

  it('suma múltiples items correctamente', () => {
    const items: CartItem[] = [
      { name: 'Pizza Muzzarella', price: 5000, quantity: 2 },
      { name: 'Empanada de carne', price: 800, quantity: 6 },
    ];
    expect(calcularTotal(items)).toBe(14800);
  });
});

describe('agregarItem', () => {
  it('agrega un item nuevo al carrito vacío', () => {
    const resultado = agregarItem([], {
      name: 'Pizza',
      price: 5000,
      quantity: 1,
    });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].name).toBe('Pizza');
  });

  it('incrementa cantidad si el item ya existe', () => {
    const items: CartItem[] = [
      { name: 'Pizza', price: 5000, quantity: 1 },
    ];
    const resultado = agregarItem(items, {
      name: 'Pizza',
      price: 5000,
      quantity: 2,
    });
    expect(resultado).toHaveLength(1);
    expect(resultado[0].quantity).toBe(3);
  });
});

describe('quitarItem', () => {
  it('elimina el item por nombre', () => {
    const items: CartItem[] = [
      { name: 'Pizza', price: 5000, quantity: 1 },
      { name: 'Empanada', price: 800, quantity: 3 },
    ];
    const resultado = quitarItem(items, 'Pizza');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].name).toBe('Empanada');
  });

  it('devuelve el mismo array si no encuentra el item', () => {
    const items: CartItem[] = [
      { name: 'Pizza', price: 5000, quantity: 1 },
    ];
    const resultado = quitarItem(items, 'Hamburguesa');
    expect(resultado).toHaveLength(1);
  });
});
