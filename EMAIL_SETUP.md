# 📧 EmailJS Setup Guide

Ovaj dokument sadrži detaljna uputstva za konfiguraciju EmailJS servisa za slanje email notifikacija.

## 🚀 Koraci za Setup

### 1. Kreiranje EmailJS Accounta

1. Idi na [https://www.emailjs.com/](https://www.emailjs.com/)
2. Klikni na **"Sign Up"** i kreiraj besplatan account
3. Verifikuj svoj email

### 2. Dodavanje Email Servisa

1. Nakon prijave, idi na **"Email Services"** tab
2. Klikni **"Add New Service"**
3. Odaberi email provajdera (preporuka: **Gmail**)
4. Poveži svoj Gmail account:
   - Email: tvoj@gmail.com
   - Dozvoli pristup EmailJS aplikaciji
5. Kopiraj **Service ID** (npr. `service_abc123`)

### 3. Kreiranje Email Template-a

Trebaš kreirati **2 template-a**:

#### 📩 Template 1: Customer Confirmation (Potvrda za kupca)

1. Idi na **"Email Templates"** tab
2. Klikni **"Create New Template"**
3. **Template Name**: `customer_order_confirmation`
4. **Subject**: `Potvrda narudžbe #{{order_number}} - Šarena Čarolija`

**Email Content (HTML)**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #7c3aed; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
        .order-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
        .total { font-size: 1.2em; font-weight: bold; color: #7c3aed; margin-top: 20px; }
        .footer { text-align: center; color: #666; padding: 20px; font-size: 0.9em; }
        .button { background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🕯️ Šarena Čarolija</h1>
            <h2>Potvrda Narudžbe</h2>
        </div>

        <div class="content">
            <p>Poštovani/a <strong>{{to_name}}</strong>,</p>

            <p>Hvala vam na narudžbi! Vaša narudžba je uspješno zaprimljena i biće obrađena u najkraćem mogućem roku.</p>

            <div class="order-details">
                <h3>📋 Detalji Narudžbe</h3>
                <p><strong>Broj narudžbe:</strong> {{order_number}}</p>
                <p><strong>Datum:</strong> {{order_date}}</p>

                <h4>Proizvodi:</h4>
                <div style="white-space: pre-line; background: #f5f5f5; padding: 15px; border-radius: 5px;">{{items_list}}</div>

                <div style="margin-top: 20px;">
                    <p><strong>Međuzbroj:</strong> {{subtotal}}</p>
                    <p><strong>Dostava:</strong> {{shipping_cost}}</p>
                    <p class="total">Ukupno za plaćanje: {{total}}</p>
                </div>
            </div>

            <div class="order-details">
                <h3>📍 Adresa Dostave</h3>
                <p>{{shipping_address}}</p>
                {{#if additional_info}}
                <p><em>Napomena: {{additional_info}}</em></p>
                {{/if}}

                <h3>💳 Način Plaćanja</h3>
                <p>{{payment_method}}</p>
            </div>

            <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; border-left: 4px solid #ffc107;">
                <strong>ℹ️ Šta slijedi?</strong>
                <p style="margin: 10px 0 0 0;">Bićete obaviješteni putem email-a kada vaša narudžba bude spremna za slanje. Dostava obično traje 2-5 radnih dana.</p>
            </div>
        </div>

        <div class="footer">
            <p><strong>Šarena Čarolija</strong> - Ručno izrađene svijeće</p>
            <p>📧 Email: info@sarenacarolija.com | 📱 Tel: {{customer_phone}}</p>
            <p style="font-size: 0.8em; color: #999;">Hvala vam što podržavate lokalne proizvođače! 💜</p>
        </div>
    </div>
</body>
</html>
```

5. Kopiraj **Template ID** (npr. `template_customer123`)

---

#### 📬 Template 2: Admin Notification (Notifikacija za admina)

1. Kreiraj novi template
2. **Template Name**: `admin_new_order_notification`
3. **Subject**: `🛒 Nova narudžba #{{order_number}}`

**Email Content (HTML)**:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #059669; color: white; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f9f9f9; padding: 30px 20px; border-radius: 0 0 8px 8px; }
        .order-details { background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .urgent { background-color: #fee2e2; padding: 15px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 20px 0; }
        .total { font-size: 1.3em; font-weight: bold; color: #059669; margin-top: 20px; }
        .customer-info { background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛒 NOVA NARUDŽBA</h1>
            <h2>Broj: {{order_number}}</h2>
        </div>

        <div class="content">
            <div class="urgent">
                <strong>⚡ Akcija potrebna!</strong>
                <p style="margin: 10px 0 0 0;">Nova narudžba je stigla i čeka obradu. Molimo obradite što prije.</p>
            </div>

            <div class="order-details">
                <h3>📦 Detalji Narudžbe</h3>
                <p><strong>Broj narudžbe:</strong> {{order_number}}</p>
                <p><strong>Datum:</strong> {{order_date}}</p>
                <p><strong>Status:</strong> <span style="color: #f59e0b; font-weight: bold;">PENDING</span></p>

                <h4>Naručeni proizvodi:</h4>
                <div style="white-space: pre-line; background: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace;">{{items_list}}</div>

                <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e5e5;">
                    <p><strong>Međuzbroj:</strong> {{subtotal}}</p>
                    <p><strong>Dostava:</strong> {{shipping_cost}}</p>
                    <p class="total">💰 Ukupno: {{total}}</p>
                    <p><strong>Način plaćanja:</strong> {{payment_method}}</p>
                </div>
            </div>

            <div class="customer-info">
                <h3>👤 Informacije o Kupcu</h3>
                <p><strong>Ime:</strong> {{customer_name}}</p>
                <p><strong>Email:</strong> <a href="mailto:{{customer_email}}">{{customer_email}}</a></p>
                <p><strong>Telefon:</strong> <a href="tel:{{customer_phone}}">{{customer_phone}}</a></p>

                <h4 style="margin-top: 20px;">📍 Adresa za Dostavu:</h4>
                <p>{{shipping_address}}</p>
                {{#if additional_info}}
                <p><strong>Dodatne napomene:</strong></p>
                <p style="background: #fff; padding: 10px; border-radius: 5px;"><em>{{additional_info}}</em></p>
                {{/if}}
            </div>

            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; text-align: center;">
                <p style="margin: 0;"><strong>📊 Pristupite Admin Panelu za obradu narudžbe</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
```

4. Kopiraj **Template ID** (npr. `template_admin456`)

---

### 4. Kopiranje Public Key-a

1. Idi na **"Account"** tab
2. Pronađi **"Public Key"** sekciju
3. Kopiraj key (npr. `xYz-AbC123_XyZ`)

---

### 5. Dodavanje Credentials u .env Fajl

1. Otvori `.env.production` fajl (ili kreiraj novi ako ne postoji)
2. Dodaj sljedeće linije:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123          # Tvoj Service ID
VITE_EMAILJS_CUSTOMER_TEMPLATE_ID=template_customer123  # Customer Template ID
VITE_EMAILJS_ADMIN_TEMPLATE_ID=template_admin456        # Admin Template ID
VITE_EMAILJS_PUBLIC_KEY=xYz-AbC123_XyZ                 # Public Key
VITE_ADMIN_EMAIL=tvoj@email.com                        # Admin email adresa
```

---

## 🔧 Template Varijable

EmailJS koristi sljedeće varijable koje se automatski popunjavaju:

### Zajedničke Varijable (oba template-a):
- `{{to_email}}` - Email primatelja
- `{{to_name}}` - Ime primatelja
- `{{order_number}}` - Broj narudžbe
- `{{order_date}}` - Datum narudžbe
- `{{customer_name}}` - Ime kupca
- `{{customer_email}}` - Email kupca
- `{{customer_phone}}` - Telefon kupca
- `{{shipping_address}}` - Adresa dostave
- `{{items_list}}` - Lista proizvoda (formatirana)
- `{{subtotal}}` - Međuzbroj
- `{{shipping_cost}}` - Trošak dostave
- `{{total}}` - Ukupno
- `{{payment_method}}` - Način plaćanja
- `{{additional_info}}` - Dodatne napomene (opcionalno)

---

## 🧪 Testiranje

Nakon što dodaš credentials:

1. Pokreni dev server: `npm run dev`
2. Napravi test narudžbu
3. Provjeri:
   - Gmail inbox kupca → trebao bi stići customer confirmation email
   - Gmail inbox admina → trebao bi stići admin notification email
4. Provjeri EmailJS dashboard → **"Logs"** tab za status slanja

---

## 🚨 Troubleshooting

### Emailovi se ne šalju?

1. **Provjeri console** - Greške će biti logovane
2. **Provjeri .env** - Da li su svi credentials ispravni?
3. **Provjeri EmailJS Dashboard** → "Logs" tab
4. **Gmail Security** - Možda trebaš omogućiti "Less secure app access"
5. **EmailJS Limits** - Besplatni plan ima limit od 200 emailova/mjesec

### Email stiže ali nema podataka?

- Provjeri da li su **varijable u template-u** ispravno napisane (case-sensitive)
- Koristi tačno iste nazive varijabli kao u `emailService.ts`

---

## 📊 Monitoring

U EmailJS dashboardu možeš pratiti:
- **Number of emails sent** - Koliko emailova poslato
- **Success rate** - Procenat uspješnih emailova
- **Logs** - Detaljan log svake email poruke
- **Usage** - Preostali email credits

---

## 💡 Napredne Opcije

### Auto-Reply Setup
Možeš podesiti da Gmail automatski odgovara na customer emailove sa dodatnim info.

### Custom Domain
Za profesionalniji izgled, koristi custom email domain (info@sarenacarolija.com).

### Backup Email Service
Dodaj sekundarni email servis (SendGrid, Mailgun) kao fallback.

---

**✅ Setup završen!** Sad bi trebao imati potpuno funkcionalan email sistem.
