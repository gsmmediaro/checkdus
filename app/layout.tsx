import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Luxury Nails & Spa - Customer Portal",
  description: "Book appointments, check in, and manage your nail salon visits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="bg-pink-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <a href="/" className="text-2xl font-bold">
                Luxury Nails & Spa
              </a>
              <div className="space-x-6">
                <a href="/" className="hover:text-pink-200 transition">Home</a>
                <a href="/contact" className="hover:text-pink-200 transition">Contact Us</a>
                <a href="/management/login" className="hover:text-pink-200 transition text-sm">Management Login</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-16">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2024 Luxury Nails & Spa. All rights reserved.</p>
            <div className="mt-4 space-x-4">
              <a href="/contact" className="hover:text-pink-400 transition">Contact Us</a>
              <a href="/management/login" className="hover:text-pink-400 transition">Management Login</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
