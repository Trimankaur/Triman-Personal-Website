"use client";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useMemo, useState, useEffect } from "react";

// Intensity levels using CSS variable accent color
const intensityClasses = [
  "graph-empty",  // 0 - empty
  "graph-1",      // 1 entry
  "graph-2",      // 2 entries
  "graph-3",      // 3 entries
  "graph-4",      // 4+ entries
];

// Weekday labels — show all days like the reference
const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DayCell {
  date: string;
  dayOfWeek: number; // 0=Mon, 6=Sun
  category?: string;
  count: number;
  title?: string;
}

interface ActivityEntry {
  date: string;
  category: string;
  count: number;
  title: string;
}

export default function ActivityGraph() {
  const [hoveredDay, setHoveredDay] = useState<(DayCell & { x: number; y: number }) | null>(null);
  const [activityData, setActivityData] = useState<ActivityEntry[]>([]);

  useEffect(() => {
    async function fetchActivity() {
      const { data, error } = await supabase
        .from("learnings")
        .select("title, category, created_at");
      if (!error && data) {
        // Group by date
        const grouped: Record<string, { category: string; count: number; title: string }> = {};
        for (const entry of data) {
          const date = entry.created_at.split("T")[0];
          if (!grouped[date]) {
            grouped[date] = { category: entry.category, count: 1, title: entry.title };
          } else {
            grouped[date].count += 1;
          }
        }
        setActivityData(
          Object.entries(grouped).map(([date, val]) => ({ date, ...val }))
        );
      }
    }
    fetchActivity();
  }, []);

  const { weeks, monthLabels, totalEntries } = useMemo(() => {
    const reference = new Date();
    reference.setHours(0, 0, 0, 0);

    // Go back to find the Monday ~52 weeks ago
    const refDow = (reference.getDay() + 6) % 7; // Mon=0
    const startDate = new Date(reference);
    startDate.setDate(startDate.getDate() - (52 * 7) - refDow);

    const allDays: DayCell[] = [];
    const current = new Date(startDate);
    let total = 0;

    while (current <= reference) {
      const dateStr = current.toISOString().split("T")[0];
      const dayOfWeek = (current.getDay() + 6) % 7;
      const activity = activityData.find((a) => a.date === dateStr);

      if (activity) total += activity.count;

      allDays.push({
        date: dateStr,
        dayOfWeek,
        category: activity?.category,
        count: activity?.count || 0,
        title: activity?.title,
      });

      current.setDate(current.getDate() + 1);
    }

    // Group into weeks (Mon-Sun)
    const weekGroups: DayCell[][] = [];
    let currentWeek: DayCell[] = [];

    for (const day of allDays) {
      if (day.dayOfWeek === 0 && currentWeek.length > 0) {
        weekGroups.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    }
    if (currentWeek.length > 0) {
      weekGroups.push(currentWeek);
    }

    // Month labels
    const months: { name: string; weekIdx: number }[] = [];
    let lastMonth = -1;
    weekGroups.forEach((week, wi) => {
      const firstDay = week[0];
      const month = new Date(firstDay.date + "T00:00:00Z").getMonth();
      if (month !== lastMonth) {
        months.push({
          name: new Date(firstDay.date + "T00:00:00Z").toLocaleString("en", { month: "short" }),
          weekIdx: wi,
        });
        lastMonth = month;
      }
    });

    return { weeks: weekGroups, monthLabels: months, totalEntries: total };
  }, [activityData]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00Z");
    return d.toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 mb-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="font-bold text-2xl text-[var(--foreground)] mb-2">
              My Learning Graph
            </h2>
            <p className="text-sm text-[var(--muted)]">
              {totalEntries} learning entries in the last year
            </p>
          </div>

          {/* Graph card */}
          <div className="relative bg-[var(--card)] border border-[var(--card-border)] rounded-2xl p-4 sm:p-5 shadow-sm">
            {/* Month labels */}
            <div className="flex mb-2 pl-9 overflow-hidden">
              {weeks.map((_, wi) => {
                const label = monthLabels.find((m) => m.weekIdx === wi);
                return (
                  <div key={wi} className="flex-1 min-w-0">
                    {label && (
                      <span className="text-[10px] text-[var(--muted)] font-semibold">
                        {label.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Grid */}
            <div className="flex gap-0">
              {/* Weekday labels */}
              <div className="flex flex-col gap-[3px] flex-shrink-0 w-8 pr-1">
                {weekdayLabels.map((label, i) => (
                  <div
                    key={i}
                    className="flex-1 flex items-center justify-end"
                  >
                    <span className="text-[9px] text-[var(--muted)] font-medium leading-none">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Week columns */}
              <div className="flex gap-[3px] flex-1 overflow-hidden">
                {weeks.map((week, wi) => (
                  <div key={wi} className="flex flex-col gap-[3px] flex-1 min-w-0">
                    {/* Pad start */}
                    {wi === 0 &&
                      week[0]?.dayOfWeek > 0 &&
                      Array.from({ length: week[0].dayOfWeek }).map((_, pi) => (
                        <div key={`ps-${pi}`} className="flex-1" />
                      ))}

                    {week.map((day) => {
                      const intensity =
                        day.count === 0 ? 0
                        : day.count === 1 ? 1
                        : day.count === 2 ? 2
                        : day.count === 3 ? 3
                        : 4;

                      return (
                        <div
                          key={day.date}
                          className={`flex-1 aspect-square rounded-[2px] cursor-pointer transition-all duration-100 hover:scale-[1.6] hover:shadow-md hover:z-10 hover:rounded-[3px] ${
                            intensity === 0 ? "bg-[var(--card-border)]/40 border border-[var(--card-border)]/30" : ""
                          }`}
                          style={intensity > 0 ? {
                            backgroundColor: `color-mix(in srgb, var(--accent) ${intensity === 1 ? "30%" : intensity === 2 ? "50%" : intensity === 3 ? "75%" : "100%"}, transparent)`
                          } : undefined}
                          onMouseEnter={(e) => {
                            const rect = (e.target as HTMLElement).getBoundingClientRect();
                            setHoveredDay({
                              ...day,
                              x: rect.left + rect.width / 2,
                              y: rect.top - 6,
                            });
                          }}
                          onMouseLeave={() => setHoveredDay(null)}
                        />
                      );
                    })}

                    {/* Pad end */}
                    {wi === weeks.length - 1 &&
                      week[week.length - 1]?.dayOfWeek < 6 &&
                      Array.from({ length: 6 - week[week.length - 1].dayOfWeek }).map((_, pi) => (
                        <div key={`pe-${pi}`} className="flex-1" />
                      ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend - Less/More like GitHub */}
            <div className="flex items-center justify-end gap-1.5 mt-4">
              <span className="text-[9px] text-[var(--muted)] mr-1">Less</span>
              <div className="w-[10px] h-[10px] rounded-[2px] bg-[var(--card-border)]/40 border border-[var(--card-border)]/30" />
              <div className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 30%, transparent)" }} />
              <div className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 50%, transparent)" }} />
              <div className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: "color-mix(in srgb, var(--accent) 75%, transparent)" }} />
              <div className="w-[10px] h-[10px] rounded-[2px]" style={{ backgroundColor: "var(--accent)" }} />
              <span className="text-[9px] text-[var(--muted)] ml-1">More</span>
            </div>

            {/* Tooltip */}
            {hoveredDay && (
              <div
                className="fixed z-[100] px-3.5 py-2.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] shadow-xl pointer-events-none"
                style={{
                  left: hoveredDay.x,
                  top: hoveredDay.y,
                  transform: "translate(-50%, -100%)",
                  minWidth: "150px",
                }}
              >
                <p className="text-[11px] font-bold mb-0.5">
                  {formatDate(hoveredDay.date)}
                </p>
                {hoveredDay.count === 0 ? (
                  <p className="text-[10px] opacity-70">No learning entries</p>
                ) : (
                  <>
                    {hoveredDay.title && (
                      <p className="text-[10px] opacity-90 mb-0.5">
                        {hoveredDay.title}
                      </p>
                    )}
                    <p className="text-[10px] opacity-70">
                      {hoveredDay.count} {hoveredDay.count === 1 ? "entry" : "entries"}
                      {hoveredDay.category && ` · ${hoveredDay.category}`}
                    </p>
                  </>
                )}
                {/* Tooltip arrow */}
                <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 bg-[var(--foreground)] rotate-45" />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
