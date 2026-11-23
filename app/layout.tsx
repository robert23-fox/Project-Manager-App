import type { Metadata } from "next";
import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import ContextAppProvider from "./contextApp";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Manager App",
  icons: {
    icon: "/app.png",
  },
  description: "Manage your projects and tasks efficiently",
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <ContextAppProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased ${poppins.variable}`}
          >
            {children}
          </body>
        </ContextAppProvider>
      </ClerkProvider>
    </html>
  );
}
