import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConfigProvider } from "antd";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio CMS Dashboard",
  description: "Modern admin dashboard for managing developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#7c3aed",
                colorBgContainer: "#0f172a",
                colorBorder: "#1e293b",
                colorText: "#f1f5f9",
                colorTextSecondary: "#cbd5e1",
                colorBgBase: "#0f172a",
                fontFamily: "inherit",
                borderRadius: 8,
              },
            }}
          >
            {children}
          </ConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
