/**
 * Performance metrics collection module
 * Collects Web Vitals and other performance metrics from Playwright tests
 */

import { Page } from 'playwright';
import { PerformanceMetrics } from './types.js';

/**
 * Collect comprehensive performance metrics from a page
 */
export async function collectPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  try {
    // Collect metrics from the browser
    const metrics = await page.evaluate(() => {
      const perfData = (performance as any).getEntriesByType('navigation')[0] as any;
      const paintEntries = (performance as any).getEntriesByType('paint');

      // Get paint timings
      const firstPaint = paintEntries.find((entry: any) => entry.name === 'first-paint');
      const firstContentfulPaint = paintEntries.find((entry: any) => entry.name === 'first-contentful-paint');

      return {
        // Navigation timing
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
        loadComplete: perfData.loadEventEnd - perfData.fetchStart,

        // Paint timing
        firstPaint: firstPaint ? firstPaint.startTime : 0,
        firstContentfulPaint: firstContentfulPaint ? firstContentfulPaint.startTime : 0,

        // Resource timing
        resourceTimings: performance.getEntriesByType('resource').length
      };
    });

    // Get Web Vitals using the web-vitals approach
    const webVitals = await collectWebVitals(page);

    // Combine all metrics
    return {
      firstPaint: metrics.firstPaint,
      firstContentfulPaint: metrics.firstContentfulPaint,
      largestContentfulPaint: webVitals.lcp,
      timeToInteractive: webVitals.tti,
      totalBlockingTime: webVitals.tbt,
      cumulativeLayoutShift: webVitals.cls,
      domContentLoaded: metrics.domContentLoaded,
      loadComplete: metrics.loadComplete
    };
  } catch (error) {
    console.error('Error collecting performance metrics:', error);
    return getEmptyMetrics();
  }
}

/**
 * Collect Web Vitals metrics
 */
async function collectWebVitals(page: Page): Promise<{
  lcp: number;
  fid: number;
  cls: number;
  tti: number;
  tbt: number;
}> {
  try {
    const vitals = await page.evaluate(() => {
      return new Promise<any>((resolve) => {
        const metrics: any = {
          lcp: 0,
          fid: 0,
          cls: 0,
          tti: 0,
          tbt: 0
        };

        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        });

        try {
          (lcpObserver as any).observe({ type: 'largest-contentful-paint', buffered: true });
        } catch (e) {
          // LCP not supported
        }

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metrics.cls = clsValue;
        });

        try {
          (clsObserver as any).observe({ type: 'layout-shift', buffered: true });
        } catch (e) {
          // CLS not supported
        }

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const firstEntry = entries[0] as any;
          metrics.fid = firstEntry.processingStart - firstEntry.startTime;
        });

        try {
          (fidObserver as any).observe({ type: 'first-input', buffered: true });
        } catch (e) {
          // FID not supported
        }

        // Estimate Time to Interactive (TTI)
        // This is a simplified estimation
        const navigationEntry = (performance as any).getEntriesByType('navigation')[0] as any;
        if (navigationEntry) {
          metrics.tti = navigationEntry.domInteractive - navigationEntry.fetchStart;
        }

        // Estimate Total Blocking Time (TBT)
        // This is a simplified calculation
        const longTasks = (performance as any).getEntriesByType('longtask') || [];
        metrics.tbt = longTasks.reduce((total: number, task: any) => {
          const blockingTime = Math.max(0, task.duration - 50);
          return total + blockingTime;
        }, 0);

        // Wait a bit for observers to collect data
        setTimeout(() => {
          lcpObserver.disconnect();
          clsObserver.disconnect();
          fidObserver.disconnect();
          resolve(metrics);
        }, 1000);
      });
    });

    return vitals;
  } catch (error) {
    console.error('Error collecting web vitals:', error);
    return {
      lcp: 0,
      fid: 0,
      cls: 0,
      tti: 0,
      tbt: 0
    };
  }
}

/**
 * Get detailed timing breakdown
 */
export async function getDetailedTimings(page: Page): Promise<{
  dns: number;
  tcp: number;
  tls: number;
  ttfb: number;
  download: number;
  domProcessing: number;
}> {
  try {
    return await page.evaluate(() => {
      const perfData = (performance as any).getEntriesByType('navigation')[0] as any;

      return {
        dns: perfData.domainLookupEnd - perfData.domainLookupStart,
        tcp: perfData.connectEnd - perfData.connectStart,
        tls: perfData.secureConnectionStart > 0
          ? perfData.connectEnd - perfData.secureConnectionStart
          : 0,
        ttfb: perfData.responseStart - perfData.requestStart,
        download: perfData.responseEnd - perfData.responseStart,
        domProcessing: perfData.domComplete - perfData.domInteractive
      };
    });
  } catch (error) {
    console.error('Error getting detailed timings:', error);
    return {
      dns: 0,
      tcp: 0,
      tls: 0,
      ttfb: 0,
      download: 0,
      domProcessing: 0
    };
  }
}

/**
 * Get resource performance data
 */
export async function getResourcePerformance(page: Page): Promise<Array<{
  name: string;
  type: string;
  duration: number;
  size: number;
}>> {
  try {
    return await page.evaluate(() => {
      const resources = (performance as any).getEntriesByType('resource') as any[];

      return resources.map((resource: any) => ({
        name: resource.name,
        type: resource.initiatorType,
        duration: resource.duration,
        size: resource.transferSize || 0
      }));
    });
  } catch (error) {
    console.error('Error getting resource performance:', error);
    return [];
  }
}

/**
 * Calculate performance score (0-100)
 */
export function calculatePerformanceScore(metrics: PerformanceMetrics): number {
  let score = 100;

  // LCP scoring (target: < 2.5s)
  const lcp = metrics.largestContentfulPaint || 0;
  if (lcp > 4000) {
    score -= 30;
  } else if (lcp > 2500) {
    score -= 15;
  }

  // FCP scoring (target: < 1.8s)
  const fcp = metrics.firstContentfulPaint || 0;
  if (fcp > 3000) {
    score -= 20;
  } else if (fcp > 1800) {
    score -= 10;
  }

  // TTI scoring (target: < 3.8s)
  const tti = metrics.timeToInteractive || 0;
  if (tti > 7300) {
    score -= 20;
  } else if (tti > 3800) {
    score -= 10;
  }

  // TBT scoring (target: < 200ms)
  const tbt = metrics.totalBlockingTime || 0;
  if (tbt > 600) {
    score -= 15;
  } else if (tbt > 200) {
    score -= 7;
  }

  // CLS scoring (target: < 0.1)
  const cls = metrics.cumulativeLayoutShift || 0;
  if (cls > 0.25) {
    score -= 15;
  } else if (cls > 0.1) {
    score -= 7;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Get performance grade (A-F)
 */
export function getPerformanceGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Get performance recommendations
 */
export function getPerformanceRecommendations(metrics: PerformanceMetrics): string[] {
  const recommendations: string[] = [];

  const lcp = metrics.largestContentfulPaint || 0;
  const fcp = metrics.firstContentfulPaint || 0;
  const tti = metrics.timeToInteractive || 0;
  const tbt = metrics.totalBlockingTime || 0;
  const cls = metrics.cumulativeLayoutShift || 0;

  if (lcp > 2500) {
    recommendations.push(
      'LCP is above the recommended threshold. Consider optimizing image loading, reducing server response time, and eliminating render-blocking resources.'
    );
  }

  if (fcp > 1800) {
    recommendations.push(
      'FCP is above the recommended threshold. Consider reducing server response time, eliminating render-blocking resources, and minimizing critical request depth.'
    );
  }

  if (tti > 3800) {
    recommendations.push(
      'TTI is above the recommended threshold. Consider reducing JavaScript execution time, minimizing main thread work, and keeping request counts low.'
    );
  }

  if (tbt > 200) {
    recommendations.push(
      'TBT is above the recommended threshold. Consider breaking up long tasks, optimizing JavaScript, and deferring unused JavaScript.'
    );
  }

  if (cls > 0.1) {
    recommendations.push(
      'CLS is above the recommended threshold. Consider setting size attributes on images and videos, avoiding inserting content above existing content, and using CSS transform animations.'
    );
  }

  if (recommendations.length === 0) {
    recommendations.push('Performance metrics are within recommended thresholds. Great job!');
  }

  return recommendations;
}

/**
 * Monitor long tasks
 */
export async function monitorLongTasks(page: Page): Promise<Array<{
  duration: number;
  startTime: number;
}>> {
  try {
    return await page.evaluate(() => {
      return new Promise<any[]>((resolve) => {
        const longTasks: any[] = [];

        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            longTasks.push({
              duration: entry.duration,
              startTime: entry.startTime
            });
          }
        });

        try {
          (observer as any).observe({ type: 'longtask', buffered: true });

          setTimeout(() => {
            observer.disconnect();
            resolve(longTasks);
          }, 5000);
        } catch (e) {
          resolve([]);
        }
      });
    });
  } catch (error) {
    console.error('Error monitoring long tasks:', error);
    return [];
  }
}

/**
 * Get memory usage
 */
export async function getMemoryUsage(page: Page): Promise<{
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} | null> {
  try {
    return await page.evaluate(() => {
      if ('memory' in performance) {
        const mem = (performance as any).memory;
        return {
          usedJSHeapSize: mem.usedJSHeapSize,
          totalJSHeapSize: mem.totalJSHeapSize,
          jsHeapSizeLimit: mem.jsHeapSizeLimit
        };
      }
      return null;
    });
  } catch (error) {
    console.error('Error getting memory usage:', error);
    return null;
  }
}

/**
 * Create performance summary
 */
export function createPerformanceSummary(metrics: PerformanceMetrics): {
  score: number;
  grade: string;
  metrics: PerformanceMetrics;
  recommendations: string[];
} {
  const score = calculatePerformanceScore(metrics);
  const grade = getPerformanceGrade(score);
  const recommendations = getPerformanceRecommendations(metrics);

  return {
    score,
    grade,
    metrics,
    recommendations
  };
}

/**
 * Get empty metrics object
 */
function getEmptyMetrics(): PerformanceMetrics {
  return {
    firstPaint: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    timeToInteractive: 0,
    totalBlockingTime: 0,
    cumulativeLayoutShift: 0,
    domContentLoaded: 0,
    loadComplete: 0
  };
}

/**
 * Wait for page to be fully loaded and stable
 */
export async function waitForPageStable(page: Page, timeout: number = 30000): Promise<void> {
  try {
    await page.waitForLoadState('networkidle', { timeout });
    await page.waitForLoadState('domcontentloaded', { timeout });

    // Wait for any animations to settle
    await page.waitForTimeout(100);
  } catch (error) {
    console.warn('Warning: Page did not become stable within timeout');
  }
}

/**
 * Check if page meets Web Vitals thresholds
 */
export function meetsWebVitalsThresholds(metrics: PerformanceMetrics): {
  lcp: boolean;
  fcp: boolean;
  cls: boolean;
  overall: boolean;
} {
  const lcp = (metrics.largestContentfulPaint || 0) <= 2500;
  const fcp = (metrics.firstContentfulPaint || 0) <= 1800;
  const cls = (metrics.cumulativeLayoutShift || 0) <= 0.1;

  return {
    lcp,
    fcp,
    cls,
    overall: lcp && fcp && cls
  };
}
