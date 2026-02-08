# Empyreal Energy Solutions - E-commerce Platform

A modern, full-stack e-commerce platform for solar energy products built with Next.js 14, TypeScript, Firebase, and Paystack.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Payments**: Paystack
- **Deployment**: Vercel (recommended) or Firebase Hosting

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Firebase account
- Paystack account
- Git

## 🛠️ Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd empyreal-energy
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing `empyrealenergy`)
3. Enable Firestore Database
4. Enable Authentication (Email/Password provider)
5. Enable Storage

#### Get Firebase Config
1. Project Settings → General → Your apps → Web app
2. Copy the config values

#### Generate Service Account (for Admin SDK)
1. Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Download the JSON file
4. Extract: `project_id`, `client_email`, and `private_key`

### 3. Environment Variables

Create `.env.local` file in the root directory:

```bash
cp .env.local.example .env.local
```

Fill in the values:

```env
# Firebase Client (from Firebase console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=empyrealenergy.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=empyrealenergy
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=empyrealenergy.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=70519749226
NEXT_PUBLIC_FIREBASE_APP_ID=1:70519749226:web:150ede9b6e7e04c14fe813
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-K38Z3SP74Z

# Firebase Admin (from service account JSON)
FIREBASE_ADMIN_PROJECT_ID=empyrealenergy
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@empyrealenergy.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# Paystack (from Paystack dashboard)
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_xxxxx
PAYSTACK_SECRET_KEY=sk_test_xxxxx

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Empyreal Energy Solutions
ADMIN_EMAIL=info@empyrealworks.com
NEXT_PUBLIC_DELIVERY_FEE=5000
```

### 4. Deploy Firebase Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (select Firestore and Storage)
firebase init

# Deploy security rules
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 5. Seed Initial Data (Optional)

You can manually add products through the admin dashboard or use the Firebase console to import your `products.tsx` sample data.

### 6. Create Admin User

After the app is running:
1. Register a new account
2. Go to Firebase Console → Firestore
3. Find the user document in `users` collection
4. Change `role: "customer"` to `role: "admin"`

## 🏃‍♂️ Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
empyreal-energy/
├── src/
│   ├── app/                  # Next.js app router pages
│   │   ├── (main)/          # Public pages (home, products, etc.)
│   │   ├── (shop)/          # Shopping pages (cart, checkout)
│   │   ├── (auth)/          # Auth pages (login, register)
│   │   ├── admin/           # Admin dashboard
│   │   ├── api/             # API routes
│   │   └── layout.tsx       # Root layout
│   ├── components/          # React components
│   ├── contexts/            # React contexts (Auth, Cart)
│   ├── lib/                 # Utility libraries
│   │   ├── firebase/        # Firebase config & helpers
│   │   ├── paystack/        # Paystack integration
│   │   └── utils.ts         # Helper functions
│   ├── types/               # TypeScript type definitions
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
├── firestore.rules          # Firestore security rules
├── storage.rules            # Storage security rules
└── firebase.json            # Firebase config
```

## 🔐 Security

- Firestore security rules enforce authentication and authorization
- Admin routes protected by role-based access control
- Sensitive operations use Firebase Admin SDK
- Payment verification happens server-side

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel login
vercel --prod
```

Add environment variables in Vercel dashboard.

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## 📝 Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Deploy security rules
4. ⬜ Create admin user
5. ⬜ Add products via admin dashboard
6. ⬜ Test checkout flow with Paystack test keys
7. ⬜ Configure domain
8. ⬜ Switch to Paystack live keys
9. ⬜ Launch! 🎉

## 🐛 Troubleshooting

### Firebase Connection Issues
- Verify all environment variables are set correctly
- Check Firebase console for enabled services
- Ensure security rules are deployed

### Paystack Payment Fails
- Confirm public/secret keys match (test/live)
- Check Paystack dashboard for transaction logs
- Verify amount is in kobo (multiply by 100)

### Build Errors
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## 📧 Support

For technical issues, contact: info@empyrealworks.com

## 📄 License

Proprietary - Empyreal Energy Solutions © 2026
