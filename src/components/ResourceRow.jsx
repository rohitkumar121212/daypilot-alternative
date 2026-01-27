import React, { memo } from 'react'
import DateCell from './DateCell'
import BookingBlock from './BookingBlock'
import SelectionOverlay from './SelectionOverlay'

/**
 * ResourceRow - Memoized component for better performance
 */
const ResourceRow = memo(({
  resource,
  dates,
  bookings = [],
  selection,
  onCellMouseDown,
  onCellMouseEnter,
  onBookingClick,
  cellWidth = 100
}) => {
  // Filter bookings for this resource
  const resourceBookings = bookings.filter(b => b.resourceId === resource.id)
  
  // Check if this row has an active selection
  const hasSelection = selection && selection.resourceId === resource.id
  
  return (
    <div className="relative" style={{ height: 60 }}>
      {/* Date cells */}
      <div className="flex relative">
        {dates.map((date) => (
          <DateCell
            key={`${resource.id}-${date}`}
            date={date}
            resourceId={resource.id}
            cellWidth={cellWidth}
            isSelected={hasSelection && isDateInSelection(date, selection)}
            onMouseDown={onCellMouseDown}
            onMouseEnter={onCellMouseEnter}
          />
        ))}
      </div>
      
      {/* Booking blocks */}
      {resourceBookings.map(booking => (
        <BookingBlock
          key={booking.id}
          booking={booking}
          dates={dates}
          cellWidth={cellWidth}
          onBookingClick={onBookingClick}
        />
      ))}
      
      {/* Selection overlay */}
      {hasSelection && (
        <SelectionOverlay
          selection={selection}
          dates={dates}
          cellWidth={cellWidth}
        />
      )}
    </div>
  )
})

/**
 * Check if a date is within the current selection range
 */
const isDateInSelection = (date, selection) => {
  if (!selection || !selection.startDate || !selection.endDate) return false
  
  const dates = [selection.startDate, selection.endDate].sort()
  return date >= dates[0] && date <= dates[1]
}

export default ResourceRow

