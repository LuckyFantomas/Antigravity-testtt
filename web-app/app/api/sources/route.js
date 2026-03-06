import { NextResponse } from "next/server";
import { supabase, isConfigured } from "@/lib/supabase";
import { SOURCES_SEED } from "@/lib/sources-data";

// GET /api/sources — returns all sources
export async function GET() {
    // If Supabase is not configured, return seed data directly
    if (!isConfigured) {
        return NextResponse.json({ sources: SOURCES_SEED, fallback: true });
    }

    try {
        const { data, error } = await supabase
            .from("sources")
            .select("*")
            .order("priority", { ascending: true });

        if (error) {
            if (error.code === "42P01" || error.message?.includes("does not exist")) {
                return NextResponse.json({ sources: SOURCES_SEED, fallback: true });
            }
            throw error;
        }

        if (!data || data.length === 0) {
            return NextResponse.json({ sources: SOURCES_SEED, fallback: true });
        }

        return NextResponse.json({ sources: data });
    } catch (err) {
        console.error("[API /sources GET]", err);
        return NextResponse.json({ sources: SOURCES_SEED, fallback: true });
    }
}

// POST /api/sources — seed sources into Supabase from sources-data.js
export async function POST(request) {
    try {
        const body = await request.json();

        // Seed all sources
        if (body.action === "seed") {
            const { data, error } = await supabase
                .from("sources")
                .upsert(SOURCES_SEED, { onConflict: "url" })
                .select();

            if (error) throw error;
            return NextResponse.json({ success: true, count: data.length, sources: data });
        }

        return NextResponse.json({ error: "Neznámá akce" }, { status: 400 });
    } catch (err) {
        console.error("[API /sources POST]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// PATCH /api/sources — update a source (toggle active, change priority)
export async function PATCH(request) {
    try {
        const body = await request.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: "Chybí ID zdroje" }, { status: 400 });
        }

        const { data, error } = await supabase
            .from("sources")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json({ success: true, source: data });
    } catch (err) {
        console.error("[API /sources PATCH]", err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
