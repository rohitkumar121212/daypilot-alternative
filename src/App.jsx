import React, { useState, useMemo } from 'react'
import SimpleVirtualScheduler from './components/SimpleVirtualScheduler'
import dayjs from 'dayjs'
import resourcesData from './data/resources.json'

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
  
  const [bookings, setBookings] = useState(initialBookings)
  
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
      
      {/* Scheduler Component */}
      <div className="flex-1 overflow-hidden">
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
    </div>
  )
}

export default App

// const initialBookings = () => [
//   {
//     id: 1,
//     resourceId: 'A', // Child room booking in Deluxe group
//     startDate: dayjs('2026-01-21T00:00:00').format('YYYY-MM-DD'),
//     // startDate:'2026-01-22T00:00:00',
//     endDate: dayjs('2026-01-24T00:00:00').format('YYYY-MM-DD'),
//     // startDate: dayjs().add(3, 'day').format('YYYY-MM-DD'),
//     // endDate: dayjs().add(5, 'day').format('YYYY-MM-DD'),
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
// ]
const initialBookings= [
  {
      "Lead_Source_icon": "false",
      "backColor": "#40c970",
      "barHidden": "true",
      "booking_id": 5342061332004864,
      "bubbleHtml": "{'rooms': '3', 'price': 'N/A', 'paid': '700.0', 'days': '2', 'start': '2026-01-22 00:00', 'end': '2026-01-24 00:00', 'name': ' ', 'phone': 'NA', 'email': 'harsh.patel@thesqua.re', 'apartment': 'Room - 2', 'booking_type': 'reserve', 'booking_key': '5342061332004864', 'adult_count': '1', 'child_count': '0', 'nightly_rate': '0.0', 'enq_app_id': '', 'enq_model_id': '#', 'split_booking': 'False', 'apartment_id': '4729710451884032', 'booked_by': 'Aperfect Stay', 'reserved_till': 'NA', 'checkin_status': 'NA', 'checkout_status': 'NA', 'guarantee': 'false', 'open_case': 'false', 'open_task': 'false', 'guest_key': '4700066800467968', 'sales_channel': 'Booking Engine', 'cancellation_policy': 'NA', 'notes': '', 'Lead_Source': '#', 'reservation_id': 5406776523489280, 'channex_id': '', 'booking_notes': 'NA'}",
      "consider_for_overbooking": "true",
      "cssClass": "",
      "end": "2026-01-24T00:00:00",
      "guarantee": "false",
      "id": "5342061332004864",
      "is_split": "false",
      "open_case": "false",
      "open_task": "false",
      "requires_attention": false,
      "resourceId": "A",
      "sales_channel": "Booking Engine",
      "start": "2026-01-22T00:00:00",
      "tags": "Booking Engine",
      "text": " ",
      "startDate": dayjs('2026-01-21T00:00:00').format('YYYY-MM-DD'),
      "endDate": dayjs('2026-01-28T00:00:00').format('YYYY-MM-DD'),
      "name": 'Room Booking',
      "notes": 'Sample booking for Room-1'
    },
    {
      "Lead_Source_icon": "false",
      "backColor": "#40c970",
      "barHidden": "true",
      "booking_id": 5342061332004864,
      "bubbleHtml": "{'rooms': '3', 'price': 'N/A', 'paid': '700.0', 'days': '2', 'start': '2026-01-22 00:00', 'end': '2026-01-24 00:00', 'name': ' ', 'phone': 'NA', 'email': 'harsh.patel@thesqua.re', 'apartment': 'Room - 2', 'booking_type': 'reserve', 'booking_key': '5342061332004864', 'adult_count': '1', 'child_count': '0', 'nightly_rate': '0.0', 'enq_app_id': '', 'enq_model_id': '#', 'split_booking': 'False', 'apartment_id': '4729710451884032', 'booked_by': 'Aperfect Stay', 'reserved_till': 'NA', 'checkin_status': 'NA', 'checkout_status': 'NA', 'guarantee': 'false', 'open_case': 'false', 'open_task': 'false', 'guest_key': '4700066800467968', 'sales_channel': 'Booking Engine', 'cancellation_policy': 'NA', 'notes': '', 'Lead_Source': '#', 'reservation_id': 5406776523489280, 'channex_id': '', 'booking_notes': 'NA'}",
      "consider_for_overbooking": "true",
      "cssClass": "",
      "end": "2026-01-24T00:00:00",
      "guarantee": "false",
      "id": "5342061332004864",
      "is_split": "false",
      "open_case": "false",
      "open_task": "false",
      "requires_attention": false,
      "resourceId": "670DH",
      "sales_channel": "Booking Engine",
      "start": "2026-01-22T00:00:00",
      "startDate": dayjs('2026-01-22T00:00:00').format('YYYY-MM-DD'),
      "endDate": dayjs('2026-01-24T00:00:00').format('YYYY-MM-DD'),
      "name": 'Butterfly Room',
      "notes": 'Sample booking for 670 DH',
      "tags": "Booking Engine",
      "text": " "
    },
    {
      "Lead_Source_icon": "false",
      "backColor": "#40c970",
      "barHidden": "true",
      "booking_id": 5342061332004864,
      "bubbleHtml": "{'rooms': '3', 'price': 'N/A', 'paid': '700.0', 'days': '2', 'start': '2026-01-22 00:00', 'end': '2026-01-24 00:00', 'name': ' ', 'phone': 'NA', 'email': 'harsh.patel@thesqua.re', 'apartment': 'Room - 2', 'booking_type': 'reserve', 'booking_key': '5342061332004864', 'adult_count': '1', 'child_count': '0', 'nightly_rate': '0.0', 'enq_app_id': '', 'enq_model_id': '#', 'split_booking': 'False', 'apartment_id': '4729710451884032', 'booked_by': 'Aperfect Stay', 'reserved_till': 'NA', 'checkin_status': 'NA', 'checkout_status': 'NA', 'guarantee': 'false', 'open_case': 'false', 'open_task': 'false', 'guest_key': '4700066800467968', 'sales_channel': 'Booking Engine', 'cancellation_policy': 'NA', 'notes': '', 'Lead_Source': '#', 'reservation_id': 5406776523489280, 'channex_id': '', 'booking_notes': 'NA'}",
      "consider_for_overbooking": "true",
      "cssClass": "",
      "end": "2026-01-24T00:00:00",
      "guarantee": "false",
      "id": "5342061332004864",
      "is_split": "false",
      "open_case": "false",
      "open_task": "false",
      "requires_attention": false,
      "resourceId": "Room - 2",
      "sales_channel": "Booking Engine",
      "start": "2026-01-22T00:00:00",
      "tags": "Booking Engine",
      "text": " "
    }
]