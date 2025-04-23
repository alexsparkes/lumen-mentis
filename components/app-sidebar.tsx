"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
  Home,
  MoreHorizontal,
  Folder,
  Share,
  Trash2,
  Plus, // Import the Plus icon
  FolderOpen, // Import the FolderOpen icon
  Download, // Import the Download icon
} from "lucide-react";

import { useRef, useState } from "react";
import { useFile } from "@/app/context/FileContext";
import FileDropArea from "@/app/components/FileDropArea";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuAction, // Added missing import
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button"; // Import the Button component

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
  pages: [
    {
      name: "Home",
      url: "#",
      icon: SquareTerminal,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { file, setFile, uploadedFiles, deleteFile, downloadFile } = useFile(); // Access downloadFile
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname(); // Get the current route

  const handleCreateNew = () => {
    // Logic for creating a new project
    alert("Create New Project clicked!");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith(".md")) {
      setFile(droppedFile);
      console.log("File dropped:", droppedFile);
    } else {
      alert("Only markdown files are allowed.");
    }
  };

  const handleChooseFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && !selectedFile.name.endsWith(".md")) {
      alert("Only markdown files are allowed.");
      e.target.value = ""; // Reset the input
    } else if (selectedFile) {
      setFile(selectedFile);
      console.log("File selected:", selectedFile);
    }
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg p-1">
                  <svg
                    width="35.25"
                    height="54"
                    viewBox="0 0 47 72"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="fill-primary"
                  >
                    <path d="M32.584 59.576C30.856 59.576 29.368 59.336 28.12 58.856C26.904 58.376 25.704 57.672 24.52 56.744L22.792 59H21.592V48.92H22.84C23.224 50.456 23.816 51.928 24.616 53.336C25.416 54.712 26.488 55.848 27.832 56.744C29.208 57.64 30.92 58.088 32.968 58.088C34.792 58.088 36.296 57.752 37.48 57.08C38.696 56.376 39.592 55.496 40.168 54.44C40.776 53.352 41.08 52.232 41.08 51.08C41.08 50.056 40.856 49.16 40.408 48.392C39.992 47.624 39.368 46.968 38.536 46.424C37.704 45.848 36.728 45.352 35.608 44.936C34.488 44.52 33.224 44.152 31.816 43.832C29.512 43.288 27.624 42.52 26.152 41.528C24.712 40.536 23.64 39.336 22.936 37.928C22.232 36.488 21.88 34.824 21.88 32.936C21.88 30.6 22.392 28.648 23.416 27.08C24.44 25.48 25.784 24.28 27.448 23.48C29.112 22.648 30.888 22.232 32.776 22.232C34.312 22.232 35.64 22.456 36.76 22.904C37.912 23.32 39.08 23.992 40.264 24.92L41.512 22.808H42.712V32.6L41.512 32.648C40.744 29.608 39.608 27.352 38.104 25.88C36.6 24.408 34.76 23.672 32.584 23.672C31.272 23.672 30.04 23.944 28.888 24.488C27.768 25.032 26.872 25.768 26.2 26.696C25.528 27.592 25.192 28.632 25.192 29.816C25.192 30.808 25.4 31.64 25.816 32.312C26.232 32.952 26.824 33.496 27.592 33.944C28.36 34.392 29.256 34.776 30.28 35.096C31.336 35.416 32.488 35.752 33.736 36.104C36.04 36.712 37.96 37.512 39.496 38.504C41.032 39.464 42.184 40.712 42.952 42.248C43.752 43.752 44.152 45.624 44.152 47.864C44.152 51.48 43.144 54.344 41.128 56.456C39.144 58.536 36.296 59.576 32.584 59.576Z" />
                    <path d="M23.944 43.28L15.112 16.88H14.92L14.584 15.488L16.888 7.232H18.328L30.376 43.28H23.944ZM0.232 44V42.8H11.752V44H0.232ZM9.592 32.672V31.472H25.144V32.672H9.592ZM18.184 44V42.8H34.648V44H18.184ZM4.36 43.28L16.888 7.232H18.328L15.4 15.488L5.944 43.28H4.36Z" />
                  </svg>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`${
                  pathname === "/" ? "bg-neutral-800 text-white" : ""
                }`}
              >
                <Link href="/">
                  <Home />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className={`${
                  pathname === "/projects" ? "bg-neutral-800 text-white" : ""
                }`}
              >
                <Link href="/projects">
                  <FolderOpen />
                  <span>Projects</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <div className="px-2">
          <Button
            onClick={handleCreateNew}
            className="w-full flex items-center justify-center gap-2 bg-[#6B00FF] text-white font-semibold py-2 rounded-md shadow-md hover:bg-[#5800cc] transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Create New
          </Button>
        </div>
        <FileDropArea
          isDragging={isDragging}
          selectedFile={file}
          handleChooseFileClick={handleChooseFileClick}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
        <NavProjects
          projects={uploadedFiles.map((file) => ({
            name: file.name,
            url: `/projects/${encodeURIComponent(file.name)}`,
            icon: SquareTerminal,
          }))}
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
