"use client";

import { Newspaper, Plug, Clock, Database, TrendingUp } from "lucide-react";

export default function StatsOverview({ stats }) {
    return (
        <div className="stats-grid">
            <div className="stat-card green animate-in">
                <div className="stat-card-header">
                    <span className="stat-card-label">Články dnes</span>
                    <Newspaper className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{stats.totalArticles}</div>
                <div className="stat-card-sub">
                    <TrendingUp size={12} /> Scrapovaný obsah
                </div>
            </div>

            <div className="stat-card blue animate-in">
                <div className="stat-card-header">
                    <span className="stat-card-label">Aktivní zdroje</span>
                    <Plug className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{stats.activeSources}</div>
                <div className="stat-card-sub">Připojené feedy</div>
            </div>

            <div className="stat-card teal animate-in">
                <div className="stat-card-header">
                    <span className="stat-card-label">Poslední scrape</span>
                    <Clock className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{stats.lastScrape || "—"}</div>
                <div className="stat-card-sub">Čas posledního běhu</div>
            </div>

            <div className="stat-card amber animate-in">
                <div className="stat-card-header">
                    <span className="stat-card-label">Celkem zdrojů</span>
                    <Database className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{stats.totalSources}</div>
                <div className="stat-card-sub">V databázi</div>
            </div>
        </div>
    );
}
