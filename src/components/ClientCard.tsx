import React from 'react';
import { cn, getHealthColor } from '@/lib/utils';
import { Activity, AlertTriangle, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ClientCardProps {
    client: {
        id: string;
        name: string;
        healthScore: number;
        riskStatus: string;
        lastActive: string;
    };
}

export function ClientCard({ client }: ClientCardProps) {
    return (
        <Link href={`/clients/${client.id}`} className="block">
            <div className="glass p-5 rounded-2xl card-hover flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center bg-opacity-10",
                        client.healthScore >= 75 ? "bg-emerald-500" : client.healthScore >= 40 ? "bg-amber-500" : "bg-rose-500"
                    )}>
                        <Activity className={cn("w-6 h-6", getHealthColor(client.healthScore))} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg">{client.name}</h3>
                        <p className="text-sm text-neutral-400">Last active: {client.lastActive}</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <div className={cn("text-2xl font-bold", getHealthColor(client.healthScore))}>
                            {client.healthScore}
                        </div>
                        <div className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                            Health Score
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {client.healthScore < 75 && (
                            <AlertTriangle className={cn("w-5 h-5", client.healthScore < 40 ? "text-rose-500" : "text-amber-500")} />
                        )}
                        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
