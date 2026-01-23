import React, { memo } from 'react'

/**
 * DateCell - Individual date cell in the scheduler grid
 * Memoized to prevent unnecessary re-renders
 */
const DateCell = memo(({
  date,
  resourceId,
  cellWidth = 100,
  isSelected = false,
  onMouseDown,
  onMouseEnter
}) => {
  const handleMouseDown = (e) => {
    e.preventDefault()
    onMouseDown?.(date, resourceId, e)
  }
  
  const handleMouseEnter = (e) => {
    onMouseEnter?.(date, resourceId, e)
  }
  
  return (
    <div
      className={`border-r border-b border-gray-200 bg-white cursor-crosshair select-none ${
        isSelected ? 'bg-blue-100 ring-1 ring-blue-300' : 'hover:bg-gray-50'
      }`}
      style={{ width: cellWidth, minWidth: cellWidth, height: 60 }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
    />
  )
})

export default DateCell

