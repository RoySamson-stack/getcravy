# cravyapp Project Overview and Production Setup

## 1. Executive Summary

cravyapp is a food discovery, restaurant booking, event, deals, and ordering platform built for Nairobi. The product helps users find places to eat, discover food events, reserve tables, order from restaurants, and pay through a mobile-first experience.

The platform is made of four main parts:

- Mobile app for customers
- Public marketing website
- Admin portal for business operations
- Backend API for accounts, restaurants, menus, reservations, orders, payments, and reporting

The goal is to make cravyapp the central food discovery layer for Nairobi: one place to find restaurants, events, deals, reservations, and food orders instead of depending on scattered Instagram pages, WhatsApp posts, Google searches, and word of mouth.

## 2. Product Vision

cravyapp is designed for people who want to discover food experiences quickly and confidently. A user should be able to open the app and answer simple questions:

- Where should I eat today?
- What food events are happening this weekend?
- Which restaurant has a deal right now?
- Can I reserve a table?
- Can I order and pay from my phone?
- Can I contact the restaurant directly?

For restaurants and the cravyapp operations team, the product provides a controlled business dashboard where listings, menus, reservations, events, deals, orders, and revenue can be managed from one place.

## 3. Target Audience

cravyapp is built for:

- Young professionals looking for date-night, brunch, rooftop, casual, and group dining options
- Food lovers who want to discover new restaurants and food events
- Tourists and visitors looking for curated Nairobi food experiences
- Restaurants that want more visibility, reservations, and digital ordering
- Event organizers running food festivals, tastings, pop-ups, chef tables, and nightlife events
- cravyapp administrators who need business and financial visibility

## 4. Core Customer App Features

The mobile app is the main customer experience.

Current and planned customer-facing features include:

- Restaurant discovery by cuisine, vibe, area, rating, and popularity
- Food event discovery for pop-ups, festivals, chef tables, tastings, and live events
- Deals and specials such as happy hour, discount campaigns, and limited-time offers
- Restaurant profile pages with photos, location, category, menus, contact options, and availability
- Table reservations with guest count, date, and time
- Food ordering with cart and checkout flow
- Paystack-powered payment flow
- Favorites and saved places
- User profile and account management
- Direct contact actions such as calling or WhatsApp where supported
- Location-based discovery for restaurants and events near the user

## 5. Admin Portal Purpose

The admin portal is the control center for the cravyapp business. It should not be treated as a marketing page. It is an operations dashboard for repeated daily use.

The admin portal should allow the team to:

- View platform performance from one dashboard
- See revenue, paid orders, pending revenue, reservations, guests, and restaurant performance
- Manage restaurant listings
- Manage menus and item availability
- Manage food events
- Manage deals and promotional campaigns
- Review users and roles
- Moderate reviews
- Track reservations
- Track orders and payments
- Support business decisions using financial and operational data

The admin portal should eventually include role-based access, audit logs, exportable reports, refund visibility, payment reconciliation, restaurant-owner accounts, and operational alerts.

## 6. Public Website Purpose

The website is the public-facing marketing and download layer for cravyapp. It should explain the product quickly and drive users toward downloading the app.

The website should communicate:

- What cravyapp is
- Why Nairobi food discovery needs one central platform
- Featured restaurants and food experiences
- Events and deals available through the app
- How the app works
- Why restaurants should want to be listed
- Where users can download the app

The website is also useful for advertising campaigns, social media links, search visibility, and partnership conversations.

## 7. Backend Purpose

The backend is the source of truth for the product. It stores and serves the data used by the mobile app and admin portal.

The backend is responsible for:

- User authentication and account data
- Restaurant records
- Menu items
- Events
- Deals
- Reservations
- Orders
- Payments
- Admin reporting
- Financial summaries
- Paystack payment initialization, verification, and webhook handling

For production, the backend should be deployed separately from the mobile app and website, with secure environment variables, a managed database, logs, monitoring, and backups.

## 8. Payments

cravyapp is set up to use Paystack as the payment gateway.

The intended payment flow is:

1. User adds items or tickets to cart.
2. User starts checkout.
3. Backend creates an order and initializes a Paystack transaction.
4. User pays through Paystack hosted checkout.
5. Paystack redirects back to the app.
6. Backend verifies the payment with Paystack.
7. Backend updates the order and payment status.
8. Admin dashboard reflects the paid revenue.

Production payment setup requires:

- `PAYSTACK_SECRET_KEY`
- Paystack callback URL
- Paystack webhook URL
- Server-side transaction verification
- Webhook signature validation
- Payment status reconciliation
- Refund and failed-payment handling

## 9. Production Architecture

A production setup should separate each layer clearly:

- Mobile app: built with Expo and React Native, distributed through TestFlight and Google Play internal testing first
- Website: hosted on a production web host such as Vercel, Netlify, Cloudflare Pages, or a VPS
- Admin portal: hosted securely, ideally behind admin authentication and HTTPS
- Backend API: deployed to a server or cloud platform with HTTPS and environment-based configuration
- Database: managed PostgreSQL with backups enabled
- Payments: Paystack live credentials and webhook endpoints
- Storage: cloud storage for images if restaurant/event uploads are supported
- Monitoring: uptime checks, logs, error tracking, and alerting

Recommended production services:

- Backend hosting: Render, Railway, Fly.io, DigitalOcean, AWS, or a VPS
- Database: Supabase Postgres, Neon, Railway Postgres, DigitalOcean Managed Postgres, or AWS RDS
- Website hosting: Vercel, Netlify, Cloudflare Pages, or static hosting behind Nginx
- Error tracking: Sentry
- Analytics: PostHog, Firebase Analytics, or Google Analytics
- Payments: Paystack
- Mobile distribution: Apple TestFlight and Google Play Internal Testing

## 10. Mobile Release Setup

The app is configured for Expo Application Services.

The expected release flow is:

- iOS testing: build with EAS and upload to Apple TestFlight
- Android testing: build an Android App Bundle and upload to Google Play Internal Testing
- Internal APK builds can still be used for quick Android testing, but Play Console testing should use an AAB build

Important release requirements:

- Apple Developer account
- App Store Connect app record
- Valid iOS distribution certificate
- Valid iOS provisioning profile
- Google Play Console account
- Google Play app record
- Android signing key
- Store listing assets
- Privacy policy URL
- App screenshots
- App description
- Support email

## 11. Advertising Positioning

cravyapp can be advertised as:

> Nairobi's food discovery app for restaurants, events, deals, reservations, and ordering.

Short tagline options:

- Discover Nairobi's food scene in one app.
- Find restaurants, events, and food deals around Nairobi.
- Your next meal, table, or food event starts with cravyapp.
- Stop scrolling. Find where to eat now.
- Nairobi restaurants, food events, and deals in your pocket.

Longer advertising description:

> cravyapp helps you discover Nairobi's best restaurants, food events, deals, and dining experiences from one mobile app. Browse by vibe, cuisine, area, and occasion, then reserve a table, contact the restaurant, order food, or pay securely through the app.

Restaurant-facing description:

> cravyapp gives restaurants a direct channel to reach hungry customers, promote deals, list events, receive reservations, and track performance from an admin dashboard.

## 12. Social Media Copy

Launch announcement:

> Nairobi food discovery just got easier. cravyapp helps you find restaurants, food events, deals, reservations, and ordering in one app. Whether you are looking for brunch, date night, nyama choma, rooftop dining, or weekend food events, cravyapp helps you find the right spot faster.

Short ad copy:

> Hungry in Nairobi? Open cravyapp. Find restaurants, deals, events, and tables near you.

Restaurant partner copy:

> Own or manage a restaurant in Nairobi? cravyapp helps you get discovered, promote offers, list events, receive reservations, and track customer activity.

Event copy:

> From food festivals to chef tables, cravyapp helps Nairobi discover what is happening this week.

## 13. Website Copy Direction

The public website should focus on conversion.

Recommended sections:

- Hero: cravyapp as Nairobi's food discovery app
- Search/discovery preview: restaurants, events, deals
- Trust stats: users, restaurants, events, ratings
- Featured restaurants
- Events and deals
- How it works
- App screenshots
- Restaurant partner CTA
- Download CTA
- Footer with contact, legal, and social links

Primary website CTA:

- Download the app

Secondary website CTA:

- Explore restaurants
- List your restaurant

## 14. Admin Dashboard Metrics

The admin dashboard should prioritize business metrics:

- Total revenue
- Paid revenue
- Pending revenue
- Paid orders
- Orders today
- Active restaurants
- Registered users
- Reservations
- Reserved guests
- Average order value
- Top restaurants by revenue
- Recent orders
- Recent reservations
- Event activity
- Deal performance

These metrics support day-to-day operations and make the admin portal useful for business decisions.

## 15. Production Readiness Checklist

Before public launch, the following should be completed:

- Real backend deployed with HTTPS
- Production PostgreSQL database connected
- Database migrations run successfully
- Admin authentication fully connected to backend auth
- Test admin accounts created
- Paystack live keys configured
- Paystack webhook URL configured
- Payment verification tested end to end
- Mobile app API URL pointed to production backend
- TestFlight build uploaded and tested
- Android internal test build uploaded and tested
- Privacy policy published
- Terms of service published
- App screenshots prepared
- Store listing copy prepared
- Error monitoring configured
- Server logs available
- Database backups enabled
- Basic smoke tests completed
- Real restaurant/menu/event data loaded

## 16. Known Business Risks

The most important risks to handle before advertising heavily are:

- Payment flow must be tested with real Paystack test and live credentials
- Admin financial reporting must match actual paid orders, not sample data
- Restaurant data quality must be strong enough for users to trust the app
- The backend and database must be stable before public traffic
- Store review requirements must be satisfied for Apple and Google
- Support process must exist for failed payments, booking disputes, and restaurant data issues

## 17. Recommended Launch Plan

Phase 1: Internal testing

- Test the app through TestFlight and Google Play Internal Testing
- Use a small group of testers
- Test login, discovery, reservations, cart, checkout, payment verification, and admin reporting

Phase 2: Restaurant pilot

- Add a small group of real restaurants
- Verify menu data, availability, deals, and contact details
- Test reservation and ordering flows with real restaurant staff

Phase 3: Soft public launch

- Launch the website
- Promote through social media
- Invite early users
- Collect feedback and fix critical issues quickly

Phase 4: Paid advertising

- Run ads once the payment, reservation, and backend flows are stable
- Target Nairobi food lovers, event seekers, brunch/date-night audiences, and restaurant followers
- Track conversion from ad click to app install and first action

## 18. One-Paragraph Pitch

cravyapp is a Nairobi food discovery platform that brings restaurants, food events, deals, reservations, ordering, and payments into one mobile app. Instead of scrolling through scattered posts and pages, users can discover where to eat, what is happening, and what offers are available nearby. Restaurants get more visibility and an operational dashboard for listings, menus, events, reservations, orders, and revenue.

## 19. One-Sentence Pitch

cravyapp helps Nairobi discover restaurants, food events, deals, reservations, and ordering from one mobile app.
