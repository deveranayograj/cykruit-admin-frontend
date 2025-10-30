"use client"
import { useState } from "react"
import { InputFields } from "@/components/login/InputFields"
import { Card, Flex } from "@radix-ui/themes"
import { Button } from "../Button/Button"
import { useAuth } from '@/hooks/useAuth';

export const LoginCard = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

// handleSubmit.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    // Optionally, you can fetch the real IP address via API call
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const ipAddress = ipData.ip || '0.0.0.0';

    // Get user agent from the browser
    const userAgent = navigator.userAgent;

    await login(email, password, ipAddress, userAgent);
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    setError(err.message || 'Login failed. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <Card size="5" className="w-full max-w-md p-6 shadow-xl">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-foreground">Login</h1>
        <p className="text-sm text-muted-foreground">
          Access your admin dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Flex direction="column" gap="3">
          <InputFields
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autocomplete="email"
          />

          <InputFields
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autocomplete="current-password"
          />

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          {loading&&(
            <p className="text-sm text-destructive text-center">Loading...</p>
          )}

          <Button type="submit" className="mt-5">
            Sign In
          </Button>
        </Flex>
      </form>
    </Card>
  )
}
