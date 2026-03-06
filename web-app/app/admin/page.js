"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Rocket,
    Sprout,
    Zap,
    Mail,
    Newspaper,
    Globe,
    FlaskConical,
    FolderOpen,
    CheckCircle,
    XCircle,
} from "lucide-react";

const SOURCE_ICONS = {
    newsletter: Mail,
    magazine: Newspaper,
    news_site: Globe,
    research_blog: FlaskConical,
    aggregator: FolderOpen,
};

export default function AdminPage() {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scraping, setScraping] = useState(false);
    const [scrapeResult, setScrapeResult] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchSources = useCallback(async () => {
        try {
            const res = await fetch("/api/sources");
            const data = await res.json();
            setSources(data.sources || []);
        } catch (err) {
            console.error("Nepodařilo se načíst zdroje:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSources();
    }, [fetchSources]);

    const toggleSource = async (source) => {
        const newActive = !source.is_active;
        setSources((prev) =>
            prev.map((s) =>
                s.name === source.name ? { ...s, is_active: newActive } : s
            )
        );

        try {
            if (source.id) {
                await fetch("/api/sources", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: source.id, is_active: newActive }),
                });
            }
            showToast(
                `${source.name} ${newActive ? "aktivován" : "deaktivován"}`,
                "success"
            );
        } catch (err) {
            setSources((prev) =>
                prev.map((s) =>
                    s.name === source.name ? { ...s, is_active: !newActive } : s
                )
            );
            showToast("Nepodařilo se aktualizovat zdroj", "error");
        }
    };

    const updatePriority = async (source, newPriority) => {
        const priority = parseInt(newPriority, 10);
        if (isNaN(priority) || priority < 1) return;

        setSources((prev) =>
            prev.map((s) => (s.name === source.name ? { ...s, priority } : s))
        );

        try {
            if (source.id) {
                await fetch("/api/sources", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: source.id, priority }),
                });
            }
        } catch (err) {
            showToast("Nepodařilo se aktualizovat prioritu", "error");
        }
    };

    const runScrape = async (sourceId = null) => {
        setScraping(true);
        setScrapeResult(null);
        try {
            const res = await fetch("/api/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sourceId ? { source_id: sourceId } : {}),
            });
            const data = await res.json();
            setScrapeResult(data);
            showToast(
                data.message || "Scraping dokončen!",
                data.success ? "success" : "error"
            );
            fetchSources();
        } catch (err) {
            showToast("Scraping selhal: " + err.message, "error");
        } finally {
            setScraping(false);
        }
    };

    const seedSources = async () => {
        try {
            const res = await fetch("/api/sources", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "seed" }),
            });
            const data = await res.json();
            if (data.success) {
                showToast(
                    `Naseedováno ${data.count} zdrojů do databáze`,
                    "success"
                );
                fetchSources();
            } else {
                showToast(
                    "Seedování selhalo: " + (data.error || "Neznámá chyba"),
                    "error"
                );
            }
        } catch (err) {
            showToast("Seedování selhalo: " + err.message, "error");
        }
    };

    const activeSources = sources.filter((s) => s.is_active);
    const sortedSources = [...sources].sort(
        (a, b) => (a.priority || 99) - (b.priority || 99)
    );

    return (
        <>
            <div className="admin-header">
                <div>
                    <h1 className="admin-title">Správa zdrojů</h1>
                    <p className="page-subtitle">
                        {activeSources.length} z {sources.length} zdrojů aktivních
                    </p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn btn-outline" onClick={seedSources}>
                        <Sprout className="icon" /> Naplnit DB
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={() => runScrape()}
                        disabled={scraping || activeSources.length === 0}
                        id="scrape-all-btn"
                    >
                        {scraping ? (
                            <>
                                <span
                                    className="spinner"
                                    style={{ width: 14, height: 14, borderWidth: 2 }}
                                />{" "}
                                Scrapuji...
                            </>
                        ) : (
                            <>
                                <Rocket className="icon" /> Scrapovat vše
                            </>
                        )}
                    </button>
                </div>
            </div>

            {scrapeResult && (
                <div
                    className={`scrape-result ${scrapeResult.success ? "success" : "error"
                        }`}
                >
                    <strong>{scrapeResult.message}</strong>
                    {scrapeResult.results?.details?.length > 0 && (
                        <ul
                            style={{
                                marginTop: 8,
                                paddingLeft: 20,
                                listStyle: "none",
                            }}
                        >
                            {scrapeResult.results.details.map((d, i) => (
                                <li
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 6,
                                        marginTop: 4,
                                    }}
                                >
                                    {d.status === "ok" ? (
                                        <CheckCircle
                                            size={14}
                                            style={{ color: "var(--accent-primary)" }}
                                        />
                                    ) : (
                                        <XCircle
                                            size={14}
                                            style={{ color: "var(--accent-rose)" }}
                                        />
                                    )}
                                    {d.source}
                                    {d.articlesCount !== undefined &&
                                        ` — ${d.articlesCount} článků`}
                                    {d.error && ` — ${d.error}`}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            <div className="section-label">Zdroje ({sources.length})</div>

            {loading ? (
                <div className="loading-container">
                    <div className="spinner" />
                    <span>Načítání zdrojů...</span>
                </div>
            ) : (
                <div className="sources-list">
                    {sortedSources.map((source) => {
                        const Icon = SOURCE_ICONS[source.source_type] || Mail;
                        return (
                            <div
                                key={source.id || source.name}
                                className={`source-row animate-in ${!source.is_active ? "inactive" : ""
                                    }`}
                            >
                                <label className="toggle">
                                    <input
                                        type="checkbox"
                                        checked={source.is_active}
                                        onChange={() => toggleSource(source)}
                                        id={`toggle-${source.name
                                            .replace(/\s+/g, "-")
                                            .toLowerCase()}`}
                                    />
                                    <span className="toggle-slider" />
                                </label>

                                <div className="source-info">
                                    <span className="source-name">
                                        <Icon className="icon" />
                                        {source.name}
                                    </span>
                                    <span className="source-desc">{source.description}</span>
                                </div>

                                <span className="source-frequency">{source.frequency}</span>

                                <div className="source-priority">
                                    <span>#</span>
                                    <input
                                        type="number"
                                        className="priority-input"
                                        value={source.priority}
                                        onChange={(e) => updatePriority(source, e.target.value)}
                                        min="1"
                                        max="99"
                                        id={`priority-${source.name
                                            .replace(/\s+/g, "-")
                                            .toLowerCase()}`}
                                    />
                                </div>

                                <button
                                    className="btn btn-ghost"
                                    onClick={() => runScrape(source.id)}
                                    disabled={scraping || !source.is_active}
                                    title="Scrapovat tento zdroj"
                                >
                                    <Zap size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {toast && (
                <div className={`toast ${toast.type}`}>
                    {toast.type === "success" ? (
                        <CheckCircle className="icon" />
                    ) : (
                        <XCircle className="icon" />
                    )}
                    {toast.message}
                </div>
            )}
        </>
    );
}
