"use client";

import { Search } from "lucide-react";

export default function FilterBar({
    search,
    onSearchChange,
    sourceFilter,
    onSourceFilterChange,
    sources,
}) {
    return (
        <div className="filter-bar">
            <div className="top-bar-search">
                <Search className="search-icon" />
                <input
                    type="text"
                    placeholder="Hledat články..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    id="search-articles"
                />
            </div>
            <select
                className="filter-select"
                value={sourceFilter}
                onChange={(e) => onSourceFilterChange(e.target.value)}
                id="filter-source"
            >
                <option value="all">Všechny zdroje</option>
                {sources.map((source) => (
                    <option key={source.name} value={source.name}>
                        {source.name}
                    </option>
                ))}
            </select>
        </div>
    );
}
