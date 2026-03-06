"use client";

import { Newspaper, Plug, Clock, Database, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.96 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    },
};

export default function StatsOverview({ stats }) {
    return (
        <motion.div
            className="stats-grid"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.div variants={itemVariants} className="stat-card green">
                <div className="stat-card-header">
                    <span className="stat-card-label">Články dnes</span>
                    <Newspaper className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{stats.totalArticles}</div>
                <div className="stat-card-sub">
                    <TrendingUp size={12} /> Scrapovaný obsah
                </div>
            </motion.div>

            <motion.div variants={itemVariants} className="stat-card blue">
                <div className="stat-card-header">
                    <span className="stat-card-label">Aktivní zdroje</span>
                    <Plug className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{stats.activeSources}</div>
                <div className="stat-card-sub">Připojené feedy</div>
            </motion.div>

            <motion.div variants={itemVariants} className="stat-card teal">
                <div className="stat-card-header">
                    <span className="stat-card-label">Poslední scrape</span>
                    <Clock className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{stats.lastScrape || "—"}</div>
                <div className="stat-card-sub">Čas posledního běhu</div>
            </motion.div>

            <motion.div variants={itemVariants} className="stat-card amber">
                <div className="stat-card-header">
                    <span className="stat-card-label">Celkem zdrojů</span>
                    <Database className="stat-card-icon" />
                </div>
                <div className="stat-card-value">{stats.totalSources}</div>
                <div className="stat-card-sub">V databázi</div>
            </motion.div>
        </motion.div>
    );
}
