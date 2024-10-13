'use client';
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton, SignedOut, SignedIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const { isSignedIn, user } = useUser();

    return (
        <div className="flex items-center justify-end mt-4 mr-4">
            <SignedOut>
                <SignInButton />
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>
        
            <div className="md:hidden">
                <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
            </div>
        </div>
    );
}

