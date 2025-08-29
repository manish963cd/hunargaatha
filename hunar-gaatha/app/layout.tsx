import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, Dancing_Script } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/section/Navbar";
import Footer from "@/components/section/Footer";

// A classic, elegant serif font for main headings and titles.
// Playfair Display is a great choice, but we can make it more versatile.
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

// A highly readable, traditional serif font for body text.
// This is a much better choice for product descriptions and general content.
const eb_garamond = EB_Garamond({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-eb-garamond",
});

// A beautiful script font for subtle, decorative touches.
// This adds a whimsical, handmade feel without sacrificing readability.
const dancing_script = Dancing_Script({
  subsets: ["latin"],
  display: "swap",
  weight: "400", // Specifying a single weight for this decorative font
  variable: "--font-dancing-script",
});

export const metadata: Metadata = {
  title: "Hunar Gatha - Crafting Culture, One Tale at a Time",
  description:
    "Discover authentic Indian crafts and the stories behind them. Connect with artisans and their timeless traditions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body 
        className={`${playfair.variable} ${eb_garamond.variable} ${dancing_script.variable} antialiased bg-amber-50`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}