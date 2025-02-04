"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import universalFetcher from '@/lib/fetcher'
import { useAuth } from '../../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setName('')
    setEmail('')
    setLoading(true)
    try {
      // use the swr library along fetcher function to make a POST request
      const res = await universalFetcher({ url: '/auth/login', method: 'POST', body: { name, email } })
      // console.log(res);
      setLoading(false);
      login();
    } catch (err) {
      if (err.message === "Unauthorized") {
        // Use next/navigation's router to redirect to login.
        router.push("/login");
      } else {
        console.error(err.message);
        setError('Login failed. Check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
