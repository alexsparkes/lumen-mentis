"use client";

import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { FileProvider } from "./context/FileContext";
import ServiceWorkerProvider from "./components/ServiceWorkerProvider";
import { useMemo, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter

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
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const router = useRouter(); // Initialize router
  const [isClient, setIsClient] = useState(false);

  // Ensure breadcrumb rendering happens only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Prefetch the slug page when on /edit or /learn
  useEffect(() => {
    const pathSegments = pathname.split("/").filter(Boolean);
    const fileName = pathSegments[1]; // Extract the file name (slug)
    const currentPage = pathSegments[2]; // Extract the current page (edit/learn)

    if (fileName && (currentPage === "edit" || currentPage === "learn")) {
      router.prefetch(`/projects/${fileName}`); // Prefetch the slug page
    }
  }, [pathname, router]);

  // Memoize breadcrumb items to avoid recalculating on every render
  const breadcrumbItems = useMemo(() => {
    if (!isClient) return { fileName: "", currentPage: "" }; // Fallback during SSR

    const pathSegments = pathname.split("/").filter(Boolean);
    const fileName = pathSegments[1] || ""; // Extract the file name (slug)
    const currentPage = pathSegments[2] || ""; // Extract the current page (edit/learn)

    return { fileName, currentPage };
  }, [pathname, isClient]);

  const { fileName, currentPage } = breadcrumbItems;

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
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 bg-neutral-900">
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator orientation="vertical" className="mr-2 h-4" />
                  {isClient && ( // Render breadcrumb only on the client
                    <Breadcrumb>
                      <BreadcrumbList>
                        {fileName && (
                          <>
                            <BreadcrumbItem>
                              <BreadcrumbLink href={`/projects/${fileName}`}>
                                {decodeURIComponent(fileName)}
                              </BreadcrumbLink>
                            </BreadcrumbItem>
                          </>
                        )}
                        {currentPage && (
                          <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                              <BreadcrumbPage>
                                {currentPage.charAt(0).toUpperCase() +
                                  currentPage.slice(1)}
                              </BreadcrumbPage>
                            </BreadcrumbItem>
                          </>
                        )}
                      </BreadcrumbList>
                    </Breadcrumb>
                  )}
                </div>
              </header>
              <div className=" bg-neutral-900">
                <ServiceWorkerProvider>{children}</ServiceWorkerProvider>
              </div>
            </SidebarInset>
          </SidebarProvider>
        </FileProvider>
      </body>
    </html>
  );
}
