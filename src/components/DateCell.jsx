import React from 'react'

/**
 * DateCell - Individual date cell in the scheduler grid
 * @param {Object} props
 * @param {string} props.date - Date string in YYYY-MM-DD format
 * @param {number} props.resourceId - ID of the resource this cell belongs to
 * @param {number} props.cellWidth - Width of the cell in pixels
 * @param {boolean} props.isSelected - Whether this cell is currently selected
 * @param {Function} props.onMouseDown - Handler for mousedown event
 * @param {Function} props.onMouseEnter - Handler for mouseenter event
 */
const DateCell = ({
  date,
  resourceId,
  cellWidth = 100,
  isSelected = false,
  onMouseDown,
  onMouseEnter
}) => {
  const handleMouseDown = (e) => {
    e.preventDefault()
    if (onMouseDown) {
      onMouseDown(date, resourceId, e)
    }
  }
  
  const handleMouseEnter = (e) => {
    if (onMouseEnter) {
      onMouseEnter(date, resourceId, e)
    }
  }
  
  return (
    <div
      className={`border-r border-b border-gray-200 bg-white cursor-crosshair select-none transition-colors duration-150 ${
        isSelected ? 'bg-blue-100 ring-1 ring-blue-300' : 'hover:bg-gray-50'
      }`}
      style={{ width: `${cellWidth}px`, minWidth: `${cellWidth}px`, height: '60px' }}
      onMouseDown={handleMouseDown}
      onMouseEnter={handleMouseEnter}
      data-date={date}
      data-resource-id={resourceId}
    />
  )
}

export default DateCell

