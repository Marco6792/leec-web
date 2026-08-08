"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";

const COOKIE_CONSENT_COOKIE = "cookie_consent";
const COOKIE_CONSENT_MAX_AGE = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string, maxAge: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() ?? null;
  }
  return null;
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = getCookie(COOKIE_CONSENT_COOKIE);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie(COOKIE_CONSENT_COOKIE, "accepted", COOKIE_CONSENT_MAX_AGE);
    setVisible(false);
  };

  const handleReject = () => {
    setCookie(COOKIE_CONSENT_COOKIE, "rejected", COOKIE_CONSENT_MAX_AGE);
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-popover border rounded-2xl shadow-lg p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 mt-0.5">
            <Cookie className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">We use cookies</p>
            <p className="text-sm text-muted-foreground mt-1">
              This website uses cookies to ensure you get the best experience.
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleReject}
            className="shrink-0 cursor-pointer"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button size="sm" onClick={handleAccept} className="flex-1 cursor-pointer">
            Accept
          </Button>
          <Button size="sm" variant="outline" onClick={handleReject} className="flex-1 cursor-pointer">
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}
