# Divine's Eternity – Luxury Phone Cases & Personalized Gifts

> **Tagline**: *"Gifts that stay in hearts"* · *"A tiny outfit for the thing you hold all day"*

Divine's Eternity is a production-style, luxury Gen-Z e-commerce web application crafted with **React, TypeScript, Vite, and Tailwind CSS**.

---

## 🎨 Design System & Colors
- **Warm Cream Canvas**: `#FFF8F4` (Dark mode: `#141113`)
- **Hot Pink Accent**: `#F0508C`
- **Sunny Yellow Accent**: `#FFD94A`
- **Dark Charcoal Body**: `#231F20`
- **Sky Blue Highlight**: `#E8F4F8`
- **Typography**: `Playfair Display` (Serif Display Headlines with Italic Pink accents) paired with `Plus Jakarta Sans` (Body) & `Sacramento` (Live Calligraphy Script Engraving).

---

## 🚀 Key Features Implemented

### 1. Global Navigation & Layout
- **Announcement Bar**: Rotating offers with prev/next controls and 1-click coupon code copy (`FLAT849`, `BUY3PAY2`, `LOVE100`).
- **Sticky Luxury Header**: Brand title, category dropdown menu, real-time predictive search trigger, wishlist badge, dynamic shopping bag with items count counter, and theme toggle (light/dark mode).
- **Dark Luxury Footer**: Four trust badges, category links, 7-day replacement policy, shipping guide, and contact support.

### 2. Core Home Page Sections
1. **Hero Banner Carousel**: 3-slide autoplay banner carousel with promo callouts, coupon badges, and dual case previews.
2. **Shop By Collection**: Circular category showcases with hot pink rings and yellow sparkle badges for 7 categories:
   - *Zipper Wallet Case*
   - *Bracelet Phone Case*
   - *Gripper Phone Case*
   - *Mirror Phone Case*
   - *Toy Cases*
   - *Clear Designer Case*
   - *Designer Case*
3. **Meet The Best Sellers**: 4-column responsive grid with interactive category filter chips.
4. **Watch It And Buy It**: Horizontal reel cards with video posters, likes, duration tags, and direct Add-To-Cart dropdown action.
5. **Category Spotlight**: Dedicated 4-card showcase for handcrafted pearl bracelet cases.
6. **Shop By Your Choice**: 01-04 numbered interactive list with live hover mockup switching.
7. **Happy Phones. Happier People**: 4.9★ customer review panel, verified buyer badges, and social proof stats.
8. **Yellow Marquee Strip**: Continuous marquee animation with brand slogan.
9. **Four Value Blocks**: Thoughtfully packed, Easy replacements, Here when you need us, Secure payments.
10. **The Divine Club**: Sunny yellow newsletter signup with email validation and instant ₹100 welcome code popup.

### 3. Interactive Customizer & Quick View Modal
- Two-column responsive modal:
  - **Left**: Live generative 3D case mockup with real-time cursive name engraving preview.
  - **Right**:
    1. Phone Brand Dropdown (Apple, Samsung, OnePlus, Google, Xiaomi, Vivo, Oppo, Realme)
    2. Dependent Phone Model Dropdown (populated with real models)
    3. Case Material cards (Soft Silicone, Impact Hard Armor, Quilted Leather Wallet, Chrome Mirror)
    4. Custom Name Input (Max 14 characters) with real-time calligraphy preview
    5. Quantity Stepper
    6. Add to Bag button with form validation.

### 4. Smart Offer Engine & Slide-in Bag Drawer
- **Offer Rules**:
  - `BUY3PAY2`: Every 3 units in bag, lowest-priced case is 100% free.
  - `FLAT849`: Any 2 cases for flat ₹849.
  - `LOVE100`: Instant ₹100 off on orders above ₹500.
  - Automatic best-discount calculation with savings breakdown.
- **Free Express Shipping Progress Bar**: Unlocks free shipping on orders above ₹499.

### 5. Multi-Step Checkout & Orders
- Customer address form with 10-digit mobile number and 6-digit Indian PIN code validation.
- Payment options: UPI (Instant QR / ID), Debit/Credit Cards, Cash on Delivery (COD), and simulated Razorpay modal.
- Generates unique order reference IDs (`DE-XXXXXX`) and persists orders to `localStorage`.
- Confetti celebration on completion.

### 6. Live Order Tracking Timeline
- Enter Order ID + phone number to view live 5-stage timeline: `Placed` → `Packed` → `Shipped` → `Out for delivery` → `Delivered` with courier tracking logs.

### 7. Role-Protected Admin Dashboard (`/admin`)
- Sales metrics, total orders, average order value.
- Orders management table with live status updater (Placed, Packed, Shipped, Delivered) & tracking number assignment.
- Product catalog CRUD (Add new phone cases, set price, MRP, category, patterns).
- Coupon creator (Flat ₹ or percentage % discount rules).
- CSV export for order fulfillment.

---

## 🛠️ How to Customize

### Adding Products
Open `src/data/products.ts` and append your product items:
```typescript
{
  id: 'prod-13',
  slug: 'new-crystal-case',
  name: 'New Crystal Beaded Case',
  category: 'Bracelet Phone Case',
  price: 699,
  mrp: 1499,
  rating: 5.0,
  reviewCount: 1,
  description: '...',
  features: ['...'],
  images: ['...'],
  isBestSeller: true,
  themeColor: '#FFE5EC',
  secondaryColor: '#F0508C',
  designPattern: 'pearl_bracelet',
  supportedBrands: ['Apple', 'Samsung', 'OnePlus'],
  allowsPersonalization: true,
}
```

### Changing Brand Colors
Edit the CSS root variables in `src/index.css`:
```css
:root {
  --bg-main: #FFF8F4;
  --brand-pink: #F0508C;
  --brand-yellow: #FFD94A;
  --text-main: #231F20;
}
```

### Connecting Live Razorpay / Stripe
1. Inject your keys in `.env`:
```env
VITE_RAZORPAY_KEY_ID="rzp_live_your_key_here"
```
2. In `src/pages/CheckoutPage.tsx`, load the Razorpay checkout script:
```typescript
const options = {
  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
  amount: totalAmount * 100, // in paise
  currency: 'INR',
  name: "Divine's Eternity",
  description: `Order ${orderId}`,
  handler: function (response) {
    // verify payment signature on backend
  }
};
const rzp = new (window as any).Razorpay(options);
rzp.open();
```
