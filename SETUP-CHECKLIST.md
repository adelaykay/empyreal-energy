# Empyreal Energy - Setup Checklist

## ✅ Pre-Deployment Checklist

### Firebase Setup
- [ ] Firebase project created/verified
- [ ] Firestore Database enabled
- [ ] Authentication enabled (Email/Password provider)
- [ ] Firebase Storage enabled
- [ ] Service account key downloaded
- [ ] Security rules deployed (`firestore.rules` and `storage.rules`)

### Environment Configuration
- [ ] `.env.local` created from `.env.local.example`
- [ ] Firebase client config added (API key, auth domain, etc.)
- [ ] Firebase admin config added (service account credentials)
- [ ] Paystack keys added (public and secret keys)
- [ ] Site URL configured
- [ ] Delivery fee set

### Initial Data
- [ ] Admin user created and role updated in Firestore
- [ ] Sample products added (optional - can use admin dashboard later)

### Testing
- [ ] App runs locally (`npm run dev`)
- [ ] Can register new user
- [ ] Can login/logout
- [ ] Firebase connection working
- [ ] No console errors

---

## 🔑 Environment Variables Required

### Firebase Client (Public - safe to expose)
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Firebase Admin (Server-only - KEEP SECRET)
```
FIREBASE_ADMIN_PROJECT_ID=
FIREBASE_ADMIN_CLIENT_EMAIL=
FIREBASE_ADMIN_PRIVATE_KEY=
```

### Paystack
```
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=
PAYSTACK_SECRET_KEY=
```

### Site Config
```
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_SITE_NAME=
ADMIN_EMAIL=
NEXT_PUBLIC_DELIVERY_FEE=
```

---

## 📋 Firebase Console Setup Steps

### 1. Firestore Database
1. Go to Build → Firestore Database
2. Click "Create database"
3. Start in **production mode**
4. Choose location: `eur3` (Europe) or `nam5` (US) - closest to Nigeria
5. Deploy security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

### 2. Authentication
1. Go to Build → Authentication
2. Click "Get started"
3. Enable "Email/Password" provider
4. (Optional) Enable phone authentication later

### 3. Storage
1. Go to Build → Storage
2. Click "Get started"
3. Start in **production mode**
4. Deploy security rules:
   ```bash
   firebase deploy --only storage:rules
   ```

### 4. Service Account
1. Go to Project Settings → Service accounts
2. Click "Generate new private key"
3. Save JSON file securely
4. Extract values for `.env.local`:
   - `project_id` → `FIREBASE_ADMIN_PROJECT_ID`
   - `client_email` → `FIREBASE_ADMIN_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_ADMIN_PRIVATE_KEY`

---

## 🎨 Creating Admin User

After first deployment:

1. Run the app and register a new account
2. Go to Firebase Console → Firestore
3. Navigate to `users` collection
4. Find your user document
5. Edit the document:
   ```json
   {
     "role": "admin"  // Change from "customer" to "admin"
   }
   ```
6. Save changes
7. Refresh your app - you now have admin access

---

## 🚀 Deployment Steps

### Option A: Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Settings → Environment Variables

# Deploy to production
vercel --prod
```

### Option B: Firebase Hosting

```bash
# Build the app
npm run build
npm run export

# Deploy
firebase deploy --only hosting
```

---

## 🧪 Testing Checklist

### Before Going Live

- [ ] Test user registration
- [ ] Test login/logout
- [ ] Test adding products (admin)
- [ ] Test product listing (customer)
- [ ] Test add to cart
- [ ] Test cart persistence (refresh page)
- [ ] Test checkout flow
- [ ] Test Paystack payment with **test cards**
- [ ] Test order creation
- [ ] Test order viewing (admin)
- [ ] Test mobile responsiveness

### Paystack Test Cards
```
Success: 4084084084084081
Decline: 5060666666666666666
Pin: 1234
OTP: 123456
```

---

## 🔄 Going Live Checklist

- [ ] Switch Paystack from test to live keys
- [ ] Update `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Configure custom domain (if using)
- [ ] Update Firebase authorized domains
- [ ] Test payment with real card (small amount)
- [ ] Set up monitoring/error tracking
- [ ] Create backup strategy for Firestore

---

## 📞 Support Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Firebase Docs**: https://firebase.google.com/docs
- **Paystack Docs**: https://paystack.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

## 🐛 Common Issues & Solutions

### "Firebase not configured"
→ Check `.env.local` file exists and has correct values

### "Invalid service account"
→ Ensure `FIREBASE_ADMIN_PRIVATE_KEY` includes `\n` and is wrapped in quotes

### "Paystack payment fails"
→ Verify you're using correct key environment (test/live)
→ Check amount is in kobo (multiply by 100)

### "Cannot access admin dashboard"
→ Verify user role is set to "admin" in Firestore

### Build errors
→ Clear cache: `rm -rf .next && npm run dev`

---

## ✅ Phase 1 Completion

You now have:
- ✅ Complete project structure
- ✅ Firebase integration (Auth, Firestore, Storage)
- ✅ Type-safe development environment
- ✅ Authentication system
- ✅ Cart management system
- ✅ Paystack integration
- ✅ Security rules
- ✅ Design system

**Next Steps**: Start building the UI components and pages! 🎉
