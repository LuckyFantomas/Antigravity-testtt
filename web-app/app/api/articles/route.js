import { NextResponse } from "next/server";
import { supabase, isConfigured } from "@/lib/supabase";

// GET /api/articles — returns articles with filtering
export async function GET(request) {
    if (!isConfigured) {
        return NextResponse.json({ articles: [], count: 0, fallback: true });
    }

    try {
        const { searchParams } = new URL(request.url);
        const sourceId = searchParams.get("source_id");
        const search = searchParams.get("search");
        const limit = parseInt(searchParams.get("limit") || "50", 10);
        const offset = parseInt(searchParams.get("offset") || "0", 10);
        const date = searchParams.get("date"); // YYYY-MM-DD

        let query = supabase
            .from("articles")
            .select("*")
            .order("scraped_at", { ascending: false })
            .range(offset, offset + limit - 1);

        if (sourceId) {
            query = query.eq("source_id", sourceId);
        }

        if (search) {
            query = query.or(
                `title.ilike.%${search}%,summary.ilike.%${search}%`
            );
        }

        if (date) {
            const startOfDay = `${date}T00:00:00.000Z`;
            const endOfDay = `${date}T23:59:59.999Z`;
            query = query.gte("scraped_at", startOfDay).lte("scraped_at", endOfDay);
        }

        const { data, error } = await query;

        if (error) {
            if (error.code === "42P01") {
                return NextResponse.json({ articles: [], count: 0, fallback: true });
            }
            throw error;
        }

        return NextResponse.json({ articles: data || [], count: data?.length || 0 });
    } catch (err) {
        console.error("[API /articles GET]", err);
        return NextResponse.json({ articles: [], count: 0, error: err.message });
    }
}
