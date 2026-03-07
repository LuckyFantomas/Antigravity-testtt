"use client";

import { useState } from "react";
import { Mail, Newspaper, Globe, FlaskConical, FolderOpen, ArrowUpRight, ImageOff, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion } from "motion/react";

const SOURCE_ICONS = {
    newsletter: Mail,
    magazine: Newspaper,
    news_site: Globe,
    research_blog: FlaskConical,
    aggregator: FolderOpen,
};

export default function ArticleCard({ article }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const sourceType = article.tags?.[0] || "newsletter";

    const sourceStyles = {
        newsletter: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
        magazine: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
        news_site: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
        research_blog: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
        aggregator: "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    };
    const styleClass = sourceStyles[sourceType] || sourceStyles.newsletter;
    const badgeClass = `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border backdrop-blur-md transition-colors ${styleClass}`;

    const Icon = SOURCE_ICONS[sourceType] || Mail;

    const timeAgo = (dateStr) => {
        if (!dateStr) return "";
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `před ${mins} min`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `před ${hours} h`;
        const days = Math.floor(hours / 24);
        return `před ${days} d`;
    };

    // On-the-fly cleaning to ensure premium look
    const cleanSummary = (text) => {
        if (!text) return "";
        return text
            .replace(/\\/g, '')
            .replace(/\|/g, ' ')
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // [text](url) -> text
            .replace(/!\[.*?\]\([^\)]+\)/g, '')       // remove images
            .replace(/MediaComponents\S*/gi, '')
            .replace(/CloseClose/gi, '')
            .replace(/ShareCopy LinkEmbed/gi, '')
            .replace(/Go To ShowCopy LinkEmbed Show/gi, '')
            .replace(/See how your data is managed/gi, '')
            .replace(/Apple Podcasts/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const toggleExpand = (e) => {
        // Don't expand if clicking the actual external link
        if (e.target.closest('.article-external-link')) return;
        setIsExpanded(!isExpanded);
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
            className={`article-card ${isExpanded ? 'is-expanded' : ''}`}
            onClick={toggleExpand}
            aria-expanded={isExpanded}
            style={{ position: "relative", overflow: "visible" }}
        >
            <GlowingEffect
                spread={50}
                glow={true}
                disabled={false}
                proximity={120}
                inactiveZone={0.01}
                borderWidth={3}
            />
            <div className="article-content-wrapper" style={{ borderRadius: "inherit", overflow: "hidden", display: "flex", flexDirection: "column", height: "100%", flex: 1, position: "relative", zIndex: 1 }}>
                <div className="article-image-container">
                    {article.image_url ? (
                        <div className="article-image">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                loading="lazy"
                                onError={(e) => {
                                    e.target.style.display = "none";
                                    e.target.parentElement.classList.add("image-error");
                                    e.target.parentElement.innerHTML = '<div class="image-placeholder"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-image-off"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="14.5" x2="14.5" y1="21" y2="21"/><path d="M4.14 11.72l5.1-5.1a2 2 0 0 1 2.81 0l.13.13"/><path d="M13.47 13.47l4.33-4.33a2 2 0 0 1 2.82 0L22 10.5"/><path d="M6.79 6.79L5 8.58a2 2 0 0 0 0 2.82L9.24 15.66a2 2 0 0 0 2.82 0L13.12 14.6"/><path d="M21 21H3V3l1.1-.1"/><path d="M21 16V5a2 2 0 0 0-2-2H9"/></svg></div>';
                                }}
                            />
                        </div>
                    ) : (
                        <div className="article-image image-placeholder">
                            <ImageOff size={24} />
                            <span className="placeholder-text">Obrázek nenalezen</span>
                        </div>
                    )}
                    <div className="article-expand-hint">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                </div>

                <div className="article-body">
                    <div className="article-body-content">
                        <div className="article-header-row">
                            <div className={badgeClass}>
                                <Icon size={12} />
                                <span>{article.source_name || "Neznámý"}</span>
                            </div>
                            <span className="article-date-top">{timeAgo(article.scraped_at)}</span>
                        </div>

                        <h3 className="article-title">{article.title}</h3>

                        <div className={`article-summary-container mt-3 ${isExpanded ? 'expanded' : 'collapsed'}`}>
                            {/* Skrýt delší summary, pokud není rozbaleno, nebo ukázat uříznuté na 2 řádky */}
                            <p className={`article-summary text-sm text-gray-600 dark:text-gray-300 ${!isExpanded ? "line-clamp-2 opacity-80" : "mb-4"}`}>
                                {cleanSummary(article.summary)}
                            </p>

                            {isExpanded && (
                                <div className="article-full-content animate-fade-in mt-4">
                                    <div className="content-divider h-px bg-gray-200 dark:bg-gray-800 my-4"></div>
                                    <h4 className="detail-label text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Kompletní shrnutí</h4>
                                    <p className="full-text text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-5">
                                        {cleanSummary(article.summary) || "Detailní informace nejsou k dispozici."}
                                    </p>

                                    <div className="article-actions mt-4">
                                        <a
                                            href={article.url || "#"}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-primary btn-block article-external-link py-2 flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            Přejít na originální článek <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isExpanded && (
                        <div className="article-meta-footer">
                            <span className="expand-label">Rozbalit pro shrnutí</span>
                            <ChevronDown size={14} className="animate-bounce-subtle" />
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
}
