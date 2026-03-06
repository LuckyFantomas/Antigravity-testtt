"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
    const pathname = usePathname();

    return (
        <nav className="navbar">
            <Link href="/" className="navbar-brand">
                <span className="navbar-logo">⚡</span>
                <span className="navbar-title">AI News Scraper</span>
            </Link>
            <div className="navbar-nav">
                <Link
                    href="/"
                    className={`nav-link ${pathname === "/" ? "active" : ""}`}
                >
                    📊 Dashboard
                </Link>
                <Link
                    href="/admin"
                    className={`nav-link ${pathname === "/admin" ? "active" : ""}`}
                >
                    ⚙️ Sources
                </Link>
            </div>
        </nav>
    );
}
