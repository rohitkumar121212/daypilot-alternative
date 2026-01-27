import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { FixedSizeList } from 'react-window'
import DateHeader from './DateHeader'
import ResourceRow from './ResourceRow'
import BookingModal from './BookingModal'
import FilterBar from './FilterBar'
import { generateDateRange, getDateIndex } from '../utils/dateUtils'

const VirtualizedScheduler = ({
  resources = [],
  bookings = [],
  onBookingCreate,
  onResourcesChange,
  daysToShow = 30,
  cellWidth = 100,
  rowHeight = 60
}) => {
  const dates = useMemo(() => generateDateRange(daysToShow), [daysToShow])
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedBookingId, setSelectedBookingId] = useState('')

  /* =========================
     Selection state
  ========================= */
  const [selection, setSelection] = useState(null)
  const [isSelecting, setIsSelecting] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  const mouseDownRef = useRef(false)
  const startDateRef = useRef(null)
  const startResourceIdRef = useRef(null)

  /* =========================
     Horizontal scroll sync
  ========================= */
  const headerScrollRef = useRef(null)
  const timelineScrollRef = useRef(null)
  const resourceScrollRef = useRef(null)
  const timelineListRef = useRef(null)
  const isSyncingRef = useRef(false)

  /* =========================
     Flatten resources with booking ID filter
  ========================= */
  const visibleRows = useMemo(() => {
    let filteredResources = resources
    
    // Filter by booking ID if selected
    if (selectedBookingId) {
      const matchingBookings = bookings.filter(booking => 
        booking.booking_id.toString().includes(selectedBookingId)
      )
      const matchingResourceIds = new Set(matchingBookings.map(b => b.resourceId))
      
      filteredResources = resources.map(parent => ({
        ...parent,
        expanded: true, // Auto-expand when filtering by booking ID
        children: (parent.children || []).filter(child => 
          matchingResourceIds.has(child.id)
        )
      })).filter(parent => parent.children.length > 0)
    }
    
    // Apply search filter
    if (searchTerm) {
      filteredResources = filteredResources.filter(parent => {
        const parentMatches = parent.name.toLowerCase().includes(searchTerm.toLowerCase())
        const childMatches = (parent.children || []).some(child => 
          child.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        return parentMatches || childMatches
      })
    }

    return filteredResources.flatMap(parent => {
      const parentRow = {
        ...parent,
        type: 'parent'
      }

      if (!parent.expanded) return [parentRow]

      const children = (parent.children || [])
        .filter(child => !searchTerm || child.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map(child => ({
          ...child,
          parentId: parent.id,
          type: 'child'
        }))

      return [parentRow, ...children]
    })
  }, [resources, searchTerm, selectedBookingId, bookings])

  /* =========================
     Cell interactions
  ========================= */
  const handleCellMouseDown = useCallback((date, resourceId, e) => {
    e.preventDefault()
    mouseDownRef.current = true
    startDateRef.current = date
    startResourceIdRef.current = resourceId

    setIsSelecting(true)
    setSelection({
      resourceId,
      startDate: date,
      endDate: date
    })
  }, [])

  const handleCellMouseEnter = useCallback((date, resourceId) => {
    if (!mouseDownRef.current || !isSelecting) return
    if (resourceId !== startResourceIdRef.current) return

    setSelection(prev =>
      prev ? { ...prev, endDate: date } : null
    )
  }, [isSelecting])

  /* =========================
     Mouse up handling
  ========================= */
  useEffect(() => {
    const onMouseUp = () => {
      if (!mouseDownRef.current || !selection) return

      mouseDownRef.current = false
      setIsSelecting(false)

      const startIdx = getDateIndex(selection.startDate, dates)
      const endIdx = getDateIndex(selection.endDate, dates)

      setSelection({
        ...selection,
        startDate: startIdx <= endIdx ? selection.startDate : selection.endDate,
        endDate: startIdx <= endIdx ? selection.endDate : selection.startDate
      })

      setTimeout(() => setModalOpen(true), 80)
    }

    window.addEventListener('mouseup', onMouseUp)
    return () => window.removeEventListener('mouseup', onMouseUp)
  }, [selection, dates])

  /* =========================
     Booking modal
  ========================= */
  const handleModalClose = useCallback(() => {
    setModalOpen(false)
    setSelection(null)
    mouseDownRef.current = false
    setIsSelecting(false)
  }, [])

  const handleBookingConfirm = useCallback(
    (data) => {
      onBookingCreate?.(data)
      handleModalClose()
    },
    [onBookingCreate, handleModalClose]
  )

  /* =========================
     Expand / collapse
  ========================= */
  const handleToggleExpand = useCallback(
    (parentId) => {
      onResourcesChange?.(
        resources.map(r =>
          r.id === parentId ? { ...r, expanded: !r.expanded } : r
        )
      )
    },
    [resources, onResourcesChange]
  )

  /* =========================
     Horizontal scroll sync
  ========================= */
  const syncScroll = (source, target) => {
    if (isSyncingRef.current) return
    isSyncingRef.current = true
    target.scrollLeft = source.scrollLeft
    requestAnimationFrame(() => {
      isSyncingRef.current = false
    })
  }

  /* =========================
     Vertical scroll sync
  ========================= */
  const syncVerticalScroll = useCallback((scrollData) => {
    if (isSyncingRef.current) return
    isSyncingRef.current = true
    
    // Handle FixedSizeList scroll event (has scrollTop property)
    if (typeof scrollData === 'object' && 'scrollTop' in scrollData) {
      if (resourceScrollRef.current) {
        resourceScrollRef.current.scrollTop = scrollData.scrollTop
      }
    }
    
    requestAnimationFrame(() => {
      isSyncingRef.current = false
    })
  }, [])

  const syncResourceScroll = useCallback((e) => {
    if (isSyncingRef.current) return
    isSyncingRef.current = true
    
    if (timelineListRef.current) {
      timelineListRef.current.scrollTo(e.target.scrollTop)
    }
    
    requestAnimationFrame(() => {
      isSyncingRef.current = false
    })
  }, [])

  const containerHeight = 500

  return (
    <div className="w-full h-full flex flex-col bg-white select-none">
      {/* ================= FILTER BAR ================= */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        bookings={bookings}
        selectedBookingId={selectedBookingId}
        onBookingIdChange={setSelectedBookingId}
        onClearFilters={() => {
          setSearchTerm('')
          setSelectedBookingId('')
        }}
      />

      {/* ================= HEADER ================= */}
      <div className="flex border-b bg-gray-50 sticky top-0 z-30">
        <div className="w-48 min-w-48 border-r flex items-center justify-center font-semibold sticky left-0 z-50 bg-gray-50">
          Resources
        </div>

        <div
          ref={headerScrollRef}
          className="flex overflow-x-auto hide-scrollbar"
          onScroll={e => syncScroll(e.target, timelineScrollRef.current)}
        >
          <div className="flex">
            {dates.map(date => (
              <DateHeader key={date} date={date} cellWidth={cellWidth} />
            ))}
          </div>
        </div>
      </div>

      {/* ================= BODY ================= */}
      <div className="flex-1 flex" style={{ height: containerHeight }}>
        {/* Fixed Resource Column */}
        <div className="w-48 min-w-48 border-r border-gray-200 bg-white z-40">
          <div 
            ref={resourceScrollRef}
            className="h-full overflow-y-auto"
            onScroll={syncResourceScroll}
          >
            {visibleRows.map((row, index) => (
              <div
                key={row.id}
                className={`h-[60px] border-b border-gray-200 bg-white flex items-center px-2 ${
                  row.type === 'parent'
                    ? 'font-semibold bg-gray-50'
                    : 'pl-8 text-gray-700'
                }`}
              >
                {row.type === 'parent' && (
                  <button
                    onClick={() => handleToggleExpand(row.id)}
                    className="mr-2 p-1 hover:bg-gray-200 rounded"
                  >
                    ▶
                  </button>
                )}
                <span className="truncate">{row.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scrollable Timeline */}
        <div className="flex-1 relative">
          <div
            ref={timelineScrollRef}
            className="absolute inset-0 overflow-x-auto hide-scrollbar"
            onScroll={e => syncScroll(e.target, headerScrollRef.current)}
          >
            <div style={{ width: dates.length * cellWidth }}>
              <FixedSizeList
                ref={timelineListRef}
                height={containerHeight}
                itemCount={visibleRows.length}
                itemSize={rowHeight}
                width={dates.length * cellWidth}
                style={{ overflowY: 'hidden' }}
              >
                {({ index, style }) => {
                  const row = visibleRows[index]
                  return (
                    <div style={style}>
                      <ResourceRow
                        resource={row}
                        dates={dates}
                        bookings={bookings}
                        selection={selection}
                        onCellMouseDown={handleCellMouseDown}
                        onCellMouseEnter={handleCellMouseEnter}
                        cellWidth={cellWidth}
                      />
                    </div>
                  )
                }}
              </FixedSizeList>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      <BookingModal
        isOpen={modalOpen}
        selection={selection}
        resource={visibleRows.find(r => r.id === selection?.resourceId)}
        onClose={handleModalClose}
        onConfirm={handleBookingConfirm}
      />
    </div>
  )
}

export default VirtualizedScheduler



// import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
// import { FixedSizeList } from 'react-window'
// import DateHeader from './DateHeader'
// import ResourceRow from './ResourceRow'
// import BookingModal from './BookingModal'
// import { generateDateRange, getDateIndex } from '../utils/dateUtils'

// /**
//  * VirtualizedScheduler - Using react-window for battle-tested virtualization
//  */
// const VirtualizedScheduler = ({
//   resources = [],
//   bookings = [],
//   onBookingCreate,
//   onResourcesChange,
//   daysToShow = 30,
//   cellWidth = 100,
//   rowHeight = 60
// }) => {
//   const dates = useMemo(() => generateDateRange(daysToShow), [daysToShow])
  
//   // Selection state
//   const [selection, setSelection] = useState(null)
//   const [isSelecting, setIsSelecting] = useState(false)
//   const [modalOpen, setModalOpen] = useState(false)
  
//   // Track mouse state
//   const mouseDownRef = useRef(false)
//   const startDateRef = useRef(null)
//   const startResourceIdRef = useRef(null)
  
//   // Refs for scroll synchronization
//   const headerScrollRef = useRef(null)
//   const timelineScrollRef = useRef(null)
//   const resourceListRef = useRef(null)
//   const timelineListRef = useRef(null)
//   const isScrollingRef = useRef(false)
  
//   // Normalize hierarchical resources into flat visibleRows array
//   const visibleRows = useMemo(() => {
//     return resources.flatMap(parent => {
//       const parentRow = {
//         ...parent,
//         type: 'parent',
//         isParent: true
//       }
      
//       if (!parent.expanded) {
//         return [parentRow]
//       }
      
//       const childRows = (parent.children || []).map(child => ({
//         ...child,
//         parentId: parent.id,
//         parentName: parent.name,
//         type: 'child',
//         isParent: false
//       }))
      
//       return [parentRow, ...childRows]
//     })
//   }, [resources])
  
//   // Handle mousedown on a date cell
//   const handleCellMouseDown = useCallback((date, resourceId, e) => {
//     e.preventDefault()
//     mouseDownRef.current = true
//     startDateRef.current = date
//     startResourceIdRef.current = resourceId
    
//     setIsSelecting(true)
//     setSelection({
//       resourceId,
//       startDate: date,
//       endDate: date
//     })
//   }, [])
  
//   // Handle mouseenter on a date cell
//   const handleCellMouseEnter = useCallback((date, resourceId, e) => {
//     if (!mouseDownRef.current || !isSelecting) return
//     if (resourceId !== startResourceIdRef.current) return
    
//     setSelection(prev => {
//       if (!prev) return null
//       return {
//         ...prev,
//         endDate: date
//       }
//     })
//   }, [isSelecting])
  
//   // Handle mouseup
//   useEffect(() => {
//     const handleMouseUp = (e) => {
//       if (mouseDownRef.current && isSelecting && selection) {
//         mouseDownRef.current = false
//         setIsSelecting(false)
        
//         const startIndex = getDateIndex(selection.startDate, dates)
//         const endIndex = getDateIndex(selection.endDate, dates)
        
//         const finalStartDate = startIndex <= endIndex ? selection.startDate : selection.endDate
//         const finalEndDate = startIndex <= endIndex ? selection.endDate : selection.startDate
        
//         setSelection({
//           ...selection,
//           startDate: finalStartDate,
//           endDate: finalEndDate
//         })
        
//         setTimeout(() => {
//           setModalOpen(true)
//         }, 100)
//       }
//     }
    
//     window.addEventListener('mouseup', handleMouseUp)
//     return () => window.removeEventListener('mouseup', handleMouseUp)
//   }, [isSelecting, selection, dates])
  
//   // Handle modal close
//   const handleModalClose = useCallback(() => {
//     setModalOpen(false)
//     setSelection(null)
//     mouseDownRef.current = false
//     setIsSelecting(false)
//   }, [])
  
//   // Handle booking confirmation
//   const handleBookingConfirm = useCallback((bookingData) => {
//     if (onBookingCreate) {
//       onBookingCreate(bookingData)
//     }
//     handleModalClose()
//   }, [onBookingCreate, handleModalClose])
  
//   // Handle parent expand/collapse toggle
//   const handleToggleExpand = useCallback((parentId) => {
//     const updatedResources = resources.map(parent => {
//       if (parent.id === parentId) {
//         return { ...parent, expanded: !parent.expanded }
//       }
//       return parent
//     })
    
//     if (onResourcesChange) {
//       onResourcesChange(updatedResources)
//     }
//   }, [resources, onResourcesChange])
  
//   // Get selected resource
//   const selectedResource = useMemo(() => {
//     if (!selection) return null
    
//     const visibleRow = visibleRows.find(r => r.id === selection.resourceId)
//     if (visibleRow) return visibleRow
    
//     for (const parent of resources) {
//       if (parent.id === selection.resourceId) return parent
//       const child = (parent.children || []).find(c => c.id === selection.resourceId)
//       if (child) return child
//     }
    
//     return null
//   }, [selection, visibleRows, resources])
  
//   // Container height for consistent sizing
//   const containerHeight = 500
  
//   // Sync horizontal scrolling
//   const handleHeaderScroll = useCallback((e) => {
//     if (isScrollingRef.current) return
//     isScrollingRef.current = true
//     if (timelineScrollRef.current) {
//       timelineScrollRef.current.scrollLeft = e.target.scrollLeft
//     }
//     requestAnimationFrame(() => {
//       isScrollingRef.current = false
//     })
//   }, [])
  
//   const handleTimelineScroll = useCallback((e) => {
//     if (isScrollingRef.current) return
//     isScrollingRef.current = true
//     if (headerScrollRef.current) {
//       headerScrollRef.current.scrollLeft = e.target.scrollLeft
//     }
//     requestAnimationFrame(() => {
//       isScrollingRef.current = false
//     })
//   }, [])
  
//   // Sync vertical scrolling between the two lists
//   const handleResourceScroll = useCallback(({ scrollTop }) => {
//     if (isScrollingRef.current) return
//     isScrollingRef.current = true
//     if (timelineListRef.current) {
//       timelineListRef.current.scrollTo(scrollTop)
//     }
//     setTimeout(() => {
//       isScrollingRef.current = false
//     }, 0)
//   }, [])
  
//   const handleTimelineListScroll = useCallback(({ scrollTop }) => {
//     if (isScrollingRef.current) return
//     isScrollingRef.current = true
//     if (resourceListRef.current) {
//       resourceListRef.current.scrollTo(scrollTop)
//     }
//     setTimeout(() => {
//       isScrollingRef.current = false
//     }, 0)
//   }, [])

//   return (
//     <div className="w-full h-full flex flex-col bg-white select-none">
//       {/* Header Row */}
//       <div className="flex border-b border-gray-300 bg-gray-50 sticky top-0 z-30 shadow-sm">
//         <div className="w-48 min-w-48 border-r border-gray-200 bg-gray-50 sticky left-0 z-40 flex items-center justify-center font-semibold text-gray-700">
//           Resources
//         </div>
        
//         <div 
//           ref={headerScrollRef}
//           className="flex overflow-x-auto overflow-y-hidden hide-scrollbar"
//           onScroll={handleHeaderScroll}
//         >
//           <div className="flex">
//             {dates.map(date => (
//               <DateHeader
//                 key={date}
//                 date={date}
//                 cellWidth={cellWidth}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
      
//       {/* Virtual Body Container */}
//       <div className="flex-1 flex" style={{ height: containerHeight }}>
//         {/* Resource Column */}
//         <div className="w-48 min-w-48 border-r border-gray-200 bg-white">
//           <FixedSizeList
//             ref={resourceListRef}
//             height={containerHeight}
//             itemCount={visibleRows.length}
//             itemSize={rowHeight}
//             width={192}
//             onScroll={handleResourceScroll}
//           >
//             {({ index, style }) => {
//               const row = visibleRows[index]
//               return (
//                 <div
//                   style={style}
//                   className={`border-b border-gray-200 bg-white flex items-center px-2 font-medium hover:bg-gray-50 ${
//                     row.type === 'parent' 
//                       ? 'font-semibold bg-gray-50' 
//                       : 'pl-8 text-gray-700'
//                   }`}
//                 >
//                   {row.type === 'parent' && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation()
//                         handleToggleExpand(row.id)
//                       }}
//                       className="mr-2 p-1 hover:bg-gray-200 rounded flex-shrink-0"
//                     >
//                       <svg
//                         className={`w-4 h-4 text-gray-600 transform transition-transform ${
//                           row.expanded ? 'rotate-90' : ''
//                         }`}
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                       </svg>
//                     </button>
//                   )}
//                   {row.type === 'child' && <span className="w-6 flex-shrink-0" />}
//                   <span className="flex-1 truncate">{row.name}</span>
//                 </div>
//               )
//             }}
//           </FixedSizeList>
//         </div>
        
//         {/* Timeline */}
//         <div className="flex-1 relative">
//           <div 
//             ref={timelineScrollRef}
//             className="absolute inset-0 overflow-x-auto hide-scrollbar"
//             onScroll={handleTimelineScroll}
//           >
//             <div style={{ width: dates.length * cellWidth, height: containerHeight }}>
//               <FixedSizeList
//                 ref={timelineListRef}
//                 height={containerHeight}
//                 itemCount={visibleRows.length}
//                 itemSize={rowHeight}
//                 width={dates.length * cellWidth}
//                 onScroll={handleTimelineListScroll}
//               >
//                 {({ index, style }) => {
//                   const row = visibleRows[index]
//                   return (
//                     <div style={style}>
//                       <ResourceRow
//                         resource={row}
//                         dates={dates}
//                         bookings={bookings}
//                         selection={selection}
//                         onCellMouseDown={handleCellMouseDown}
//                         onCellMouseEnter={handleCellMouseEnter}
//                         cellWidth={cellWidth}
//                       />
//                     </div>
//                   )
//                 }}
//               </FixedSizeList>
//             </div>
//           </div>
//         </div>
//       </div>
      
//       {/* Booking Modal */}
//       <BookingModal
//         isOpen={modalOpen}
//         selection={selection}
//         resource={selectedResource}
//         onClose={handleModalClose}
//         onConfirm={handleBookingConfirm}
//       />
//     </div>
//   )
// }

// export default VirtualizedScheduler