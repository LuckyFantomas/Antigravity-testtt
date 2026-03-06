"use client";

import { useState } from "react";
import { Mail, Newspaper, Globe, FlaskConical, FolderOpen, ArrowUpRight, ImageOff, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";

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
    const badgeClass = `article-source-badge badge-${sourceType}`;
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
        <article
            className={`article-card animate-in ${isExpanded ? 'is-expanded' : ''}`}
            onClick={toggleExpand}
            aria-expanded={isExpanded}
            style={{ position: "relative" }}
        >
            <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
                borderWidth={2}
            />
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

                    <div className={`article-summary-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
                        <p className="article-summary">
                            {cleanSummary(article.summary)}
                        </p>

                        {isExpanded && (
                            <div className="article-full-content animate-fade-in">
                                <div className="content-divider"></div>
                                <h4 className="detail-label">Shrnutí zprávy</h4>
                                <p className="full-text">
                                    {cleanSummary(article.content_markdown?.substring(0, 1000)) || "Detailní informace nejsou k dispozici."}...
                                </p>

                                <div className="article-actions">
                                    <a
                                        href={article.url || "#"}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn btn-primary btn-block article-external-link"
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
        </article>
    );
}
