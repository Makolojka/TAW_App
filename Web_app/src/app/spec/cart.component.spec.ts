describe('getTotalSum function', () => {
  function getTotalSum(cartData: any, isEventExpired: (dateStr: string) => boolean): number {
    let totalSum = 0;
    if (cartData && cartData.cart) {
      for (const cartItem of cartData.cart) {
        if (!isEventExpired(cartItem.event.date)) {
          for (const ticket of cartItem.tickets) {
            totalSum += ticket.quantity * ticket.price;
          }
        }
      }
    }
    return Number(totalSum.toFixed(2));
  }

  it('should return total sum properly', () => {
    const cartData = {
      cart: [
        {
          event: { date: '2024-01-04T12:00:00' },
          tickets: [{ quantity: 2, price: 10 }, { quantity: 1, price: 20 }]
        },
        {
          event: { date: '2024-01-06T12:00:00' },
          tickets: [{ quantity: 3, price: 15 }]
        }
      ]
    };

    const isEventExpired = (dateStr: string) => {
      const currentDate = new Date();
      const eventDate = new Date(dateStr);
      return eventDate < currentDate;
    };

    // Call the function and assert the result
    const totalSum = getTotalSum(cartData, isEventExpired);
    expect(totalSum).toBe(45);
  });

});
