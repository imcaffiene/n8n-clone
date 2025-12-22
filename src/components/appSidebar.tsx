"use client";

import {
  CreditCardIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions";
import { WorkflowIcon } from "./animate-ui/icons/workflow";

const menuItems = [
  {
    title: "WorkFlows",
    items: [
      {
        title: "WorkFlows",
        icon: WorkflowIcon,
        url: "/workflows",
      },
      {
        title: "Credentials",
        icon: KeyIcon,
        url: "/credentials",
      },
      {
        title: "Executions",
        icon: HistoryIcon,
        url: "/executions",
      },
    ],
  },
];

export const AppSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenuItem>
          <SidebarMenuSubButton
            className='gap-x-4 h-10 px-4'
            asChild
          >
            <Link
              href='/'
              prefetch
            >
              <Image
                src={"/logo.png"}
                alt='n8n logo'
                width={24}
                height={24}
              />
              <span className='font-semibold text-sm'>Flow X</span>
            </Link>
          </SidebarMenuSubButton>
        </SidebarMenuItem>
      </SidebarHeader>

      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className='gap-x-4 h-10 px-4'
                      isActive={
                        item.url === "/"
                          ? pathname === "/"
                          : pathname.startsWith(item.url)
                      }>
                      <Link
                        href={item.url}
                        prefetch
                      >
                        <item.icon className='size-4' />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {!hasActiveSubscription && !isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip='Upgrade to Pro'
                className='gap-x-4 h-10 px-4'
                onClick={() => authClient.checkout({ slug: 'flow-x-pro-monthly' })}
              >
                <StarIcon className='h-4 w-4' />
                <span>Upgrade to pro</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}


          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip='Billing & Plans'
              className='gap-x-4 h-10 px-4'
              onClick={() => authClient.customer.portal()}
            >
              <CreditCardIcon className='h-4 w-4' />
              <span> Billing & Plans</span>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip='Log-out'
              className='gap-x-4 h-10 px-4'
              onClick={() =>
                authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      router.push("/login");
                    },
                  },
                })
              }>
              <LogOutIcon className='h-4 w-4' />
              <span> LogOut</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
