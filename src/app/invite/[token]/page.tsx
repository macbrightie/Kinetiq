"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard, CreditCardHeader, CreditCardTitle, CreditCardDescription, CreditCardContent, CreditCardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';

export default function ClientOnboardingPage() {
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        weight: '',
        goal: '',
        level: ''
    });
    const router = useRouter();

    const handleFinish = () => {
        // Save profile data and redirect
        router.push('/client/dashboard');
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-black p-4">
            {step === 1 ? (
                <CreditCard className="w-full max-w-lg bg-neutral-900 border-neutral-800">
                    <CreditCardHeader className="text-center">
                        <CreditCardTitle className="text-3xl text-white">Welcome to Kinetiq</CreditCardTitle>
                        <CreditCardDescription className="text-neutral-400">
                            You've been invited by your coach to track your progress.
                        </CreditCardDescription>
                    </CreditCardHeader>
                    <CreditCardContent className="flex justify-center py-8">
                        <div className="w-20 h-20 rounded-full bg-fuchsia-500/10 flex items-center justify-center">
                            <span className="text-3xl">👋</span>
                        </div>
                    </CreditCardContent>
                    <CreditCardFooter>
 <Button
                            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                            onClick={() => setStep(2)}
                        >
                            Accept Invitation
                        </Button>
                    </CreditCardFooter>
                </CreditCard>
            ) : (
                <CreditCard className="w-full max-w-lg bg-neutral-900 border-neutral-800">
                    <CreditCardHeader>
                        <CreditCardTitle className="text-2xl text-white">Create your profile</CreditCardTitle>
                        <CreditCardDescription className="text-neutral-400">Tell us a bit about your fitness journey.</CreditCardDescription>
                    </CreditCardHeader>
                    <CreditCardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Current Weight (kg)</Label>
                            <Input
                                type="number"
                                placeholder="75"
                                className="bg-neutral-800 border-neutral-700 text-white"
                                onChange={(e) => setData({ ...data, weight: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Fitness Goal</Label>
                            <Select onValueChange={(v) => setData({ ...data, goal: v })}>
                                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                                    <SelectValue placeholder="Select goal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                                    <SelectItem value="endurance">Endurance</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-neutral-300">Fitness Level</Label>
                            <Select onValueChange={(v) => setData({ ...data, level: v })}>
                                <SelectTrigger className="bg-neutral-800 border-neutral-700 text-white">
                                    <SelectValue placeholder="Select level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CreditCardContent>
                    <CreditCardFooter>
 <Button
                            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                            onClick={handleFinish}
                            disabled={!data.weight || !data.goal || !data.level}
                        >
                            Get Started
                        </Button>
                    </CreditCardFooter>
                </CreditCard>
            )}
        </div>
    );
}
