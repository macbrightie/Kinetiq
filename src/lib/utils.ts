import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatHealthScore(score: number): string {
    if (score >= 75) return 'Healthy';
    if (score >= 40) return 'Warning';
    return 'At Risk';
}

export function getHealthColor(score: number): string {
    if (score >= 75) return 'text-emerald-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
}
