import React from 'react';
import { cn, getHealthColor } from '@/lib/utils';
import { TriangleAlert, ChevronRight, Activity } from "lucide-react";
import Link from 'next/link';

interface ClientCreditCardProps {
    client: {
        id: string;
        name: string;
        healthScore: number;
        riskStatus: string;
        lastActive: string;
        image?: string;
    };
}

export function ClientCreditCard({ client }: ClientCreditCardProps) {
    return (
        <Link href={`/clients/${client.id}`} className="block">
            <div className="glass p-5 rounded-2xl card-hover flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {client.image ? (
                            <img 
                                src={client.image} 
                                alt={client.name} 
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/5 shadow-xl"
                            />
                        ) : (
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center bg-opacity-10 text-xs font-bold",
                                client.healthScore >= 75 ? "bg-emerald-500 text-emerald-500" : client.healthScore >= 40 ? "bg-amber-500 text-amber-500" : "bg-rose-500 text-rose-500"
                            )}>
                                {client.name.split(' ').map(n => n[0]).join('')}
                            </div>
                        )}
                        <div className={cn(
                            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center",
                            client.healthScore >= 75 ? "bg-emerald-500" : client.healthScore >= 40 ? "bg-amber-500" : "bg-rose-500"
                        )}>
                            <Activity className="w-2 h-2 text-black" />
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-lg">{client.name}</h3>
                        <p className="text-sm text-neutral-400">Last active: {client.lastActive}</p>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    <div className="text-right">
                        <div className={cn("text-2xl font-medium", getHealthColor(client.healthScore))}>
                            {client.healthScore}
                        </div>
                        <div className="text-xs uppercase tracking-wider text-neutral-500 font-medium">
                            Health Score
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {client.healthScore < 75 && (
                            <TriangleAlert className={cn("w-5 h-5", client.healthScore < 40 ? "text-rose-500" : "text-amber-500")} />
                        )}
                        <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </Link>
    );
}
