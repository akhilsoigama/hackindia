// components/dashboard/charts/KPIchart.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Award, 
  Flame,
  Calendar,
  Info,
  Zap
} from "lucide-react";
import ApexCharts from "apexcharts";
import { useTheme } from "@/theme/AppThemeProvider";

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  growth: number;
  color: string;
  sparklineData: { value: number }[];
  delay?: number;
  previousValue?: number;
  targetValue?: number;
  unit?: string;
  description?: string;
  benchmark?: number;
  achievementBadge?: boolean;
  trendPrediction?: 'up' | 'down' | 'stable';
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  icon: Icon,
  growth,
  color,
  sparklineData,
  delay = 0,
  previousValue,
  targetValue,
  unit = "",
  description = "",
  benchmark,
  achievementBadge = true,
  trendPrediction = 'stable',
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);
  const { mode } = useTheme();
  const isDark = mode === "dark";
  const isPositive = growth >= 0;
  const chartColor = isPositive ? "#384252" : "#2d303b";
  const [isMounted, setIsMounted] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const progressToTarget = targetValue ? (value / targetValue) * 100 : null;
  const actualGrowth = previousValue
    ? ((value - previousValue) / previousValue) * 100
    : growth;
  
  const benchmarkComparison = benchmark ? ((value - benchmark) / benchmark) * 100 : null;
  const isAboveBenchmark = benchmarkComparison && benchmarkComparison > 0;
  
  const getGrowthColor = () => {
    if (actualGrowth >= 10) return "bg-emerald-500/15 text-emerald-500";
    if (actualGrowth >= 0) return "bg-slate-500/15 text-slate-500";
    if (actualGrowth >= -5) return "bg-amber-500/15 text-amber-500";
    return "bg-rose-500/15 text-rose-500";
  };

  const getTrendIcon = () => {
    if (trendPrediction === 'up') return <Zap className="w-3 h-3" />;
    if (trendPrediction === 'down') return <TrendingDown className="w-3 h-3" />;
    return null;
  };

  const getTrendColor = () => {
    if (trendPrediction === 'up') return "text-emerald-500";
    if (trendPrediction === 'down') return "text-rose-500";
    return "text-slate-500";
  };

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Initialize chart
  useEffect(() => {
    if (!isMounted) return;
    if (!chartRef.current) return;
    if (!sparklineData || sparklineData.length === 0) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    const seriesData = sparklineData.map((d) => d.value);

    const options = {
      chart: {
        type: "area" as const,
        height: 48,
        width: "100%",
        sparkline: { enabled: true },
        animations: {
          enabled: true,
          easing: "easeinout" as const,
          speed: 800,
        },
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      series: [
        {
          name: "Value",
          data: seriesData,
        },
      ],
      stroke: {
        curve: "smooth" as const,
        width: 2.5,
        colors: [chartColor],
      },
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100],
          colorStops: [
            {
              offset: 0,
              color: chartColor,
              opacity: 0.7,
            },
            {
              offset: 100,
              color: chartColor,
              opacity: 0.1,
            },
          ],
        },
      },
      tooltip: {
        enabled: false,
      },
      grid: { show: false },
      xaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: { show: false },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
    };

    const timer = setTimeout(() => {
      if (chartRef.current && isMounted) {
        try {
          chartInstance.current = new ApexCharts(chartRef.current, options);
          chartInstance.current.render();
        } catch (error) {
          console.error("Error rendering chart:", error);
        }
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [sparklineData, chartColor, isMounted]);

  // Update chart when data changes
  useEffect(() => {
    if (!chartInstance.current || !sparklineData || sparklineData.length === 0) return;
    if (!isMounted) return;

    const seriesData = sparklineData.map((d) => d.value);
    
    try {
      chartInstance.current.updateSeries([{ data: seriesData }]);
    } catch (error) {
      console.error("Error updating chart:", error);
    }
  }, [sparklineData, isMounted]);

  // Don't render on server
  if (!isMounted) {
    return (
      <div className="relative group">
        <div className="relative overflow-hidden rounded-3xl border backdrop-blur-xl transition-all duration-300 p-6 bg-white/80 border-slate-200 shadow-lg">
          <div className="animate-pulse">
            <div className="h-12 w-12 bg-slate-200 rounded-2xl mb-5" />
            <div className="h-4 w-24 bg-slate-200 rounded mb-2" />
            <div className="h-8 w-32 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      className="relative group"
    >
      {/* Animated gradient border effect */}
      <div className="absolute -inset-0.5 bg-linear-to-r from-transparent via-slate-500/20 to-transparent rounded-3xl blur opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:duration-300" />
      
      <div
        className={`absolute inset-0 rounded-3xl blur-2xl opacity-0 group-hover:opacity-30 transition-all duration-500 ${
          isDark ? "bg-slate-950/70" : "bg-slate-300"
        }`}
      />

      <div
        className={`
          relative overflow-hidden rounded-3xl border backdrop-blur-xl
          transition-all duration-300 p-6
          ${
            isDark
              ? "bg-slate-900/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
              : "bg-white/80 border-slate-200 shadow-lg"
          }
        `}
      >
        {/* Animated gradient bar */}
        <div className={`absolute top-0 left-0 w-full h-1 ${color} overflow-hidden`}>
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer" />
        </div>

        {/* Background pattern */}
        <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
          <div className="w-32 h-32 rounded-full bg-linear-to-br from-slate-500 to-slate-700 blur-3xl" />
        </div>

        <div className="flex items-start justify-between mb-4">
          <div className="relative">
            <div
              className={`
                p-3 rounded-2xl ${color}
                shadow-lg flex items-center justify-center relative z-10
                transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
              `}
            >
              <Icon className={`w-6 h-6 ${isDark ? "text-white" : "text-slate-900"}`} />
            </div>
            
            {/* Achievement badge */}
            {achievementBadge && targetValue && value >= targetValue && (
              <div className="absolute -top-2 -right-2">
                <div className="relative">
                  <Award className="w-5 h-5 text-amber-500 animate-bounce" />
                  <div className="absolute inset-0 animate-ping opacity-75">
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Growth indicator */}
            <div
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${getGrowthColor()}`}
            >
              {actualGrowth >= 0 ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" />
              )}
              <span>{Math.abs(actualGrowth)}%</span>
            </div>

            {/* Trend prediction */}
            {trendPrediction !== 'stable' && (
              <div
                className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-semibold bg-opacity-10 ${getTrendColor()} bg-current`}
              >
                {getTrendIcon()}
                <span className="capitalize">
                  {trendPrediction === 'up' ? 'Rising' : 'Falling'}
                </span>
              </div>
            )}

            {/* Info tooltip */}
            {description && (
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="p-1 rounded-full hover:bg-slate-500/10 transition-colors"
                >
                  <Info className={`w-4 h-4 ${isDark ? "text-gray-400" : "text-slate-400"}`} />
                </button>
                
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 mt-2 w-48 p-2 text-xs rounded-lg bg-slate-900 text-white shadow-xl z-20"
                  >
                    {description}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        <p
          className={`text-sm font-medium ${
            isDark ? "text-gray-400" : "text-slate-500"
          }`}
        >
          {title}
        </p>

        <div
          className={`mt-2 text-3xl font-bold tracking-tight flex items-baseline gap-1 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          <CountUp end={value} duration={2} separator="," />
          {unit && (
            <span className="text-sm font-normal text-gray-500">{unit}</span>
          )}
        </div>

        {/* Enhanced growth section with trend line */}
        <div className="mt-1 mb-3 flex items-center justify-between">
          <div>
            <span className={`text-sm font-medium ${actualGrowth >= 0 ? "text-slate-500" : "text-rose-500"}`}>
              {actualGrowth >= 0 ? "+" : "-"}
              {Math.abs(actualGrowth)}%
            </span>
            <span className={`ml-2 text-xs ${isDark ? "text-gray-500" : "text-slate-400"}`}>
              {previousValue ? "vs last period" : "month over month"}
            </span>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Calendar className="w-3 h-3" />
            <span>Last 30 days</span>
          </div>
        </div>

        {/* Benchmark comparison */}
        {benchmark && (
          <div className="mb-3 p-2 rounded-lg bg-slate-500/5 border border-slate-500/10">
            <div className="flex items-center justify-between text-xs">
              <span className={isDark ? "text-gray-400" : "text-slate-500"}>
                vs Industry Benchmark
              </span>
              <div className={`flex items-center gap-1 ${isAboveBenchmark ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isAboveBenchmark ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span className="font-semibold">
                  {Math.abs(benchmarkComparison!).toFixed(1)}%
                  {isAboveBenchmark ? ' above' : ' below'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Progress bar with animation */}
        {progressToTarget !== null && progressToTarget <= 100 && (
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <div className="flex items-center gap-2">
                <Target className="w-3 h-3" />
                <span className={isDark ? "text-gray-400" : "text-slate-500"}>
                  Progress to target
                </span>
              </div>
              <span className="font-medium">
                {Math.round(progressToTarget)}%
              </span>
            </div>
            <div className="relative">
              <div
                className={`h-2 w-full overflow-hidden rounded-full ${isDark ? "bg-slate-800" : "bg-slate-200"}`}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressToTarget, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full rounded-full bg-linear-to-r from-slate-500 to-slate-600 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer" />
                </motion.div>
              </div>
            </div>
          </div>
        )}

        {/* Target achievement */}
        {targetValue && (
          <div className="flex items-center justify-between gap-2 mb-3 text-xs">
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3 text-gray-400" />
              <span className={isDark ? "text-gray-500" : "text-slate-400"}>
                Target: {targetValue.toLocaleString()}
                {unit}
              </span>
            </div>
            {value >= targetValue && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 text-emerald-500 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full"
              >
                <Award className="w-3 h-3" />
                Achieved!
              </motion.span>
            )}
            {value < targetValue && targetValue - value <= targetValue * 0.1 && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1 text-amber-500 text-xs"
              >
                <Flame className="w-3 h-3" />
                Almost there!
              </motion.span>
            )}
          </div>
        )}

        {/* Sparkline chart */}
        <div ref={chartRef} className="h-12 w-full mt-2" />
        
        {/* Decorative element */}
        <div className="absolute top-1/2 right-0 w-20 h-20 bg-linear-to-l from-slate-500/5 to-transparent rounded-full blur-xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

export default KPICard;