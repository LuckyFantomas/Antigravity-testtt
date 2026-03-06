"use client";

import { useState, useEffect, useCallback } from "react";
import StatsOverview from "@/components/StatsOverview";
import FilterBar from "@/components/FilterBar";
import ArticleCard from "@/components/ArticleCard";
import { Inbox } from "lucide-react";

export default function DashboardPage() {
  const [articles, setArticles] = useState([]);
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [stats, setStats] = useState({
    totalArticles: 0,
    activeSources: 0,
    lastScrape: "—",
    totalSources: 0,
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [articlesRes, sourcesRes] = await Promise.all([
        fetch("/api/articles").then((r) => r.json()),
        fetch("/api/sources").then((r) => r.json()),
      ]);

      setArticles(articlesRes.articles || []);
      const srcList = sourcesRes.sources || [];
      setSources(srcList);

      const activeSources = srcList.filter((s) => s.is_active);
      const latestScrape = srcList
        .filter((s) => s.last_scraped_at)
        .sort(
          (a, b) =>
            new Date(b.last_scraped_at) - new Date(a.last_scraped_at)
        )[0];

      setStats({
        totalArticles: articlesRes.articles?.length || 0,
        activeSources: activeSources.length,
        lastScrape: latestScrape
          ? new Date(latestScrape.last_scraped_at).toLocaleTimeString(
            "cs-CZ",
            { hour: "2-digit", minute: "2-digit" }
          )
          : "—",
        totalSources: srcList.length,
      });
    } catch (err) {
      console.error("Nepodařilo se načíst data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      !search ||
      article.title?.toLowerCase().includes(search.toLowerCase()) ||
      article.summary?.toLowerCase().includes(search.toLowerCase());

    const matchesSource =
      sourceFilter === "all" || article.source_name === sourceFilter;

    return matchesSearch && matchesSource;
  });

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Přehled</h1>
        <p className="page-subtitle">
          Denní kurátorský výběr novinek z nejlepších AI zdrojů
        </p>
      </div>

      <StatsOverview stats={stats} />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        sourceFilter={sourceFilter}
        onSourceFilterChange={setSourceFilter}
        sources={sources.filter((s) => s.is_active)}
      />

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
          <span>Načítání článků...</span>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="empty-state">
          <Inbox className="empty-icon" />
          <div className="empty-title">Zatím žádné články</div>
          <div className="empty-desc">
            {articles.length === 0
              ? "Přejdi do sekce Zdroje, aktivuj preferované zdroje a spusť scraping."
              : "Zkus upravit filtry — žádné články neodpovídají aktuálním kritériím."}
          </div>
        </div>
      ) : (
        <div className="articles-grid">
          {filteredArticles.map((article, idx) => (
            <ArticleCard key={article.id || idx} article={article} />
          ))}
        </div>
      )}
    </>
  );
}
