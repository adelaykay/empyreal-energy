# 🚀 Quick Start Guide - Empyreal Energy Platform

## Get Started in 5 Minutes

### 1. Install Dependencies
```bash
cd empyreal-energy
npm install
```

### 2. Configure Environment
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit .env.local and fill in your Firebase and Paystack credentials
```

### 3. Deploy Firebase Rules
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy security rules
firebase deploy --only firestore:rules,storage:rules
```

### 4. Run Development Server
```bash
npm run dev
```

Visit http://localhost:3000 🎉

---

## What's Included

### ✅ Phase 1 Foundation (COMPLETE)

#### Core Infrastructure
- **Next.js 14** with App Router and TypeScript
- **Tailwind CSS** with Empyreal design system
- **Firebase** integration (Firestore, Auth, Storage)
- **Paystack** payment integration setup

#### Type Safety
- Product types
- User types  
- Order types
- Cart types
- Inquiry types

#### State Management
- **AuthContext** - User authentication & profile management
- **CartContext** - Shopping cart with persistence (localStorage + Firestore)

#### Database
- Firestore collections schema
- Security rules for data protection
- Storage rules for file uploads

#### Utilities
- Currency formatting (Naira)
- Phone number validation
- Email validation
- Date formatting
- Slug generation
- Delivery fee calculator

---

## Project Structure

```
empyreal-energy/
├── src/
│   ├── app/                    # Next.js pages (to be built)
│   ├── components/             # React components (to be built)
│   ├── contexts/
│   │   ├── AuthContext.tsx    ✓ Complete
│   │   └── CartContext.tsx    ✓ Complete
│   ├── lib/
│   │   ├── firebase/
│   │   │   ├── config.ts      ✓ Client config
│   │   │   ├── admin.ts       ✓ Server config
│   │   │   ├── auth.ts        ✓ Auth functions
│   │   │   └── firestore.ts   ✓ Database helpers
│   │   ├── paystack/
│   │   │   └── client.ts      ✓ Payment setup
│   │   └── utils.ts           ✓ Helper functions
│   └── types/                  ✓ All TypeScript definitions
├── firestore.rules             ✓ Database security
├── storage.rules               ✓ File security
└── README.md                   ✓ Full documentation
```

---

## Next Steps (Phase 2)

### Week 2: Build the UI

1. **Layout Components**
   - Header with navigation
   - Footer
   - Cart widget
   - WhatsApp float button

2. **Homepage**
   - Hero section
   - Services preview
   - Featured products
   - Testimonials

3. **Product Pages**
   - Product catalog with filters
   - Individual product details
   - Add to cart functionality

4. **Shopping Flow**
   - Cart page
   - Checkout page
   - Order confirmation

5. **Auth Pages**
   - Login/Register
   - User account/profile

6. **Admin Dashboard**
   - Product management (CRUD)
   - Order management
   - Inquiry viewing

---

## Important Files to Configure

### 1. `.env.local` (REQUIRED)
Get these values from:
- **Firebase**: Project Settings in Firebase Console
- **Paystack**: Dashboard → Settings → API Keys

### 2. `firestore.rules` 
Already created! Deploy with:
```bash
firebase deploy --only firestore:rules
```

### 3. `storage.rules`
Already created! Deploy with:
```bash
firebase deploy --only storage:rules
```

---

## Creating Your First Admin User

1. Run the app: `npm run dev`
2. Register a new account at `/auth/register`
3. Go to Firebase Console → Firestore Database
4. Find your user in the `users` collection
5. Edit the document and change `role: "customer"` to `role: "admin"`
6. Refresh the app - you're now an admin! 🎉

---

## Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Testing Payment Integration

Use Paystack test cards:

```
✓ Successful payment: 4084 0840 8408 4081
✗ Failed payment: 5060 6666 6666 6666 666

CVV: 123
PIN: 1234
OTP: 123456
```

---

## Support

- 📖 See **README.md** for full documentation
- ✅ See **SETUP-CHECKLIST.md** for detailed setup steps
- 📧 Contact: info@empyrealworks.com

---

## What You Have Now

✅ **Fully configured Next.js 14 TypeScript project**
✅ **Firebase backend ready to use**
✅ **Authentication system**
✅ **Shopping cart with persistence**
✅ **Payment integration setup**
✅ **Security rules deployed**
✅ **Design system matching your brand**

**You're ready to start building pages!** 🚀

The foundation is solid. Phase 2 will focus on creating the UI components and pages using the infrastructure we've built.
