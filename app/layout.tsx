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
  title: "Khalti - Login",
  description: "A practice login clone for internship learning purposes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} overflow-y-scroll`}>
      <body className="font-sans antialiased bg-white text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}