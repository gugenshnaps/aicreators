import type { Metadata } from "next";
import { Londrina_Shadow } from "next/font/google";
import "./globals.css";

const londrinaShadow = Londrina_Shadow({
  variable: "--font-londrina-shadow",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "AI Creators — Маркетплейс AI-креаторов",
  description: "Найдите лучших AI-креаторов для ваших проектов. Карточки товаров, баннеры, визуалы с помощью искусственного интеллекта.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${londrinaShadow.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
