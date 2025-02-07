"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function AdminRegister() {
    const router = useRouter();
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    
    const { username, password } = formData;

  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      // Reset messages
      setError('');
      setSuccess('');
  
      // Basic validation
      if (username.trim().length < 4) {
        setError('Username must be at least 4 characters long.');
        return;
      }
  
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
  
      try {
        const res = await fetch('/api/admin/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
  
        const data = await res.json();
  
        if (data.success) {
          setSuccess('Admin registered successfully! Redirecting to login...');
          // Redirect after a short delay
          setTimeout(() => {
            router.push('/admin');
          }, 2000);
        } else {
          setError(data.message || 'Registration failed.');
        }
      } catch (err) {
        console.error('Registration Error:', err);
        setError('An unexpected error occurred.');
      }
    };

  return (
    (<div
      className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Industry Pro Sphere
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Sign up to Industry Pro Sphere if you can because we don&apos;t have a login flow
        yet
      </p>
      <form className="my-8" onSubmit={handleSubmit}>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}
        <div
          className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="username">Username</Label>
            <Input id="username"
               name="username"
               value={username}
              onChange={handleChange}
              required placeholder="Tyler" type="text" />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="password">Password</Label>
            <Input id="password"
               name="password"
               value={password}
              onChange={handleChange}
              required placeholder="••••••••" type="password" />
          </LabelInputContainer>
        </div>


        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit">
          Sign up &rarr;
          <BottomGradient />
        </button>

      </form>
    </div>)
  );
}

const BottomGradient = () => {
  return (<>
    <span
      className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
    <span
      className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
  </>);
};

const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    (<div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>)
  );
};
