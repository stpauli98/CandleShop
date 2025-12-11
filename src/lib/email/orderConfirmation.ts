import { Order } from '../firebase/orders';
import { info, error } from '../logger';

// Email template interface
interface EmailTemplate {
    customerName: string;
    orderNumber: string;
    items: string;
    shippingAddress: string;
    total: string;
    shippingCost: string;
    grandTotal: string;
}

// Generate order confirmation email HTML
export function generateOrderConfirmationEmail(order: Order): string {
    const itemsList = order.items.map(item => `
        <tr>
            <td>${item.naziv || 'Proizvod'}</td>
            <td>${item.kolicina}</td>
            <td>${item.cijena || '0'} KM</td>
        </tr>
    `).join('');

    const template: EmailTemplate = {
        customerName: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
        orderNumber: order.orderNumber,
        items: itemsList,
        shippingAddress: `${order.shippingInfo.street} ${order.shippingInfo.houseNumber}, ${order.shippingInfo.postalCode} ${order.shippingInfo.city}`,
        total: order.total.toFixed(2),
        shippingCost: order.shippingCost.toFixed(2),
        grandTotal: (order.total + order.shippingCost).toFixed(2)
    };

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #7c3aed; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .footer { padding: 20px; text-align: center; color: #666; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Potvrda narudžbe</h1>
                </div>
                <div class="content">
                    <p>Poštovani ${template.customerName},</p>
                    <p>Hvala vam na narudžbi! Vaša narudžba broj <strong>${template.orderNumber}</strong> je uspješno zaprimljena.</p>

                    <h3>Detalji narudžbe:</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Proizvod</th>
                                <th>Količina</th>
                                <th>Cijena</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${template.items}
                        </tbody>
                    </table>

                    <p><strong>Adresa dostave:</strong><br>${template.shippingAddress}</p>
                    <p><strong>Način plaćanja:</strong> ${order.paymentMethod}</p>

                    <h3>Ukupno:</h3>
                    <p>Proizvodi: ${template.total} KM</p>
                    <p>Dostava: ${template.shippingCost} KM</p>
                    <p><strong>Ukupno za plaćanje: ${template.grandTotal} KM</strong></p>
                </div>
                <div class="footer">
                    <p>Šarena Čarolija - Ručno izrađene svijeće</p>
                    <p>Kontakt: info@sarenacarolija.com</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

// Send order confirmation email (placeholder for future implementation)
export async function sendOrderConfirmationEmail(order: Order): Promise<void> {
    try {
        info(`Email confirmation generated for order ${order.orderNumber}`, { email: order.customerEmail });
        // Future implementation with EmailJS or other email service
        const _emailContent = generateOrderConfirmationEmail(order);
        // Email content is ready for future email service integration
    } catch (err) {
        error('Failed to send order confirmation email', err, 'EMAIL');
    }
}
