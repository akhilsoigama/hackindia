type MetricName = 'CLS' | 'INP' | 'FID' | 'LCP' | 'FCP' | 'TTFB';

export interface WebVitalMetric {
  name: MetricName;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

type ReportHandler = (metric: WebVitalMetric) => void;

type LayoutShiftEntry = PerformanceEntry & {
  value: number;
  hadRecentInput: boolean;
};

type EventTimingEntry = PerformanceEntry & {
  duration: number;
};

const getNavigationType = (): string => {
  const [navigationEntry] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  return navigationEntry?.type ?? 'navigate';
};

const getRating = (name: MetricName, value: number): WebVitalMetric['rating'] => {
  const thresholds: Record<MetricName, [number, number]> = {
    CLS: [0.1, 0.25],
    INP: [200, 500],
    FID: [100, 300],
    LCP: [2500, 4000],
    FCP: [1800, 3000],
    TTFB: [800, 1800],
  };

  const [good, poor] = thresholds[name];
  if (value <= good) {
    return 'good';
  }
  if (value <= poor) {
    return 'needs-improvement';
  }
  return 'poor';
};

const buildMetric = (name: MetricName, value: number): WebVitalMetric => ({
  name,
  value,
  rating: getRating(name, value),
  delta: value,
  id: `${name}-${Date.now()}`,
  navigationType: getNavigationType(),
});

export const reportWebVitals = (onPerfEntry: ReportHandler): void => {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') {
    return;
  }

  const run = () => {
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1] as LargestContentfulPaint | undefined;
        if (lastEntry) {
          onPerfEntry(buildMetric('LCP', lastEntry.startTime));
        }
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      const fcpObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntriesByName('first-contentful-paint')) {
          onPerfEntry(buildMetric('FCP', entry.startTime));
        }
      });
      fcpObserver.observe({ type: 'paint', buffered: true });

      const clsObserver = new PerformanceObserver((entryList) => {
        let clsValue = 0;
        for (const entry of entryList.getEntries() as LayoutShiftEntry[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        onPerfEntry(buildMetric('CLS', clsValue));
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      const navObserver = new PerformanceObserver((entryList) => {
        const [entry] = entryList.getEntries() as PerformanceNavigationTiming[];
        if (entry) {
          onPerfEntry(buildMetric('TTFB', entry.responseStart));
        }
      });
      navObserver.observe({ type: 'navigation', buffered: true });

      const inpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries() as EventTimingEntry[];
        const worst = entries.reduce((max, entry) => (entry.duration > max ? entry.duration : max), 0);
        if (worst > 0) {
          onPerfEntry(buildMetric('INP', worst));
        }
      });
      inpObserver.observe({ type: 'event', buffered: true } as PerformanceObserverInit);
    } catch {
      // Ignore unsupported observer types.
    }
  };

  if (document.readyState === 'complete') {
    run();
    return;
  }

  window.addEventListener('load', run, { once: true });
};

export default reportWebVitals;
