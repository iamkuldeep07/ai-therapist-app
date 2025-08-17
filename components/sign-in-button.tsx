'use client';

import Link from "next/link";
import { Button } from "./ui/button";

interface SignInButtonProps {
    className?: string;
}

export function SignInButton({ className }: SignInButtonProps) {
    return (
        <Button 
            asChild 
            className={`bg-[hsl(150,30%,60%)] hover:bg-[hsl(150,30%,50%)] text-white ${className}`}
        >
            <Link href="/login">Sign In</Link>
        </Button>
    );
}