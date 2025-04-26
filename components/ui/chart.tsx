"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  ),
)
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    config?: Record<string, { label: string; color: string }>
  }
>(({ className, children, config, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      style={
        config
          ? Object.fromEntries(Object.entries(config).map(([key, value]) => [`--color-${key}`, value.color]))
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartPie = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    innerRadius?: number
    paddingAngle?: number
  }
>(({ className, children, innerRadius, paddingAngle, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props}>
    {children}
  </div>
))
ChartPie.displayName = "ChartPie"

// Add Arc component to ChartPie
ChartPie.Arc = function ChartPieArc({
  arcData,
  ...props
}: React.SVGProps<SVGPathElement> & {
  arcData: any
}) {
  return <path {...props} />
}

const ChartPieSeries = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    data?: Array<any>
    valueAccessor?: (datum: any) => number
  }
>(({ className, children, data, valueAccessor, ...props }, ref) => {
  const arcData = React.useMemo(() => {
    if (!data || !valueAccessor) return []

    // Simple calculation for demo purposes
    const total = data.reduce((sum, datum) => sum + valueAccessor(datum), 0)
    let startAngle = 0

    return data.map((datum, index) => {
      const value = valueAccessor(datum)
      const angle = (value / total) * 360
      const arc = {
        key: `arc-${index}`,
        data: datum,
        startAngle,
        endAngle: startAngle + angle,
        value,
      }
      startAngle += angle
      return arc
    })
  }, [data, valueAccessor])

  return (
    <div ref={ref} className={cn(className)} {...props}>
      {typeof children === "function" ? children({ arcData }) : children}
    </div>
  )
})
ChartPieSeries.displayName = "ChartPieSeries"

const ChartTooltip = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  ),
)
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn("bg-white p-2 shadow rounded text-sm", className)} {...props}>
      {children || "Tooltip content"}
    </div>
  ),
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn(className)} {...props}>
      {children}
    </div>
  ),
)
ChartLegend.displayName = "ChartLegend"

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    itemClassName?: string
    labelClassName?: string
    valueClassName?: string
  }
>(({ className, children, itemClassName, labelClassName, valueClassName, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-wrap gap-4 justify-center", className)} {...props}>
    {children || (
      <>
        <div className={cn("flex items-center", itemClassName)}>
          <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
          <span className={cn(labelClassName)}>Daily living</span>
          <span className={cn("ml-1", valueClassName)}>30%</span>
        </div>
        <div className={cn("flex items-center", itemClassName)}>
          <span className="w-3 h-3 rounded-full bg-pink-500 mr-1"></span>
          <span className={cn(labelClassName)}>Communication</span>
          <span className={cn("ml-1", valueClassName)}>25%</span>
        </div>
        <div className={cn("flex items-center", itemClassName)}>
          <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
          <span className={cn(labelClassName)}>Emotion regulation</span>
          <span className={cn("ml-1", valueClassName)}>15%</span>
        </div>
      </>
    )}
  </div>
))
ChartLegendContent.displayName = "ChartLegendContent"

export {
  Chart,
  ChartPie,
  ChartPieSeries,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
}
