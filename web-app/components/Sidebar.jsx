"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import {
    LayoutDashboard,
    Settings,
    Zap,
    Sun,
    Moon,
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="sidebar">
            <Link href="/" className="sidebar-brand">
                <div className="sidebar-brand-icon">
                    <Zap size={18} />
                </div>
                <span className="sidebar-brand-text">AI News Scraper</span>
            </Link>

            <div className="sidebar-section">
                <div className="sidebar-section-label">Menu</div>
                <Link
                    href="/"
                    className={`sidebar-link ${pathname === "/" ? "active" : ""}`}
                >
                    <LayoutDashboard className="icon" />
                    <span>Přehled</span>
                </Link>
                <Link
                    href="/admin"
                    className={`sidebar-link ${pathname === "/admin" ? "active" : ""}`}
                >
                    <Settings className="icon" />
                    <span>Zdroje</span>
                </Link>
            </div>

            <div className="sidebar-spacer" />

            <div className="sidebar-footer">
                <div className="theme-toggle-row">
                    <span>Vzhled</span>
                    <button
                        className="theme-toggle-btn"
                        onClick={toggleTheme}
                        aria-label="Přepnout téma"
                        id="theme-toggle"
                    >
                        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                </div>
            </div>
        </aside>
    );
}
