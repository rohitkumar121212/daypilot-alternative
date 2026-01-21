import React from 'react'
import { getDateIndex, daysBetween } from '../utils/dateUtils'

/**
 * BookingBlock - Renders an existing booking as an absolute-positioned block
 * @param {Object} props
 * @param {Object} props.booking - Booking object with id, resourceId, startDate, endDate
 * @param {Array<string>} props.dates - Array of all dates in the timeline
 * @param {number} props.cellWidth - Width of each date cell
 */
const BookingBlock = ({ booking, dates, cellWidth = 100 }) => {
  const startIndex = getDateIndex(booking.startDate, dates)
  const endIndex = getDateIndex(booking.endDate, dates)
  
  // If booking dates are outside the visible range, don't render
  if (startIndex === -1 && endIndex === -1) return null
  
  // Calculate position and width
  const visibleStartIndex = Math.max(0, startIndex)
  const visibleEndIndex = Math.min(dates.length - 1, endIndex)
  
  const left = visibleStartIndex * cellWidth
  const span = visibleEndIndex - visibleStartIndex + 1
  const width = span * cellWidth
  
  return (
    <div
      className="absolute top-1 bottom-1 bg-green-500 border border-green-600 rounded text-white text-xs flex items-center justify-center font-medium shadow-md z-20 pointer-events-none transition-shadow hover:shadow-lg"
      style={{
        left: `${left}px`,
        width: `${width}px`,
        height: '50px'
      }}
      title={`${booking.name || `Booking ${booking.id}`}: ${booking.startDate} to ${booking.endDate}`}
    >
      <span className="truncate px-2">{booking.name || `Booking ${booking.id}`}</span>
    </div>
  )
}

export default BookingBlock

