import React, { useState, useMemo, useEffect } from 'react'
import VirtualizedScheduler from './components/VirtualizedScheduler'
import dayjs from 'dayjs'
const App = () => {
  const [resources, setResources] = useState([])
  const [bookings, setBookings] = useState([])

  const [resourcesLoaded, setResourcesLoaded] = useState(false)
  const [bookingsLoaded, setBookingsLoaded] = useState(false)

  /* =========================
     Create booking (local)
  ========================= */
  const handleBookingCreate = (bookingData) => {
    const newBooking = {
      id: bookings.length + 1,
      ...bookingData
    }
    setBookings(prev => [...prev, newBooking])
  }

  /* =========================
     Parallel data fetching
  ========================= */
  useEffect(() => {
    let cancelled = false

    async function loadData() {
      try {
        const resourcesRequest = fetch(
          'https://aperfectstay.ai/api/aps-pms/apts/?user=6552614495846400&start=2026-01-20'
        )

        const bookingsRequest = fetch(
          'https://aperfectstay.ai/api/aps-pms/reservations/?user=6552614495846400&start=2026-01-20&end=2026-02-20'
        )

        // 🚀 parallel execution
        const [resourcesRes, bookingsRes] = await Promise.all([
          resourcesRequest,
          bookingsRequest
        ])

        const resourcesJson = await resourcesRes.json()
        const bookingsJson = await bookingsRes.json()

        if (cancelled) return

        const normalizedBookingData =
           bookingsJson.data.reservations?.map(parent => ({
            ...parent,
            startDate: dayjs(parent.start).format('YYYY-MM-DD'),
            endDate: dayjs(parent.end).format('YYYY-MM-DD'),
            name: 'Room Booking',
            notes: 'Sample booking for Room-1',
            resourceId: parent?.booking_details?.apartment_id
          })) || []
          
        setResources(resourcesJson?.data?.apt_build_details || [])
        setResourcesLoaded(true)

        setBookings(normalizedBookingData)
        setBookingsLoaded(true)
      } catch (err) {
        console.error('Failed to load scheduler data', err)
      }
    }

    loadData()

    return () => {
      cancelled = true
    }
  }, [])

  /* =========================
     Render
  ========================= */
  return (
    <div className="h-screen w-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Resource Scheduler
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Click and drag to select date ranges for booking
        </p>
      </header>
      <div className="flex-1 overflow-hidden">
        {!resourcesLoaded ? (
          <div className="h-full flex items-center justify-center text-gray-500">
            Loading resources…
          </div>
        ) : (
          <VirtualizedScheduler
            resources={resources}
            bookings={bookings}
            onBookingCreate={handleBookingCreate}
            onResourcesChange={setResources}
            daysToShow={20}
            cellWidth={100}
            rowHeight={60}
          />
        )}
      </div>
    </div>
  )
}

export default App


// import React, { useState, useMemo, useEffect } from 'react'
// import SimpleVirtualScheduler from './components/SimpleVirtualScheduler'
// import VirtualizedScheduler from './components/VirtualizedScheduler'
// import dayjs from 'dayjs'
// import resourcesData from './data/resources.json'
// import bookingsData from './data/bookings.json'

// /**
//  * App - Main application component with sample data
//  */
// const App = () => {
//   // Hierarchical resources imported from JSON file
//   // const [resources, setResources] = useState(resourcesData)
//   const [resources, setResources] = useState([])
  
//   // Sample bookings with relative dates (visible in current timeline)
//   // Bookings can reference either parent (group) or child (room) IDs
//   // const initialBookings = useMemo(() => [
//   //   {
//   //     id: 1,
//   //     resourceId: 'A', // Child room booking in Deluxe group
//   //     startDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
//   //     endDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
//   //     name: 'Room Booking',
//   //     notes: 'Sample booking for Room-1'
//   //   },
//   //   {
//   //     id: 2,
//   //     resourceId: '670DH', // Child room booking in Butterfly group
//   //     startDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),
//   //     endDate: dayjs().add(9, 'day').format('YYYY-MM-DD'),
//   //     name: 'Butterfly Room',
//   //     notes: 'Sample booking for 670 DH'
//   //   }
//   // ], [])
  
//   const [bookings, setBookings] = useState(bookingsData)
  
//   /**
//    * Handle new booking creation
//    */
//   const handleBookingCreate = (bookingData) => {
//     const newBooking = {
//       id: bookings.length + 1,
//       ...bookingData
//     }
//     setBookings(prev => [...prev, newBooking])
//     console.log('New booking created:', newBooking)
//   }

//   async function fetchResourcesData() {
//     const response = await fetch("https://aperfectstay.ai/api/aps-pms/apts/?user=4789839916433408&start=2026-01-20")
//     const data = await response.json()
//     setResources(data?.data.apt_build_details || []) 
//   }

//   async function fetchBookingsData(){
//     const response = await fetch("https://aperfectstay.ai/api/aps-pms/reservations/?user=4789839916433408&start=2026-01-20&end=2026-02-20")
//     const data = await response.json()
//     console.log('Bookings data:', data)
//   }

//   useEffect(() => {
//     fetchResourcesData()
//     fetchBookingsData()
//   }, [])
  
//   return (
//     <div className="h-screen w-screen flex flex-col bg-gray-100">
//       {/* App Header */}
//       <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
//         <h1 className="text-2xl font-bold text-gray-900">
//           Resource Scheduler
//         </h1>
//         <p className="text-sm text-gray-600 mt-1">
//           Click and drag to select date ranges for booking
//         </p>
//       </header>
      
//       {/* Scheduler Components - Side by Side */}
//       <div className="flex-1 overflow-hidden flex flex-col">
//         {/* Simple Virtual Scheduler */}
//         {/* <div className="flex-1 border-b-2 border-gray-300">
//           <div className="bg-blue-50 px-4 py-2 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-blue-800">SimpleVirtualScheduler (Custom Implementation)</h2>
//             <p className="text-sm text-blue-600">Manual virtualization without external dependencies</p>
//           </div>
//           <div className="h-96">
//             <SimpleVirtualScheduler
//               resources={resources}
//               bookings={bookings}
//               onBookingCreate={handleBookingCreate}
//               onResourcesChange={setResources}
//               daysToShow={15}
//               cellWidth={100}
//               rowHeight={60}
//             />
//           </div>
//         </div> */}
        
//         {/* React-Window Virtualized Scheduler */}
//         <div className="flex-1">
//           <div className="bg-green-50 px-4 py-2 border-b border-gray-200">
//             <h2 className="text-lg font-semibold text-green-800">VirtualizedScheduler (react-window)</h2>
//             <p className="text-sm text-green-600">Using react-window FixedSizeList for virtualization</p>
//           </div>
//           <div className="h-[60vh]">
//             <VirtualizedScheduler
//               resources={resources}
//               bookings={bookings}
//               onBookingCreate={handleBookingCreate}
//               onResourcesChange={setResources}
//               daysToShow={15}
//               cellWidth={100}
//               rowHeight={60}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default App

