// components/dashboard/charts/ApexSparkline.tsx - Reusable component
'use client';

import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';

interface ApexSparklineProps {
  data: { value: number }[];
  color: string;
  height?: number;
  strokeWidth?: number;
  showGradient?: boolean;
  animate?: boolean;
}

const ApexSparkline: React.FC<ApexSparklineProps> = ({
  data,
  color,
  height = 48,
  strokeWidth = 2.5,
  showGradient = true,
  animate = true,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ApexCharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const seriesData = data.map(d => d.value);

    const options = {
      chart: {
        type: 'area' as const,
        height: height,
        width: '100%',
        sparkline: { enabled: true },
        animations: { enabled: animate, easing: 'easeinout' as const, speed: 800 },
        toolbar: { show: false },
        zoom: { enabled: false },
      },
      series: [{ data: seriesData }],
      stroke: {
        curve: 'smooth' as const,
        width: strokeWidth,
        colors: [color],
      },
      fill: showGradient ? {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.1,
          stops: [0, 90, 100],
          colorStops: [
            { offset: 0, color: color, opacity: 0.7 },
            { offset: 100, color: color, opacity: 0.1 },
          ],
        },
      } : {
        type: 'solid',
        colors: [color],
        opacity: 0.1,
      },
      tooltip: { enabled: false },
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

    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, color, height, strokeWidth, showGradient, animate]);

  useEffect(() => {
    if (chartInstance.current && data.length > 0) {
      const seriesData = data.map(d => d.value);
      chartInstance.current.updateSeries([{ data: seriesData }]);
    }
  }, [data]);

  return <div ref={chartRef} />;
};

export default ApexSparkline;