import emailjs from '@emailjs/browser';
import { Order } from '../firebase/orders';
import { info, error as logError } from '../logger';

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_CUSTOMER_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_CUSTOMER_TEMPLATE_ID;
const EMAILJS_ADMIN_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@sarenacarolija.com';

interface EmailParams {
    order_number: string;
    order_date: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    shipping_address: string;
    items_list: string;
    subtotal: string;
    shipping_cost: string;
    total: string;
    payment_method: string;
    additional_info: string;
}

/**
 * Format order items for email display
 */
function formatOrderItems(order: Order): string {
    return order.items
        .map(item => {
            const variants = [];
            if (item.selectedMiris) variants.push(`Miris: ${item.selectedMiris}`);
            if (item.selectedBoja) variants.push(`Boja: ${item.selectedBoja}`);
            const variantText = variants.length > 0 ? ` (${variants.join(', ')})` : '';

            return `${item.naziv || 'Proizvod'}${variantText} - ${item.kolicina}x ${item.cijena} KM`;
        })
        .join('\n');
}

/**
 * Send customer confirmation email
 */
export async function sendCustomerConfirmationEmail(order: Order): Promise<boolean> {
    try {
        if (!EMAILJS_SERVICE_ID || !EMAILJS_CUSTOMER_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            logError('EmailJS configuration missing', {
                service: !!EMAILJS_SERVICE_ID,
                template: !!EMAILJS_CUSTOMER_TEMPLATE_ID,
                key: !!EMAILJS_PUBLIC_KEY
            }, 'EMAIL');
            return false;
        }

        const emailParams: EmailParams = {
            order_number: order.orderNumber,
            order_date: new Date().toLocaleDateString('bs-BA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            customer_name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
            customer_email: order.customerEmail,
            customer_phone: order.shippingInfo.phone,
            shipping_address: `${order.shippingInfo.street} ${order.shippingInfo.houseNumber}, ${order.shippingInfo.postalCode} ${order.shippingInfo.city}`,
            items_list: formatOrderItems(order),
            subtotal: `${order.total.toFixed(2)} KM`,
            shipping_cost: order.shippingCost === 0 ? 'Besplatno' : `${order.shippingCost.toFixed(2)} KM`,
            total: `${(order.total + order.shippingCost).toFixed(2)} KM`,
            payment_method: order.paymentMethod === 'pouzecem' ? 'Plaćanje pouzećem' : order.paymentMethod,
            additional_info: order.shippingInfo.additionalInfo || 'Nema dodatnih napomena'
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_CUSTOMER_TEMPLATE_ID,
            {
                ...emailParams,
                to_email: order.customerEmail,
                to_name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`
            },
            EMAILJS_PUBLIC_KEY
        );

        if (response.status === 200) {
            info(`Customer confirmation email sent successfully for order ${order.orderNumber}`, {
                email: order.customerEmail,
                orderId: order.id
            });
            return true;
        }

        logError('Failed to send customer email', { status: response.status, text: response.text }, 'EMAIL');
        return false;
    } catch (err) {
        logError('Error sending customer confirmation email', err, 'EMAIL');
        return false;
    }
}

/**
 * Send admin notification email
 */
export async function sendAdminNotificationEmail(order: Order): Promise<boolean> {
    try {
        if (!EMAILJS_SERVICE_ID || !EMAILJS_ADMIN_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
            logError('EmailJS configuration missing for admin notification', {
                service: !!EMAILJS_SERVICE_ID,
                template: !!EMAILJS_ADMIN_TEMPLATE_ID,
                key: !!EMAILJS_PUBLIC_KEY
            }, 'EMAIL');
            return false;
        }

        const emailParams: EmailParams = {
            order_number: order.orderNumber,
            order_date: new Date().toLocaleDateString('bs-BA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            customer_name: `${order.shippingInfo.firstName} ${order.shippingInfo.lastName}`,
            customer_email: order.customerEmail,
            customer_phone: order.shippingInfo.phone,
            shipping_address: `${order.shippingInfo.street} ${order.shippingInfo.houseNumber}, ${order.shippingInfo.postalCode} ${order.shippingInfo.city}`,
            items_list: formatOrderItems(order),
            subtotal: `${order.total.toFixed(2)} KM`,
            shipping_cost: order.shippingCost === 0 ? 'Besplatno' : `${order.shippingCost.toFixed(2)} KM`,
            total: `${(order.total + order.shippingCost).toFixed(2)} KM`,
            payment_method: order.paymentMethod === 'pouzecem' ? 'Plaćanje pouzećem' : order.paymentMethod,
            additional_info: order.shippingInfo.additionalInfo || 'Nema dodatnih napomena'
        };

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_ADMIN_TEMPLATE_ID,
            {
                ...emailParams,
                to_email: ADMIN_EMAIL,
                to_name: 'Admin'
            },
            EMAILJS_PUBLIC_KEY
        );

        if (response.status === 200) {
            info(`Admin notification email sent successfully for order ${order.orderNumber}`, {
                adminEmail: ADMIN_EMAIL,
                orderId: order.id
            });
            return true;
        }

        logError('Failed to send admin email', { status: response.status, text: response.text }, 'EMAIL');
        return false;
    } catch (err) {
        logError('Error sending admin notification email', err, 'EMAIL');
        return false;
    }
}

/**
 * Send both customer and admin emails
 * Returns true if at least one email was sent successfully
 */
export async function sendOrderEmails(order: Order): Promise<{ customer: boolean; admin: boolean }> {
    const results = await Promise.allSettled([
        sendCustomerConfirmationEmail(order),
        sendAdminNotificationEmail(order)
    ]);

    const customerResult = results[0].status === 'fulfilled' ? results[0].value : false;
    const adminResult = results[1].status === 'fulfilled' ? results[1].value : false;

    info(`Order emails sent for ${order.orderNumber}`, {
        customerSent: customerResult,
        adminSent: adminResult
    });

    return {
        customer: customerResult,
        admin: adminResult
    };
}
