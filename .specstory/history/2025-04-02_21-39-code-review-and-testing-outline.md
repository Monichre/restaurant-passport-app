<!-- Generated by SpecStory -->

# Code Review and Testing Outline (2025-04-02 16:39:32)

_**User**_

Read through the @analytics_dashboard.mdc file and then review the relevant code in @admin and attempt to gauge how much has been completed. 
For those things that have been completed, outline tests to write. For those things that have not been completed, outline next steps and how to complete them 

---

_**Assistant**_



---

Let me analyze the admin section implementation against the analytics dashboard requirements.

---

Read file: /Users/liamellis/Desktop/restaurant-passport-app/src/app/admin/page.tsx

---

Read file: /Users/liamellis/Desktop/restaurant-passport-app/src/app/admin/layout.tsx

---

Let me check the restaurants and deals admin sections:

---

<details>
            <summary>Listed directory /Users/liamellis/Desktop/restaurant-passport-app/src/app/admin/restaurants • **11** results</summary>
        
| Name |
|-------|
| 📄 `actions.ts` |
| 📄 `qr-code-manager.tsx` |
| 📄 `page.tsx` |
| 📄 `selectable-restaurants-table.tsx` |
| 📁 `bulk-qr` |
| 📄 `bulk-qr-code-manager.tsx` |
| 📄 `bulk-qr.tsx` |
| 📄 `dummy-components.tsx` |
| 📄 `index.tsx` |
| 📁 `[id]` |
| 📁 `new` |

</details>

---

<details>
            <summary>Listed directory /Users/liamellis/Desktop/restaurant-passport-app/src/app/admin/restaurants/[id] • **1** results</summary>
        
| Name |
|-------|
| 📄 `page.tsx` |

</details>

---

Let me check the restaurant detail page:

---

Read file: /Users/liamellis/Desktop/restaurant-passport-app/src/app/admin/restaurants/[id]/page.tsx

---

Now let's look at the deals section:

---

<details>
            <summary>Listed directory /Users/liamellis/Desktop/restaurant-passport-app/src/app/admin/deals • **3** results</summary>
        
| Name |
|-------|
| 📁 `[id]` |
| 📄 `page.tsx` |
| 📁 `new` |

</details>

---

Let me check if there's an analytics section specifically:

---

<details>
            <summary>Listed directory /Users/liamellis/Desktop/restaurant-passport-app/src/app • **11** results</summary>
        
| Name |
|-------|
| 📄 `layout.tsx` |
| 📄 `global-error.tsx` |
| 📄 `page.tsx` |
| 📄 `globals.css` |
| 📁 `components` |
| 📁 `api` |
| 📁 `admin` |
| 📁 `(public)` |
| 📁 `leaderboard` |
| 📁 `users` |
| 📄 `favicon.ico` |

</details>

---

Let me check if there's a dashboard or analytics components:

---

<details>
            <summary>Searched codebase "analytics dashboard component or service implementation" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `.cursor/rules/analytics_dashboard.mdc` | L1-61 |
| `.cursor/rules/analytics_dashboard.mdc` | L61-101 |
| `.cursor/rules/analytics_dashboard.mdc` | L101-147 |
| `src/types/api.ts` | L116-132 |
| `src/components/admin/restaurant-quick-view.tsx` | L310-362 |
| `repomix-output.md` | L19837-19882 |
| `.cursor/rules/analytics_dashboard.mdc` | L147-171 |
| `.repomix-output.txt` | L14927-14974 |
| `src/types/api.ts` | L142-153 |
| `repomix-output.md` | L4062-4095 |
| `.repomix-output.txt` | L18204-18239 |
| `.cursor/rules/prd.mdc` | L311-348 |
| `.repomix-output.txt` | L30106-30208 |
| `src/app/layout.tsx` | L1-28 |
| `src/components/kokonutui/bento-grid.tsx` | L30-67 |
| `.repomix-output.txt` | L13905-13938 |
| `PRD.txt` | L306-343 |
| `src/components/admin/admin-dashboard-content.tsx` | L1-8 |
| `src/components/ui/restaurant-punch-card.tsx` | L1-23 |
| `scripts/example_prd.txt` | L58-101 |
| `.repomix-output.txt` | L13636-13683 |
| `src/components/admin/admin-dashboard-content.tsx` | L8-54 |
| `.repomix-output.txt` | L22483-22548 |
| `repomix-output.md` | L13034-13095 |
| `.cursor/rules/repo.mdc` | L6050-6170 |

</details>

---

Let me check if there's a dedicated analytics service or component:

---

<details>
            <summary>Searched codebase "analytics service getRestaurantAnalytics export" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `src/types/api.ts` | L116-132 |
| `repomix-output.md` | L19837-19882 |
| `src/components/admin/restaurant-quick-view.tsx` | L310-362 |
| `.repomix-output.txt` | L14927-14974 |
| `.cursor/rules/analytics_dashboard.mdc` | L1-61 |
| `repomix-output.md` | L21354-21411 |
| `repomix-output.md` | L21528-21571 |
| `.cursor/rules/repo.mdc` | L6050-6170 |
| `.repomix-output.txt` | L15516-15559 |
| `repomix-output.md` | L20957-21037 |
| `repomix-output.md` | L21470-21528 |
| `.repomix-output.txt` | L30106-30208 |
| `src/db/models/leaderboard/leaderboard.ts` | L35-62 |
| `src/db/models/restaurants/restaurants.ts` | L1-24 |
| `.repomix-output.txt` | L15476-15516 |
| `src/db/models/restaurants/restaurants.ts` | L24-62 |
| `.repomix-output.txt` | L25089-25166 |
| `src/types/db.ts` | L188-197 |
| `repomix-output.md` | L15633-15713 |
| `src/types/db.ts` | L179-188 |
| `repomix-output.md` | L21037-21115 |
| `repomix-output.md` | L2248-2282 |
| `repomix-output.md` | L3690-3721 |
| `repomix-output.md` | L21940-21983 |
| `.repomix-output.txt` | L8194-8228 |

</details>

---

Let me check the admin dashboard content component:

---

<details>
            <summary>Searched codebase "AdminDashboardContent" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `src/components/admin/admin-content.tsx` | L1-37 |
| `src/components/admin/admin-dashboard-content.tsx` | L8-54 |
| `.repomix-output.txt` | L13598-13636 |
| `src/components/admin/admin-dashboard-content.tsx` | L1-8 |
| `.repomix-output.txt` | L13636-13683 |
| `src/components/admin/admin-ui.tsx` | L1-15 |
| `src/app/admin/page.tsx` | L1-12 |
| `repomix-output.md` | L3791-3841 |
| `repomix-output.md` | L11347-11393 |
| `repomix-output.md` | L4062-4095 |
| `repomix-output.md` | L20610-20669 |
| `repomix-output.md` | L22300-22325 |
| `repomix-output.md` | L15769-15813 |
| `.repomix-output.txt` | L13905-13938 |
| `src/types/api.ts` | L142-153 |
| `repomix-output.md` | L20542-20610 |
| `.repomix-output.txt` | L9549-9599 |
| `src/components/admin/Sidebar.tsx` | L118-178 |
| `src/components/admin/expandable-admin-menu.tsx` | L1-47 |
| `src/app/admin/layout.tsx` | L1-23 |
| `repomix-output.md` | L20412-20468 |
| `repomix-output.md` | L3721-3791 |
| `.repomix-output.txt` | L16276-16309 |
| `.repomix-output.txt` | L9663-9720 |
| `src/components/admin/Sidebar.tsx` | L178-212 |

</details>

---

Now I need to check if there are any chart or analytics visualization components:

---

<details>
            <summary>Searched codebase "chart component visualization analytics dashboard" • **25** results</summary>
        
| File | Lines |
|------|-------|
| `.cursor/rules/analytics_dashboard.mdc` | L61-101 |
| `.cursor/rules/analytics_dashboard.mdc` | L101-147 |
| `.cursor/rules/analytics_dashboard.mdc` | L1-61 |
| `src/components/admin/restaurant-quick-view.tsx` | L310-362 |
| `src/components/ui/restaurant-punch-card.tsx` | L67-115 |
| `src/components/icons/Percent.tsx` | L45-106 |
| `.repomix-output.txt` | L22483-22548 |
| `repomix-output.md` | L19837-19882 |
| `src/components/ui/restaurant-punch-card.tsx` | L1-23 |
| `src/types/api.ts` | L116-132 |
| `.repomix-output.txt` | L14927-14974 |
| `repomix-output.md` | L4062-4095 |
| `.repomix-output.txt` | L27074-27116 |
| `repomix-output.md` | L13034-13095 |
| `.repomix-output.txt` | L13905-13938 |
| `.repomix-output.txt` | L18204-18239 |
| `src/features/users/lottery-status.tsx` | L1-43 |
| `repomix-output.md` | L12978-13034 |
| `.repomix-output.txt` | L22366-22431 |
| `src/app/globals.css` | L59-117 |
| `.repomix-output.txt` | L22431-22483 |
| `.repomix-output.txt` | L27155-27190 |
| `repomix-output.md` | L5814-5858 |
| `src/components/icons/Wine.tsx` | L29-73 |
| `.cursor/rules/analytics_dashboard.mdc` | L147-171 |

</details>

---

Based on my analysis of the codebase and the analytics_dashboard.mdc guidelines, I'll outline what has been completed and what still needs to be done for the analytics dashboard implementation.

## Current Implementation Status

### Completed Components:

1. **Basic Analytics Types**
   - `RestaurantAnalytics` type has been defined with basic metrics in `src/types/api.ts`
   - `AdminDashboardStats` type exists for system-wide statistics

2. **Simple Metrics Visualization**
   - `RestaurantQuickView` component displays basic analytics in a "bento box" style UI
   - Metrics shown include customer engagement, completion rate, and recent activity
   - Basic visualization in `RestaurantPunchCard` component with:
     - Completion rate displayed as percentage and progress bar
     - Active cards count
     - Recent activity metrics

3. **Role-Based Access Control**
   - Admin layout has proper authentication and authorization checks
   - Non-admin users are redirected away from admin pages

4. **Admin Dashboard Structure**
   - Basic admin UI layout with sidebar navigation is in place
   - Admin dashboard shows links to users, restaurants, and settings sections

### Missing Implementation:

1. **Dedicated Analytics Service**
   - No dedicated analytics service with proper separation of concerns
   - No implementation of `getRestaurantAnalytics` or similar methods
   - No caching mechanism for expensive analytics queries

2. **Data Aggregation Patterns**
   - No reusable aggregation utilities
   - No standardized time period calculations
   - Analytics calculations are scattered in UI components, not centralized

3. **Advanced Visualization Components**
   - No reusable chart components with consistent props
   - No specialized chart types for different metrics
   - No accessibility attributes for visualizations

4. **Time-Based Filtering**
   - No support for filtering analytics by daily/weekly/monthly periods
   - No date range selector component

5. **Export and Reporting Features**
   - No CSV/Excel export functionality
   - No scheduled reporting capabilities

6. **Dedicated Analytics Dashboard Pages**
   - No dedicated restaurant analytics dashboard
   - No system-wide analytics dashboard

## Test Plan for Completed Components

### 1. RestaurantQuickView Component Tests

```typescript
// Test plan for RestaurantQuickView

// Unit Tests
describe('RestaurantQuickView', () => {
  // Test loading state
  it('should show loading skeleton when data is being fetched', () => {})
  
  // Test error state
  it('should display error message when API call fails', () => {})
  
  // Test calculation accuracy
  it('should correctly calculate completion rate', () => {})
  
  // Test recent activity filtering
  it('should correctly count punch cards from last 30 days', () => {})
  
  // Test unique users calculation
  it('should correctly count unique users with punch cards', () => {})
  
  // Test modal functionality
  it('should open modal with additional analytics when clicked', () => {})
})
```

### 2. RestaurantPunchCard Component Tests

```typescript
// Test plan for RestaurantPunchCard

// Unit Tests
describe('RestaurantPunchCard', () => {
  // Test rendering with props
  it('should render all metrics correctly when provided valid props', () => {})
  
  // Test calculation accuracy
  it('should calculate completion rate percentage correctly', () => {})
  
  // Test progress bar width
  it('should set progress bar width based on completion rate', () => {})
  
  // Test animations
  it('should apply correct animation properties on mount', () => {})
  
  // Test with zero values
  it('should handle edge case of zero punch cards gracefully', () => {})
})
```

### 3. Role-Based Access Tests

```typescript
// Test plan for Admin Layout authorization

// Integration Tests
describe('AdminLayout', () => {
  // Test authentication protection
  it('should redirect unauthenticated users to home page', () => {})
  
  // Test authorization protection
  it('should redirect non-admin users to home page', () => {})
  
  // Test successful access
  it('should render admin content for authenticated admin users', () => {})
})
```

## Next Steps to Complete Analytics Dashboard

### 1. Create Dedicated Analytics Service

```typescript
// Create an analytics service (src/services/analytics.ts)
import { cache } from '@/lib/cache';
import { db } from '@/db';

// Define time period type
export type TimePeriod = 'daily' | 'weekly' | 'monthly' | 'custom';

// Time range utility
export const getTimeRangeForPeriod = (
  period: TimePeriod = 'monthly',
  customRange?: { start: Date; end: Date }
): { startDate: Date; endDate: Date } => {
  const endDate = new Date();
  let startDate = new Date();
  
  switch (period) {
    case 'daily':
      startDate.setDate(startDate.getDate() - 1);
      break;
    case 'weekly':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(startDate.getMonth() - 1);
      break;
    case 'custom':
      if (customRange) {
        return { startDate: customRange.start, endDate: customRange.end };
      }
      startDate.setMonth(startDate.getMonth() - 1);
      break;
  }
  
  return { startDate, endDate };
};

// Restaurant analytics service
export const getRestaurantAnalytics = async (
  restaurantId: string,
  period: TimePeriod = 'monthly',
  customRange?: { start: Date; end: Date }
): Promise<RestaurantAnalytics> => {
  // Create cache key
  const cacheKey = `restaurant-analytics:${restaurantId}:${period}:${customRange?.start?.toISOString() || ''}:${customRange?.end?.toISOString() || ''}`;
  
  // Check cache first
  const cached = await cache.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Get time range
  const { startDate, endDate } = getTimeRangeForPeriod(period, customRange);
  
  // Implement analytics data fetching and aggregation logic here
  // ...
  
  // Cache results with appropriate TTL (15 minutes)
  await cache.set(cacheKey, JSON.stringify(result), 60 * 15);
  
  return result;
};

// System analytics service
export const getSystemWideAnalytics = async (
  period: TimePeriod = 'monthly',
  customRange?: { start: Date; end: Date }
): Promise<AdminDashboardStats> => {
  // Similar implementation to getRestaurantAnalytics
};
```

### 2. Create Reusable Chart Components

```typescript
// Create reusable chart components (src/components/charts/metric-chart.tsx)
'use client';

import React from 'react';
import { LineChart, BarChart, PieChart } from 'recharts';  // Or your preferred chart library
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export type ChartType = 'line' | 'bar' | 'pie';

export interface MetricChartProps {
  data: any[];
  title: string;
  description?: string;
  type?: ChartType;
  isLoading?: boolean;
  error?: Error | null;
  emptyState?: React.ReactNode;
  accessibilityLabel?: string;
  xKey?: string;
  yKey?: string;
  height?: number;
  width?: number;
}

export const ChartSkeleton = () => (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-1/3" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-[200px] w-full" />
    </CardContent>
  </Card>
);

export const NoDataDisplay = () => (
  <Card>
    <CardHeader>
      <CardTitle>No Data Available</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center items-center h-[200px]">
      <p className="text-muted-foreground">No data available for this period</p>
    </CardContent>
  </Card>
);

export const ErrorDisplay = ({ message }: { message: string }) => (
  <Card>
    <CardHeader>
      <CardTitle>Error Loading Data</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-center items-center h-[200px] text-destructive">
      <p>{message}</p>
    </CardContent>
  </Card>
);

export const MetricChart = ({
  data,
  title,
  description,
  type = 'line',
  isLoading,
  error,
  emptyState,
  accessibilityLabel,
  xKey = 'name',
  yKey = 'value',
  height = 300,
  width = 500,
}: MetricChartProps) => {
  if (isLoading) return <ChartSkeleton />;
  if (error) return <ErrorDisplay message={error.message} />;
  if (!data || data.length === 0) return emptyState || <NoDataDisplay />;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent>
        <div 
          aria-label={accessibilityLabel || `${title} chart`}
          role="img"
          aria-describedby={`${title}-desc`}
        >
          {type === 'line' && (
            <LineChart
              width={width}
              height={height}
              data={data}
              // Additional chart configuration
            />
          )}
          {type === 'bar' && (
            <BarChart
              width={width}
              height={height}
              data={data}
              // Additional chart configuration
            />
          )}
          {type === 'pie' && (
            <PieChart
              width={width}
              height={height}
              // Additional chart configuration
            />
          )}
          <div id={`${title}-desc`} className="sr-only">
            {description || `Chart showing ${title} data`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

### 3. Create Analytics Dashboard Pages

```typescript
// Create restaurant analytics dashboard (src/app/admin/restaurants/[id]/analytics/page.tsx)
import { Suspense } from 'react';
import { auth } from '@clerk/nextjs/server';
import { isAdmin, hasRestaurantAccess } from '@/lib/auth';
import { getRestaurantById } from '@/db/models';
import { RestaurantAnalyticsDashboard } from '@/components/admin/restaurant-analytics-dashboard';
import { RestaurantAnalyticsLoading } from '@/components/admin/restaurant-analytics-loading';

export default async function RestaurantAnalyticsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const { id } = params;
  
  // Check authorization
  const session = await auth();
  if (!session?.userId) {
    redirect('/');
  }
  
  const hasAccess = await isAdmin({ id: session.userId }) || 
                     await hasRestaurantAccess(session.userId, id);
  
  if (!hasAccess) {
    redirect('/');
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Restaurant Analytics</h1>
      
      <Suspense fallback={<RestaurantAnalyticsLoading />}>
        <RestaurantAnalyticsDashboard restaurantId={id} />
      </Suspense>
    </div>
  );
}
```

```typescript
// Create restaurant analytics dashboard component (src/components/admin/restaurant-analytics-dashboard.tsx)
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MetricChart, ChartType } from '@/components/charts/metric-chart';
import { getRestaurantAnalytics, TimePeriod } from '@/services/analytics';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { exportAnalyticsToCSV } from '@/services/export';

interface RestaurantAnalyticsDashboardProps {
  restaurantId: string;
}

export function RestaurantAnalyticsDashboard({ 
  restaurantId 
}: RestaurantAnalyticsDashboardProps) {
  const [period, setPeriod] = useState<TimePeriod>('monthly');
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date } | undefined>();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['restaurantAnalytics', restaurantId, period, dateRange],
    queryFn: () => getRestaurantAnalytics(restaurantId, period, dateRange),
  });
  
  const handleExport = async () => {
    if (!data) return;
    
    await exportAnalyticsToCSV(
      data.dailyStats,
      `restaurant-${restaurantId}-analytics-${period}.csv`,
      ['date', 'punches', 'completions', 'redemptions']
    );
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={period} onValueChange={(value) => setPeriod(value as TimePeriod)}>
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
          </TabsList>
        </Tabs>
        
        {period === 'custom' && (
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
          />
        )}
        
        <Button onClick={handleExport} disabled={!data}>
          Export CSV
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetricChart
          title="Punch Card Activity"
          description="Daily punches over time"
          data={data?.dailyStats || []}
          type="line"
          isLoading={isLoading}
          error={error ? new Error('Failed to load analytics data') : null}
          xKey="date"
          yKey="punches"
        />
        
        <MetricChart
          title="Completion Rate"
          description="Daily completions over time"
          data={data?.dailyStats || []}
          type="bar"
          isLoading={isLoading}
          error={error ? new Error('Failed to load analytics data') : null}
          xKey="date"
          yKey="completions"
        />
        
        <MetricChart
          title="Redemption Activity"
          description="Daily prize redemptions"
          data={data?.dailyStats || []}
          type="line"
          isLoading={isLoading}
          error={error ? new Error('Failed to load analytics data') : null}
          xKey="date"
          yKey="redemptions"
        />
        
        <MetricChart
          title="User Activity Distribution"
          description="Active users by time of day"
          // Map data to time of day distribution
          data={[]}
          type="pie"
          isLoading={isLoading}
          error={error ? new Error('Failed to load analytics data') : null}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Punch Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.totalPunchCards || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Completed Cards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.completedPunchCards || 0}</div>
            <div className="text-muted-foreground">
              {data ? Math.round((data.completedPunchCards / data.totalPunchCards) * 100) : 0}% completion rate
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data?.activeUsers || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 4. Create Export Service

```typescript
// Create export service (src/services/export.ts)
export const exportAnalyticsToCSV = async (
  data: any[],
  filename: string,
  headers: string[]
): Promise<string> => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }
  
  // Create header row
  let csvContent = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      // Handle values with commas by wrapping in quotes
      return typeof value === 'string' && value.includes(',') 
        ? `"${value}"` 
        : String(value);
    });
    csvContent += values.join(',') + '\n';
  });
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  return csvContent;
};
```

### 5. Implement Caching Layer

```typescript
// Create cache service (src/lib/cache.ts)
interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

class CacheService {
  private storage: Map<string, { value: string; expiry: number }> = new Map();
  
  async get(key: string): Promise<string | null> {
    const item = this.storage.get(key);
    
    if (!item) return null;
    
    // Check if expired
    if (item.expiry < Date.now()) {
      this.storage.delete(key);
      return null;
    }
    
    return item.value;
  }
  
  async set(key: string, value: string, ttl = 300): Promise<void> {
    this.storage.set(key, {
      value,
      expiry: Date.now() + (ttl * 1000), // Convert seconds to milliseconds
    });
  }
  
  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }
  
  async clear(): Promise<void> {
    this.storage.clear();
  }
}

export const cache = new CacheService();
```

## Test Plan for New Components

### 1. Analytics Service Tests

```typescript
// Test plan for Analytics Service

// Unit Tests
describe('Analytics Service', () => {
  // Test time range calculation
  describe('getTimeRangeForPeriod', () => {
    it('should return correct time range for daily period', () => {})
    it('should return correct time range for weekly period', () => {})
    it('should return correct time range for monthly period', () => {})
    it('should use custom range when provided', () => {})
  })
  
  // Test restaurant analytics
  describe('getRestaurantAnalytics', () => {
    it('should return cached data when available', () => {})
    it('should fetch and calculate analytics when no cache exists', () => {})
    it('should cache results after fetching', () => {})
    it('should handle errors gracefully', () => {})
  })
  
  // Test system analytics
  describe('getSystemWideAnalytics', () => {
    it('should aggregate data across all restaurants', () => {})
    it('should handle period filtering correctly', () => {})
  })
})
```

### 2. Chart Component Tests

```typescript
// Test plan for Chart Components

// Unit Tests
describe('MetricChart', () => {
  // Test loading state
  it('should render ChartSkeleton when isLoading is true', () => {})
  
  // Test error state
  it('should render ErrorDisplay when error is provided', () => {})
  
  // Test empty state
  it('should render NoDataDisplay when data is empty', () => {})
  
  // Test chart type rendering
  it('should render LineChart when type is line', () => {})
  it('should render BarChart when type is bar', () => {})
  it('should render PieChart when type is pie', () => {})
  
  // Test accessibility
  it('should include proper ARIA attributes for accessibility', () => {})
})
```

### 3. Export Service Tests

```typescript
// Test plan for Export Service

// Unit Tests
describe('exportAnalyticsToCSV', () => {
  // Test CSV formatting
  it('should format data correctly as CSV', () => {})
  
  // Test header handling
  it('should include all specified headers', () => {})
  
  // Test special character handling
  it('should handle values with commas by wrapping in quotes', () => {})
  
  // Test error handling
  it('should throw an error when given empty data', () => {})
})
```

### 4. Dashboard Component Tests

```typescript
// Test plan for RestaurantAnalyticsDashboard

// Integration Tests
describe('RestaurantAnalyticsDashboard', () => {
  // Test period selection
  it('should update period state when tabs are clicked', () => {})
  
  // Test date range picker
  it('should show date range picker only when custom period is selected', () => {})
  
  // Test data fetching
  it('should fetch data with correct parameters', () => {})
  
  // Test export functionality
  it('should call export service when export button is clicked', () => {})
  
  // Test chart rendering
  it('should render all chart components with correct props', () => {})
})
```

### 5. Cache Service Tests

```typescript
// Test plan for Cache Service

// Unit Tests
describe('CacheService', () => {
  // Test get/set operations
  it('should return null for non-existent keys', () => {})
  it('should store and retrieve values correctly', () => {})
  
  // Test expiration
  it('should return null for expired items', () => {})
  it('should clean up expired items when accessed', () => {})
  
  // Test delete and clear
  it('should delete specific keys when requested', () => {})
  it('should clear all keys when clear is called', () => {})
})
```

## Conclusion

The analytics dashboard implementation is partially complete, with basic metrics visualization in place for restaurant admins. However, there are several critical components missing to fully align with the analytics_dashboard.mdc guidelines:

1. A dedicated analytics service with separation of concerns
2. Reusable chart components for consistent visualization
3. Time-based filtering capabilities
4. Data export functionality
5. Comprehensive analytics dashboards for both restaurant and system admins

To complete these missing components, focus on creating the services, components, and pages outlined in the next steps section. This will provide a robust, maintainable analytics system that follows the guidelines and best practices defined in the analytics_dashboard.mdc document.

For testing, begin with the completed components to verify their functionality, then expand to test the new components as they are implemented. This approach will ensure a high-quality, well-tested analytics dashboard that delivers value to both restaurant and system administrators.

---

