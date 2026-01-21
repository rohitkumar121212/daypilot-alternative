import React from 'react'
import DateCell from './DateCell'
import BookingBlock from './BookingBlock'
import SelectionOverlay from './SelectionOverlay'

/**
 * ResourceRow - Displays date cells, booking blocks, and selection overlay for a single resource
 * 
 * Note: Resource name is rendered separately in Scheduler for proper scroll alignment.
 * This component only handles the timeline cells and overlays.
 * 
 * @param {Object} props
 * @param {Object} props.resource - Resource object with id and name
 * @param {Array<string>} props.dates - Array of date strings
 * @param {Array} props.bookings - Array of bookings for this resource
 * @param {Object} props.selection - Current selection state
 * @param {Function} props.onCellMouseDown - Handler for mousedown on date cell
 * @param {Function} props.onCellMouseEnter - Handler for mouseenter on date cell
 * @param {number} props.cellWidth - Width of each date cell
 */
const ResourceRow = ({
  resource,
  dates,
  bookings = [],
  selection,
  onCellMouseDown,
  onCellMouseEnter,
  cellWidth = 100
}) => {
  // Filter bookings for this resource
  const resourceBookings = bookings.filter(b => b.resourceId === resource.id)
  
  // Check if this row has an active selection
  const hasSelection = selection && selection.resourceId === resource.id
  
  return (
    <div className="relative" style={{ height: '60px' }}>
      {/* Date cells - base layer, flex layout maintains proper spacing */}
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
      
      {/* Booking blocks - absolute positioned above date cells */}
      {resourceBookings.map(booking => (
        <BookingBlock
          key={booking.id}
          booking={booking}
          dates={dates}
          cellWidth={cellWidth}
        />
      ))}
      
      {/* Selection overlay - absolute positioned above bookings */}
      {hasSelection && (
        <SelectionOverlay
          selection={selection}
          dates={dates}
          cellWidth={cellWidth}
        />
      )}
    </div>
  )
}

/**
 * Check if a date is within the current selection range
 */
const isDateInSelection = (date, selection) => {
  if (!selection || !selection.startDate || !selection.endDate) return false
  
  const dates = [selection.startDate, selection.endDate].sort()
  return date >= dates[0] && date <= dates[1]
}

export default ResourceRow

