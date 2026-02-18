import type { Metadata } from 'next';
import { PropsWithChildren } from 'react';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from '@/shared/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Hunter - CRM',
  description: 'Hunter Web - Sistema de Gestão Imobiliária e CRM para Corretores de Imóveis',
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="pt-br" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
