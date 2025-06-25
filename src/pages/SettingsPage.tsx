import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import LeftSidebar from '@/components/layout/LeftSidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from "sonner";
import { Trash2 } from 'lucide-react';

// Zod schema for the profile form
const profileFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }).max(30, {
    message: "Username must not be longer than 30 characters.",
  }),
  email: z.string({
    required_error: "Please enter an email.",
  }).email(),
  bio: z.string().max(160).min(4).optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Mock data for API keys
const apiKeys = [
    { id: 'prod_1a2b3c4d5e6f7g8h', permissions: 'Read-only', created: '2023-10-26' },
    { id: 'dev_9i8j7k6l5m4n3o2p', permissions: 'Read, Trade', created: '2023-11-15' },
];

const SettingsPage = () => {
  console.log('SettingsPage loaded');

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: 'CryptoTrader',
      email: 'trader@example.com',
      bio: "Diamond handing since 2017.",
    },
    mode: 'onChange',
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log('Profile data submitted:', data);
    toast.success("Profile updated successfully!");
  }
  
  function onPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
      console.log('Password change submitted');
      toast.success("Password updated successfully!");
  }
  
  function onGenerateApiKey() {
      console.log('Generating new API key');
      toast.info("New API key generated.", { description: "Be sure to store it securely. You will not be able to see it again."});
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex-1 flex container mx-auto">
        <LeftSidebar />
        <main className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="space-y-4">
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences.</p>
          </div>
          <Separator className="my-6" />

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="api">API Keys</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>This is how others will see you on the site.</CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onProfileSubmit)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Your username" {...field} />
                            </FormControl>
                            <FormDescription>This is your public display name.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormDescription>Your email address is not displayed publicly.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                               <Textarea
                                placeholder="Tell us a little bit about yourself"
                                className="resize-none"
                                {...field}
                                />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter className="border-t px-6 py-4">
                      <Button type="submit">Save changes</Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
                <Card>
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                        <CardDescription>Change your password and manage account security.</CardDescription>
                    </CardHeader>
                    <form onSubmit={onPasswordSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Add an extra layer of security to your account.
                                    </p>
                                </div>
                                <Switch aria-label="Toggle 2FA" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button type="submit">Save Security Settings</Button>
                        </CardFooter>
                    </form>
                </Card>
            </TabsContent>
            
            {/* API Keys Tab */}
            <TabsContent value="api">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>API Keys</CardTitle>
                            <CardDescription>Manage your API keys for programmatic trading.</CardDescription>
                        </div>
                        <Button onClick={onGenerateApiKey}>Generate New Key</Button>
                    </CardHeader>
                    <CardContent>
                       <Table>
                           <TableHeader>
                               <TableRow>
                                   <TableHead>Key (prefix)</TableHead>
                                   <TableHead>Permissions</TableHead>
                                   <TableHead>Created</TableHead>
                                   <TableHead className="text-right">Actions</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                                {apiKeys.map(key => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-mono">{key.id.substring(0, 12)}...</TableCell>
                                        <TableCell>{key.permissions}</TableCell>
                                        <TableCell>{key.created}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => toast.error(`API key ${key.id.substring(0,8)}... has been revoked.`)}>
                                                <Trash2 className="h-4 w-4 text-destructive"/>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                           </TableBody>
                       </Table>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default SettingsPage;