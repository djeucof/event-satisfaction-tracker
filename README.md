# Event Satisfaction Tracker 😃😐😞

A lightweight, professional feedback collection system designed for events. This application allows participants (specifically optimized for children) to quickly rate their experience using intuitive emojis.

## 🚀 Features

- **Kid-Friendly UI**: Simple, large, and colorful interactive emojis.
- **Event-Specific Tracking**: Ability to set unique event names for organized data collection.
- **Secure Admin Dashboard**: Password-protected access to real-time results.
- **Data Export**: One-click CSV export for analysis in Excel or Google Sheets.
- **Real-time Database**: Powered by Supabase for instant data synchronization.

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Deployment**: Vercel

## 📋 Setup & Installation

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Environment Variables**: Create a `.env.local` file with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
4. **Run development server**: npm run dev

## 🔒 Security

- **Row Level Security (RLS)**: Configured to allow public inserts while protecting read access.
- **Admin Access**: Protected by a secure access code for data privacy.

## 📄 License

This project is open-source and available under the MIT License.

---
*Created for Yksin vanhempana ry*
