"use client";

import { Box, Lock, Search, Settings, Sparkles } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { cn } from "@/lib/utils";

export function GlowingEffectDemo() {
    return (
        <div className="demo-container">
            <ul className="demo-grid">
                <GridItem
                    area="demo-area-1"
                    icon={<Box className="demo-icon" />}
                    title="Curated Sources"
                    description="Reliable data pulled straight from industry leading sources"
                />
                <GridItem
                    area="demo-area-2"
                    icon={<Settings className="demo-icon" />}
                    title="State of the art Engine"
                    description="A powerful scraping system working effortlessly behind the scenes"
                />
                <GridItem
                    area="demo-area-3"
                    icon={<Lock className="demo-icon" />}
                    title="Fully Private"
                    description="Data managed seamlessly via Supabase backend and Edge Functions"
                />
                <GridItem
                    area="demo-area-4"
                    icon={<Sparkles className="demo-icon" />}
                    title="Premium Design"
                    description="Smooth Framer-like interactions making your dashboard look exceptional"
                />
                <GridItem
                    area="demo-area-5"
                    icon={<Search className="demo-icon" />}
                    title="Fast Search (Coming Soon)"
                    description="Navigate through vast amounts of information in an absolute instant"
                />
            </ul>
        </div>
    );
}

const GridItem = ({ area, icon, title, description }) => {
    return (
        <li className={cn("demo-grid-item", area)}>
            <div className="demo-grid-wrapper">
                <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                    borderWidth={3}
                />
                <div className="demo-grid-content">
                    <div className="demo-grid-inner">
                        <div className="demo-icon-wrapper">
                            {icon}
                        </div>
                        <div className="demo-text-wrapper">
                            <h3 className="demo-title">
                                {title}
                            </h3>
                            <h2 className="demo-description">
                                {description}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    );
};
