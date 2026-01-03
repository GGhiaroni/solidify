"use client";
import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { Tooltip as ReactTooltip } from "react-tooltip";

interface HeatmapProps {
  data: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

export const Heatmap = ({ data }: HeatmapProps) => {
  return (
    <div className="w-full flex justify-center py-4 overflow-x-auto">
      {/* Componente do Tooltip */}
      <ReactTooltip
        id="activity-tooltip"
        style={{
          backgroundColor: "#000",
          color: "#fff",
          borderRadius: "8px",
          padding: "8px 12px",
          fontSize: "12px",
        }}
      />

      <ActivityCalendar
        data={data}
        theme={{
          light: ["#e1e4e8", "#40c463", "#30a14e", "#216e39", "#216e39"],
          dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
        }}
        labels={{
          legend: { less: "Menos", more: "Mais" },
          months: [
            "Jan",
            "Fev",
            "Mar",
            "Abr",
            "Mai",
            "Jun",
            "Jul",
            "Ago",
            "Set",
            "Out",
            "Nov",
            "Dez",
          ],
          totalCount: "{{count}} minutos em {{year}}",
        }}
        colorScheme="dark"
        blockSize={14}
        blockMargin={4}
        fontSize={12}
        renderBlock={(block, activity) => {
          return React.cloneElement(block, {
            "data-tooltip-id": "activity-tooltip",
            "data-tooltip-content": `${activity.count} minutos em ${activity.date}`,
          });
        }}
      />
    </div>
  );
};
