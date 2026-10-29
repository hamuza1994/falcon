'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import LoginForm from '@/components/login-form'
import AnimatedBackground from '@/components/animated-background'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('access_token')
    if (token) {
      router.push('/dashboard')
      return
    }

    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        console.log('Service worker registration failed')
      })
    }
  }, [router])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      <AnimatedBackground />
      
      <div className="relative z-10 flex items-center justify-center w-full h-full px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          <LoginForm />
        </motion.div>
      </div>
    </div>
  )
}
