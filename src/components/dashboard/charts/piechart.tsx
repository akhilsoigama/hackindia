'use client';

import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import type { ApexOptions } from 'apexcharts';
import { motion } from 'framer-motion';
import { useTheme } from '@/theme/AppThemeProvider';

interface BarChartData {
  name: string;
  value: number;
}

interface BarChartComponentProps {
  data: BarChartData[];
  title?: string;
  height?: number;
  showTooltip?: boolean;
  animate?: boolean;
}

const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  title,
  height = 350,
  showTooltip = true,
  animate = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  const { mode } = useTheme();
  const isDark = mode === 'dark';

  const total = data.reduce((sum, item) => sum + item.value, 0);

  useEffect(() => {
    if (!chartRef.current) return;

    const options: ApexOptions = {
      chart: {
        type: 'bar',
        height,
        toolbar: {
          show: false,
        },
        background: 'transparent',
        animations: {
          enabled: animate,
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
        },
      },

      series: [
        {
          name: title || 'Data',
          data: data.map((item) => item.value),
        },
      ],

      xaxis: {
        categories: data.map((item) => item.name),
        labels: {
          style: {
            colors: isDark ? '#94A3B8' : '#64748B',
            fontSize: '12px',
            fontWeight: 500,
          },
        },
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
      },

      yaxis: {
        labels: {
          style: {
            colors: isDark ? '#94A3B8' : '#64748B',
          },
          formatter: (value) => value.toLocaleString(),
        },
      },

      plotOptions: {
        bar: {
          borderRadius: 12,
          columnWidth: '55%',
          distributed: false,
          dataLabels: {
            position: 'top',
          },
        },
      },

      colors: ['#475569'], 

      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'vertical',
          shadeIntensity: 0.3,
          gradientToColors: ['#64748B'],
          opacityFrom: 1,
          opacityTo: 0.85,
          stops: [0, 100],
        },
      },

      dataLabels: {
        enabled: true,
        formatter: (value: number) => value.toLocaleString(),
        offsetY: -20,
        style: {
          fontSize: '12px',
          fontWeight: '600',
          colors: [isDark ? '#E2E8F0' : '#334155'],
        },
      },

      grid: {
        borderColor: isDark ? '#334155' : '#CBD5E1',
        strokeDashArray: 4,
      },

      tooltip: {
        enabled: showTooltip,
        theme: isDark ? 'dark' : 'light',
        y: {
          formatter: (value) => value.toLocaleString(),
        },
      },

      legend: {
        show: false,
      },

      states: {
        hover: {
          filter: {
            type: 'darken',
          },
        },
      },

      responsive: [
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 300,
            },
          },
        },
      ],

      theme: {
        mode: isDark ? 'dark' : 'light',
      },
    };

    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      chartInstance.current?.destroy();
    };
  }, [
    data,
    title,
    height,
    animate,
    showTooltip,
    isDark,
  ]);

  useEffect(() => {
    if (!chartInstance.current) return;

    chartInstance.current.updateSeries([
      {
        name: title || 'Data',
        data: data.map((item) => item.value),
      },
    ]);

    chartInstance.current.updateOptions({
      xaxis: {
        categories: data.map((item) => item.name),
      },
    });
  }, [data, title]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`backdrop-blur-xl border rounded-2xl p-6 shadow-xl ${
        isDark
          ? 'bg-slate-950/5 border-slate-400/10'
          : 'bg-slate-50 border-slate-200'
      }`}
    >
      {title && (
        <h2
          className={`text-xl font-semibold mb-6 flex items-center gap-2 ${
            isDark ? 'text-slate-200' : 'text-slate-900'
          }`}
        >
          <div className="w-1 h-6 bg-linear-to-b from-slate-400 to-slate-700 rounded-full" />
          {title}
        </h2>
      )}

      <div ref={chartRef} />

      {total > 0 && (
        <div
          className={`text-center mt-4 pt-4 border-t ${
            isDark ? 'border-slate-200/10' : 'border-slate-200'
          }`}
        >
          <p
            className={`text-sm ${
              isDark ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Total:{' '}
            <span
              className={`font-semibold ${
                isDark ? 'text-slate-200' : 'text-slate-700'
              }`}
            >
              {total.toLocaleString()}
            </span>
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default BarChartComponent;