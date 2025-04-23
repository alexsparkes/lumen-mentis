import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FileProvider } from "./context/FileContext";
import ServiceWorkerProvider from "./components/ServiceWorkerProvider";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

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
        {/* <FileProvider>
          <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
        </FileProvider> */}
        <FileProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 bg-neutral-900">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                </div>
              </header>
              <div className="flex flex-1 items-center justify-center bg-neutral-900">
                <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </FileProvider>
      </body>
    </html>
  );
}
