import React from 'react'

export default function Loading() {
    return (
        <div className="w-full flex flex-col gap-6 animate-pulse">
            {/* Stat Cards Skeleton */}
            <div className="bg-background border border-border w-full rounded-3xl py-6 px-6 gap-6 flex flex-col shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-muted/20 rounded-full" />
                    <div className="h-8 w-48 bg-muted/10 rounded-md" />
                </div>
                <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-[104px] bg-background border border-border rounded-2xl w-full" />
                    ))}
                </div>
            </div>

            {/* Charts Skeleton */}
            <div className="w-full flex flex-col gap-4">
                {/* Timeline Chart Skeleton */}
                <div className="h-[350px] bg-background border border-border rounded-2xl w-full shadow-sm" />
                
                {/* Status & Sentiment Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-[350px] bg-background border border-border rounded-2xl w-full shadow-sm" />
                    <div className="h-[350px] bg-background border border-border rounded-2xl w-full shadow-sm" />
                </div>

                {/* Category Skeleton */}
                <div className="h-[350px] bg-background border border-border rounded-2xl w-full shadow-sm" />
                
                {/* WordCloud Skeleton */}
                <div className="h-[400px] bg-background border border-border rounded-2xl w-full shadow-sm" />
            </div>
        </div>
    )
}