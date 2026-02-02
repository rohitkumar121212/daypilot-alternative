# Sticky Resource Column Attempts

## Goal
Make the resource column sticky (like the header) while keeping the timeline scrollable horizontally.
**CONSTRAINT**: Must maintain react-window virtualization for thousands of rows/columns performance.

## Attempt 1: Separate FixedSizeList Components
**Date**: Previous attempt
**Approach**: Split the unified FixedSizeList into two separate lists:
- Sticky resource column with its own FixedSizeList
- Separate timeline FixedSizeList for horizontal scrolling

**Issues Encountered**:
1. **Resource-Booking Misalignment**: Bookings no longer align with correct resource rows
2. **Data Loss During Scroll**: One list loses data when scrolling the other
3. **Broken Scroll Sync**: Two separate scroll contexts cause synchronization issues
4. **Virtualization Conflicts**: React-window virtualization doesn't work well with separate containers

**Result**: ❌ FAILED - Reverted due to alignment and data loss issues

---

## Attempt 2: CSS Transform with Scroll Tracking
**Date**: Previous attempt
**Approach**: Keep unified FixedSizeList but use CSS transforms to make resource column appear sticky:
- Track horizontal scroll position
- Apply `transform: translateX(scrollOffset)` to resource column
- Maintain single FixedSizeList structure

**Issues Encountered**:
1. **Vertical Scroll Isolation**: Vertical scrolling only worked on resource column, not the whole section
2. **Scroll Event Conflicts**: Transform interfered with react-window's scroll handling
3. **Performance Impact**: Continuous transform updates during scroll

**Result**: ❌ FAILED - Vertical scroll accessibility broken

## Attempt 3: Overlay Sticky Resource Column
**Date**: Current attempt
**Approach**: Keep original FixedSizeList + overlay sticky resource column:
- Original unified FixedSizeList remains unchanged
- Added absolute positioned overlay with separate FixedSizeList for resource names only
- Overlay syncs vertically with main timeline
- Overlay has `pointer-events-auto` for expand/collapse functionality

**Issues Encountered**:
1. **User reported failure** - Specific issues not detailed
2. **Potential Issues**: Double rendering, scroll sync complexity, overlay interaction conflicts

**Result**: ❌ FAILED - Reverted back to working baseline

---

## Working Baseline (Current)
**Structure**: Single unified FixedSizeList containing both resource column and timeline
**Benefits**: 
- Perfect resource-booking alignment
- Unified scroll context
- No data loss
- Reliable virtualization
- Full vertical scroll accessibility

**Limitations**:
- Resource column scrolls with timeline (not sticky)

---

## Remaining React-Window Compatible Approaches

### Approach 4: Custom react-window Component
**Concept**: Extend FixedSizeList to support sticky first column
- Fork react-window or create custom virtualized component
- Built-in sticky column support

**Pros**: 
- Native sticky support
- Optimal performance
- Clean implementation

**Cons**: 
- Complex implementation
- Maintenance overhead

### Approach 5: CSS Grid + react-window Hybrid
**Concept**: Use CSS Grid for layout but maintain virtualization
```jsx
<div className="grid" style={{ gridTemplateColumns: '288px 1fr' }}>
  <div className="sticky left-0">
    <FixedSizeList>{/* Resources only */}</FixedSizeList>
  </div>
  <div>
    <FixedSizeList>{/* Timeline only */}</FixedSizeList>
  </div>
</div>
```
**Pros**: 
- CSS Grid handles sticky behavior
- Maintains virtualization

**Cons**: 
- Back to separate lists issue
- Potential alignment problems

---

## Recommendation
**Consider Approach 4 (Custom react-window)** or **Approach 5 (CSS Grid Hybrid)** - Both maintain virtualization but require more complex implementation.