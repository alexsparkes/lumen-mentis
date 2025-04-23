import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FileProvider } from "./context/FileContext";
import ServiceWorkerProvider from "./components/ServiceWorkerProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#6B00FF" />
      </head>
      <body
        className={`bg-neutral-950 ${inter.variable} ${jetBrainsMono.variable} antialiased`}
      >
        <FileProvider>
          <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
        </FileProvider>
      </body>
    </html>
  );
}
