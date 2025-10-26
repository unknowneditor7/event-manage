# **App Name**: FestPay

## Core Features:

- Student Payment Interface: Allow students to select their name from a dropdown (populated from a predefined list), and display the Google Pay QR code for payment.  The QR code displayed is the following: [image of a QR code with the text Vishwa;UPI ID: chiyaanvishwa2@okhdfcbank;Amount: ₹240.00;Scan to pay with any UPI app]
- QR Code Management: Admin interface to upload and update the Google Pay QR code.
- Payment Status Tracking: Real-time dashboard displaying student payment status (pending, completed) with timestamps, leveraging Firestore.
- Automated Receipt Generation: Generate and send a receipt email to students immediately upon successful payment.
- Real-time Database Synchronization: Utilize Firestore for real-time updates of payment status across all views.
- Data integrity validation: Use an AI tool that automatically ensures payment data correctness using Firestore's logs. Ensures no data corruption occurs.

## Style Guidelines:

- Primary color: Dark royal blue (#293B70) to inspire trust and reflect the official feel of an academic collection.
- Background color: Dark gray (#121212) to fit the general dark theme.
- Accent color: Gold (#FFD700) adds a touch of prestige, hinting at the festive nature of the app, as well as useful highlighting on a low-brightness, low-saturation background.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines, and 'Inter' (sans-serif) for body text.
- Use simple, clear, and bright icons for payment status indicators (e.g., checkmark for completed, clock for pending).
- Clean and responsive layout optimized for both desktop (admin dashboard) and mobile (student payment interface).
- Subtle transitions and animations to confirm payment status changes.