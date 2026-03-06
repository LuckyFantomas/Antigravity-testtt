import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Sidebar from "@/components/Sidebar";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";

export const metadata = {
  title: "AI News Scraper — Přehled",
  description:
    "Prémiový dashboard pro denní přehled AI novinek z vybraných zdrojů.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body suppressHydrationWarning className="!bg-transparent">
        <ThemeProvider>
          <BackgroundGradientAnimation
            containerClassName="!fixed !inset-0 z-[-1] opacity-70 dark:opacity-30"
            interactive={false}
          />
          <div className="app-layout relative z-10 w-full min-h-screen !bg-transparent">
            <Sidebar />
            <main className="main-content bg-transparent">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
