import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/navigation/Navbar';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';
import { ScreenContextProvider } from '@/context/ScreenContext';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'AgriPulse AI — Smarter Fields. Safer Decisions. Stronger Harvests.',
  description: 'AI-powered crop health analysis combined with real-time weather intelligence and multilingual voice AI assistant for modern farmers.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#071C14] text-[#EEF3E5] min-h-screen flex flex-col antialiased selection:bg-[#76B85A]/30 selection:text-[#76B85A]">
        <AuthProvider>
          <ScreenContextProvider>
            <Navbar />
            <main className="flex-1 pb-24 lg:pb-12">
              {children}
            </main>
            <BottomNavigation />
          </ScreenContextProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
