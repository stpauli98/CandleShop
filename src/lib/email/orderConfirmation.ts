import { Order } from '../firebase/orders';
import { info } from '../logger';

// TODO: Implementirati stvarno slanje emaila (npr. preko EmailJS ili nekog drugog servisa)
export const sendOrderConfirmationEmail = async (order: Order) => {
    const emailContent = `
        Poštovani ${order.shippingInfo.firstName} ${order.shippingInfo.lastName},

        Hvala vam na narudžbi! 
        
        Broj narudžbe: ${order.orderNumber}
        
        Detalji dostave:
        ${order.shippingInfo.street} ${order.shippingInfo.houseNumber}
        ${order.shippingInfo.postalCode} ${order.shippingInfo.city}
        
        Naručeni proizvodi:
        ${order.items.map(item => `- ${item.naziv} (${item.selectedMiris}, ${item.selectedBoja}) x${item.kolicina}`).join('\\n')}
        
        Ukupno: ${order.total} KM
        Dostava: ${order.shippingCost} KM
        Ukupno za plaćanje: ${order.total + order.shippingCost} KM
        
        Način plaćanja: Plaćanje pouzećem
        
        Srdačan pozdrav,
        Vaš CandleShop tim
    `;

    info('Email content prepared for order', { orderNumber: order.orderNumber, customerEmail: order.customerEmail }, 'EMAIL');
    // TODO: Implementirati stvarno slanje emaila
};
