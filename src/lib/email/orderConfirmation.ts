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

// Email service configuration
const EMAIL_CONFIG = {
    // Za buduću implementaciju sa EmailJS ili drugim servisom
    serviceId: 'service_candleshop',
    templateId: 'template_order_confirmation',
    publicKey: 'your_public_key_here'
};

/**
 * Generates HTML email template for order confirmation
 */
const generateEmailTemplate = (order: Order): EmailTemplate => {
    return {
        customerName: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
        orderNumber: order.orderNumber,
        items: order.items.map(item => 
            `• ${item.naziv} (${item.selectedMiris}, ${item.selectedBoja}) x${item.kolicina}`
        ).join('\n'),
        shippingAddress: `${order.shippingInfo.street} ${order.shippingInfo.houseNumber}, ${order.shippingInfo.postalCode} ${order.shippingInfo.city}`,
        total: `${order.total.toFixed(2)} KM`,
        shippingCost: `${order.shippingCost.toFixed(2)} KM`,
        grandTotal: `${(order.total + order.shippingCost).toFixed(2)} KM`
    };
};

/**
 * Sends order confirmation email to customer
 * 
 * IMPLEMENTACIJA: 
 * 1. Instalirati EmailJS: npm install @emailjs/browser
 * 2. Kreirati account na EmailJS.com
 * 3. Konfigurirati email template
 * 4. Dodati environment varijable za API ključeve
 */
export const sendOrderConfirmationEmail = async (order: Order): Promise<boolean> => {
    try {
        const emailData = generateEmailTemplate(order);
        
        info('Preparing order confirmation email', { 
            orderNumber: order.orderNumber, 
            customerEmail: order.customerEmail,
            emailService: 'EmailJS (pending implementation)'
        }, 'EMAIL');

        // MOCK implementation - replace with actual EmailJS call
        const mockEmailSent = await simulateEmailSending(emailData, order.customerEmail);
        
        if (mockEmailSent) {
            info('Order confirmation email sent successfully', { 
                orderNumber: order.orderNumber,
                recipient: order.customerEmail
            }, 'EMAIL');
            return true;
        } else {
            throw new Error('Failed to send email');
        }

        /* ACTUAL IMPLEMENTATION (uncomment when EmailJS is configured):
        
        import emailjs from '@emailjs/browser';
        
        const templateParams = {
            to_email: order.customerEmail,
            customer_name: emailData.customerName,
            order_number: emailData.orderNumber,
            items_list: emailData.items,
            shipping_address: emailData.shippingAddress,
            total_amount: emailData.total,
            shipping_cost: emailData.shippingCost,
            grand_total: emailData.grandTotal
        };

        const result = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            EMAIL_CONFIG.templateId,
            templateParams,
            EMAIL_CONFIG.publicKey
        );

        return result.status === 200;
        */

    } catch (emailError) {
        error('Failed to send order confirmation email', { 
            error: emailError,
            orderNumber: order.orderNumber,
            customerEmail: order.customerEmail
        }, 'EMAIL');
        
        // Email greška ne treba blokirati narudžbu
        return false;
    }
};

/**
 * Mock function to simulate email sending
 * Remove this when actual email service is implemented
 */
const simulateEmailSending = async (emailData: EmailTemplate, recipient: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Log email content for development purposes
    console.log('📧 MOCK EMAIL SENT TO:', recipient);
    console.log('Subject: Potvrda narudžbe - CandleShop');
    console.log(`
Poštovani ${emailData.customerName},

Hvala vam na narudžbi! 

Broj narudžbe: ${emailData.orderNumber}

Detalji dostave:
${emailData.shippingAddress}

Naručeni proizvodi:
${emailData.items}

Ukupno: ${emailData.total}
Dostava: ${emailData.shippingCost}
Ukupno za plaćanje: ${emailData.grandTotal}

Način plaćanja: Plaćanje pouzećem

Srdačan pozdrav,
Vaš CandleShop tim
    `);
    
    // Simulate 95% success rate
    return Math.random() > 0.05;
};
