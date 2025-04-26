"use client"

import { ChartContainer, ChartLegend, ChartLegendContent, ChartPieSeries } from "@/components/ui/chart"

const data = [
  { name: "Daily living", value: 30, color: "#60a5fa" },
  { name: "Communication", value: 25, color: "#f472b6" },
  { name: "Emotion regulation", value: 15, color: "#a78bfa" },
]

export default function ProgressChart() {
  return (
    <ChartContainer className="h-[200px] w-[200px]">
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <g transform="translate(50, 50)">
          <ChartPieSeries data={data} valueAccessor={(d) => d.value}>
            {({ arcData }) => {
              // Simple SVG arc generation for demo
              return arcData.map((arc, i) => {
                const { data, startAngle, endAngle } = arc
                const radius = 40
                const innerRadius = 24

                // Convert angles to radians
                const startRad = (startAngle * Math.PI) / 180
                const endRad = (endAngle * Math.PI) / 180

                // Calculate points
                const x1 = radius * Math.cos(startRad)
                const y1 = radius * Math.sin(startRad)
                const x2 = radius * Math.cos(endRad)
                const y2 = radius * Math.sin(endRad)
                const x3 = innerRadius * Math.cos(endRad)
                const y3 = innerRadius * Math.sin(endRad)
                const x4 = innerRadius * Math.cos(startRad)
                const y4 = innerRadius * Math.sin(startRad)

                // Determine if the arc is more than 180 degrees
                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

                // Create path
                const path = [
                  `M ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `L ${x3} ${y3}`,
                  `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                  "Z",
                ].join(" ")

                return <path key={`arc-${i}`} d={path} fill={data.color} stroke="white" strokeWidth="2" />
              })
            }}
          </ChartPieSeries>
        </g>
      </svg>
      <ChartLegend>
        <ChartLegendContent
          className="mt-4"
          itemClassName="text-xs"
          labelClassName="font-medium"
          valueClassName="font-medium"
        />
      </ChartLegend>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <span className="text-3xl font-bold">70%</span>
          <p className="text-xs text-gray-500">Overall</p>
        </div>
      </div>
    </ChartContainer>
  )
}
