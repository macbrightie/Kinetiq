"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { SkipForward } from "lucide-react";

export function OnboardingSkipButton() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80"
            style={{ color: "var(--muted-foreground)" }}
        >
            <SkipForward size={13} />
            Skip for now
        </button>
    );
}
