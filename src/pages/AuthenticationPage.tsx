import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, Bitcoin } from "lucide-react";

const AuthenticationPage = () => {
  console.log('AuthenticationPage loaded');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return (strength / 5) * 100;
  }, [password]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    // Simulate API call
    console.log("Attempting login with:", { email, password });
    // Simulate successful login
    setTimeout(() => {
      navigate('/'); // Redirect to dashboard on success
    }, 1000);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (passwordStrength < 60) {
      setError("Password is not strong enough.");
      return;
    }
    // Simulate API call
    console.log("Attempting registration with:", { email, password });
    // Simulate successful registration
    setTimeout(() => {
      navigate('/'); // Redirect to dashboard on success
    }, 1000);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center space-x-2 mb-8">
        <Bitcoin className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">CryptoTradeStation</h1>
      </div>
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>
        
        {error && (
            <Alert variant="destructive" className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <TabsContent value="login">
          <Card>
            <form onSubmit={handleLogin}>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>
                  Enter your credentials to access your account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input id="login-email" type="email" placeholder="trader@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="login-password">Password</Label>
                        <a href="#" className="text-sm font-medium text-primary hover:underline">
                            Forgot password?
                        </a>
                    </div>
                  <Input id="login-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Login</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        <TabsContent value="register">
          <Card>
            <form onSubmit={handleRegister}>
              <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>
                  Enter your details below to create a new account.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input id="register-email" type="email" placeholder="trader@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <Input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  {password.length > 0 && (
                     <div className="space-y-1">
                        <Progress value={passwordStrength} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                            Password strength: {passwordStrength < 40 ? 'Weak' : passwordStrength < 80 ? 'Medium' : 'Strong'}
                        </p>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full">Register</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthenticationPage;