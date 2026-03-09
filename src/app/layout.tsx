import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'PromptCache',
  description: 'Prompt library, workshop, sessions, and integrations for high-quality prompting.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
