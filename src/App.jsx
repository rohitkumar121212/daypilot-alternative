import React, { useState, useMemo } from 'react'
import SimpleVirtualScheduler from './components/SimpleVirtualScheduler'
import VirtualizedScheduler from './components/VirtualizedScheduler'
import dayjs from 'dayjs'
import resourcesData from './data/resources.json'
import bookingsData from './data/bookings.json'

/**
 * App - Main application component with sample data
 */
const App = () => {
  // Hierarchical resources imported from JSON file
  const [resources, setResources] = useState(resourcesData)
  
  // Sample bookings with relative dates (visible in current timeline)
  // Bookings can reference either parent (group) or child (room) IDs
  // const initialBookings = useMemo(() => [
  //   {
  //     id: 1,
  //     resourceId: 'A', // Child room booking in Deluxe group
  //     startDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
  //     endDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
  //     name: 'Room Booking',
  //     notes: 'Sample booking for Room-1'
  //   },
  //   {
  //     id: 2,
  //     resourceId: '670DH', // Child room booking in Butterfly group
  //     startDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
  //     endDate: dayjs().add(9, 'day').format('YYYY-MM-DD'),
  //     name: 'Butterfly Room',
  //     notes: 'Sample booking for 670 DH'
  //   }
  // ], [])
  
  const [bookings, setBookings] = useState(bookingsData)
  
  /**
   * Handle new booking creation
   */
  const handleBookingCreate = (bookingData) => {
    const newBooking = {
      id: bookings.length + 1,
      ...bookingData
    }
    setBookings(prev => [...prev, newBooking])
    console.log('New booking created:', newBooking)
  }
  
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      {/* App Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Resource Scheduler
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Click and drag to select date ranges for booking
        </p>
      </header>
      
      {/* Scheduler Components - Side by Side */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* Simple Virtual Scheduler */}
        {/* <div className="flex-1 border-b-2 border-gray-300">
          <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-blue-800">SimpleVirtualScheduler (Custom Implementation)</h2>
            <p className="text-sm text-blue-600">Manual virtualization without external dependencies</p>
          </div>
          <div className="h-96">
            <SimpleVirtualScheduler
              resources={resources}
              bookings={bookings}
              onBookingCreate={handleBookingCreate}
              onResourcesChange={setResources}
              daysToShow={15}
              cellWidth={100}
              rowHeight={60}
            />
          </div>
        </div> */}
        
        {/* React-Window Virtualized Scheduler */}
        <div className="flex-1">
          <div className="bg-green-50 px-4 py-2 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-green-800">VirtualizedScheduler (react-window)</h2>
            <p className="text-sm text-green-600">Using react-window FixedSizeList for virtualization</p>
          </div>
          <div className="h-96">
            <VirtualizedScheduler
              resources={resources}
              bookings={bookings}
              onBookingCreate={handleBookingCreate}
              onResourcesChange={setResources}
              daysToShow={15}
              cellWidth={100}
              rowHeight={60}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

