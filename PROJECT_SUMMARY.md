# DayPilot Alternative - Project Summary

## Overview
A React-based resource scheduler similar to DayPilot, built for property/apartment booking management. The application displays hierarchical resources (buildings > apartments) with booking visualization across a timeline.

## Architecture

### Core Components Structure
```
App.jsx (Main container)
└── VirtualizedScheduler.jsx (Primary scheduler implementation)
    ├── FilterBar.jsx (Search & booking ID filtering)
    ├── DateHeader.jsx (Timeline header with dates)
    └── ResourceRow.jsx (Individual resource row)
        ├── DateCell.jsx (Individual date cells for interaction)
        ├── BookingBlock.jsx (Booking visualization)
        └── SelectionOverlay.jsx (Date range selection overlay)
```

### Data Flow
1. **App.jsx** fetches resources and bookings from API
2. **Resources**: Hierarchical structure (parent buildings with child apartments)
3. **Bookings**: Filtered to match available resource IDs
4. **VirtualizedScheduler**: Handles virtualization, filtering, and interactions

## Key Features

### 1. Hierarchical Resources
- **Parent resources**: Buildings/properties (expandable/collapsible)
- **Child resources**: Individual apartments/units
- **Search functionality**: Can search by parent or child names
- **Auto-expansion**: Parents auto-expand when they match search terms

### 2. Booking Management
- **Visual representation**: Color-coded booking blocks
- **Date handling**: Excludes checkout date (endDate - 1 day for display)
- **Overlap logic**: Shows bookings that span beyond visible date range
- **Split bookings**: Handles `is_split` property for complex bookings

### 3. Date Range Logic
- **Visible timeline**: Configurable number of days (default: 45)
- **Smart overlap detection**: Shows bookings that:
  - Start within visible range
  - End within visible range  
  - Span entire visible range (start before + end after)
- **Full-width spanning**: Long bookings take full timeline width

### 4. Interaction Features
- **Date selection**: Click and drag to select date ranges
- **Booking creation**: Modal for new booking creation
- **Drag & drop**: Move bookings between dates/resources
- **Search & filter**: Resource search + booking ID search

## Current Issue Analysis

### Split Booking Problem
**Issue**: Bookings with `is_split: "true"` are not rendering despite passing all filters.

**Investigation Results**:
- ✅ Split bookings pass resource ID validation (37 valid split bookings)
- ✅ Split bookings have valid dates (e.g., 2025-11-08 to 2026-02-20)
- ✅ BookingBlock has overlap logic for out-of-range dates
- ❌ **Root cause**: Date range mismatch

**Technical Details**:
- **API date range**: 2026-01-20 to 2026-02-20
- **Scheduler timeline**: 45 days from today (~2025-01-30 to 2025-03-15)
- **Split booking dates**: 2025-11-08 to 2026-02-20
- **Problem**: No overlap between booking dates and visible timeline

### BookingBlock Overlap Logic
The component has sophisticated logic to handle out-of-range bookings:

```javascript
// Shows bookings that span beyond visible range
const bookingStartsBeforeRange = startIndex === -1 && booking.startDate < dates[0]
const bookingEndsAfterRange = endIndex === -1 && displayEndDate > dates[dates.length - 1]
const bookingSpansEntireRange = bookingStartsBeforeRange && bookingEndsAfterRange
const bookingOverlapsRange = startIndex !== -1 || endIndex !== -1 || bookingSpansEntireRange
```

**This logic should work**, but the issue is that the booking dates don't overlap with the visible timeline at all.

## Data Structure

### Resources
```javascript
{
  id: number,
  name: string,
  expanded: boolean,
  children: [
    {
      id: number,
      name: string
    }
  ]
}
```

### Bookings
```javascript
{
  id: string,
  booking_id: number,
  resourceId: number, // Maps to child resource ID
  startDate: string, // YYYY-MM-DD
  endDate: string,   // YYYY-MM-DD
  is_split: string,  // "true" or "false"
  backColor: string, // Hex color
  text: string,      // Display text
  // ... other API fields
}
```

## Technical Stack
- **React**: Functional components with hooks
- **react-window**: Virtualization for performance
- **dayjs**: Date manipulation
- **Tailwind CSS**: Styling
- **Vite**: Build tool

## Performance Optimizations
- **Virtualization**: Using react-window FixedSizeList
- **Memoization**: React.memo on ResourceRow and DateCell
- **Efficient filtering**: Set-based resource ID lookups
- **Scroll synchronization**: Synced header and timeline scrolling

## Debugging Capabilities
- Console logging for split vs non-split bookings
- Resource ID validation logging
- Date range overlap debugging
- BookingBlock rendering debugging

## Solution for Split Booking Issue
The split bookings are not rendering because their dates (2025-11-08 to 2026-02-20) don't overlap with the current visible timeline (2025-01-30 to 2025-03-15). 

**Options**:
1. Adjust API date range to match visible timeline
2. Adjust visible timeline to include booking dates
3. Use dynamic date range based on actual booking data