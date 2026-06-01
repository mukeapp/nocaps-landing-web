'use client'

import { useState } from 'react'
import subscriptions from '../../../public/assets/static-data/Subscriptions.json'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import SectionBadge from '@/components/ui/section-badge'
import Container from '@/components/global/container'
import Wrapper from '@/components/global/wrapper'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'
import Link from 'next/link'

const visiblePlans = subscriptions.filter(p => p.isVisible)
const activeTypes = Array.from(new Set(visiblePlans.map(p => p.billingType)))

export default function PricingSection() {
    const [selected, setSelected] = useState(activeTypes[0])
    const plans = visiblePlans.filter(p => p.billingType === selected)

    return (
        <Wrapper id="pricing" className="flex flex-col items-center justify-center py-12 relative scroll-mt-20">
            <div className="hidden md:block absolute top-0 -right-1/3 w-72 h-72 bg-blue-500 rounded-full blur-[10rem] -z-10" />

            <Container>
                <div className="max-w-md mx-auto text-start md:text-center">
                    <SectionBadge title="Pricing" />
                    <h2 className="text-3xl lg:text-4xl font-semibold mt-6">
                        Unlock the right plan for your business
                    </h2>
                    <p className="text-muted-foreground mt-6">
                        Choose the best plan and start building better habits today
                    </p>

                    {activeTypes.length > 1 && (
                        <div className="flex items-center justify-center mt-8">
                            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                                {activeTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setSelected(type)}
                                        className={cn(
                                            'px-5 py-2 rounded-md text-sm font-medium capitalize transition-all',
                                            selected === type
                                                ? 'bg-background shadow-sm text-foreground'
                                                : 'text-muted-foreground hover:text-foreground'
                                        )}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Container>

            <Container className="flex items-center justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full md:gap-6 py-10 md:py-20 max-w-5xl">
                    {plans.map(plan => (
                        <Card
                            key={plan.id}
                            className={cn(
                                'flex flex-col w-full border-neutral-700',
                                plan.isPopular && 'border-2 border-primary'
                            )}
                        >
                            <CardHeader className="border-b border-border">
                                <div className="flex items-center justify-between">
                                    <span>{plan.name}</span>
                                    {plan.isPopular && (
                                        <span className="text-xs font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-md uppercase tracking-wide">
                                            Popular
                                        </span>
                                    )}
                                </div>
                                <CardTitle>
                                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                                    {plan.price > 0 && (
                                        <span className="text-sm font-normal text-muted-foreground"> /mo</span>
                                    )}
                                </CardTitle>
                                <CardDescription>{plan.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="pt-6 space-y-3">
                                {plan.features.map(feature => (
                                    <div key={feature} className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 fill-primary text-primary" />
                                        <p>{feature}</p>
                                    </div>
                                ))}
                            </CardContent>

                            <CardFooter className="mt-auto flex flex-col gap-2">
                                <Link
                                    href="#"
                                    className={cn(
                                        'w-full text-center text-primary-foreground bg-primary p-2 rounded-md text-sm font-medium',
                                        !plan.isPopular && '!bg-foreground !text-background'
                                    )}
                                >
                                    {plan.price === 0 ? 'Get Started for Free' : 'Get Started'}
                                </Link>
                                {plan.footerNote && (
                                    <p className="text-xs text-muted-foreground text-center">{plan.footerNote}</p>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </Container>
        </Wrapper>
    )
}
