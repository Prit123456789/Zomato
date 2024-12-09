'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { createClient } from '@supabase/supabase-js'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const channel = supabase
      .channel.channel('public:canceled_orders')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'canceled_orders' }, (payload) => {
        console.log('New canceled order:', payload.new);
        // Here you would update your state or trigger a re-fetch of orders
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <html lang="en">
      <body className={inter.className + " bg-gray-100"}>{children}</body>
    </html>
  )
}

