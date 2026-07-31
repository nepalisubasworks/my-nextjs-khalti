import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Khalti Digital Wallet - Instant, Secure and Hassle-Free Online Payments in Nepal",
  
  description: `Khalti is a digital wallet for instant, secure and hassle-free online payments in Nepal. Recharge your mobiles, pay bills, book tickets whreever you are.
  web.khalti.com`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable}`}>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}