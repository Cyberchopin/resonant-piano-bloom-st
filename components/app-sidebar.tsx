"use client"

import { useState, useEffect } from "react"
import { Home, HelpCircle, BookOpen, Users, User, Bell, X, Music } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"

const menuItems = [
  {
    title: "Home",
    icon: Home,
    href: "/",
  },
  {
    title: "Help",
    icon: HelpCircle,
    href: "/help",
  },
  {
    title: "Learning",
    icon: BookOpen,
    href: "/learning",
  },
  {
    title: "Community",
    icon: Users,
    href: "/community",
  },
  {
    title: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    title: "Piano Heartbeat",
    icon: Music,
    href: "/piano-heartbeat",
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New message from Dr. Sarah",
      description: "Regarding your upcoming appointment",
      time: "5 minutes ago",
      read: false,
      type: "message",
    },
    {
      id: 2,
      title: "Learning milestone achieved!",
      description: "You've completed Communication Basics",
      time: "2 hours ago",
      read: false,
      type: "achievement",
    },
    {
      id: 3,
      title: "New community event",
      description: "Sensory-Friendly Playdate this weekend",
      time: "Yesterday",
      read: true,
      type: "event",
    },
    {
      id: 4,
      title: "Forum reply",
      description: "Jennifer replied to your post about sensory toys",
      time: "2 days ago",
      read: true,
      type: "forum",
    },
  ])

  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const count = notifications.filter((notification) => !notification.read).length
    setUnreadCount(count)
  }, [notifications])

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const clearNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  return (
    <Sidebar className="border-r border-r-pink-100">
      <SidebarHeader className="flex flex-col items-center py-6 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-2xl font-bold text-pink-500">Blossom</h1>
        </div>
        <Avatar className="h-16 w-16 mb-3 border-2 border-pink-200 shadow-sm">
          <AvatarImage
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a%20-%20Copy-vpiZ3u9PBMZn9m2huvRbb7hSk2savT.png"
            alt="Amy"
          />
          <AvatarFallback>AM</AvatarFallback>
        </Avatar>
        <p className="text-sm font-medium mb-1">Amy Miller</p>
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200">Level 4</Badge>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={item.title}
                className={pathname === item.href ? "bg-pink-100 text-pink-700" : "hover:bg-pink-50"}
              >
                <Link href={item.href} className="flex items-center">
                  <item.icon className="mr-2" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-pink-100">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full relative hover:bg-pink-50 hover:text-pink-600 border-pink-200"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-8 hover:text-pink-600">
                  Mark all as read
                </Button>
              )}
            </div>
            <ScrollArea className="h-[300px]">
              {notifications.length > 0 ? (
                <div className="divide-y">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 relative ${notification.read ? "bg-white" : "bg-pink-50"}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 -mt-1 -mr-1 text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            clearNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                      {!notification.read && (
                        <span className="absolute top-4 right-4 h-2 w-2 rounded-full bg-pink-500"></span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500">No notifications</p>
                </div>
              )}
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </SidebarFooter>
    </Sidebar>
  )
}
