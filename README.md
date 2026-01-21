# DayPilot Alternative - Resource Scheduler

A custom-built resource scheduler similar to DayPilot, built with React and Tailwind CSS.

## Features

- **Resource-based scheduling**: Display multiple resources (properties) in a fixed left column
- **Interactive date selection**: Click and drag to select date ranges for booking
- **Visual feedback**: Real-time selection highlighting with smooth transitions
- **Booking management**: Create and view bookings with a modal interface
- **Responsive layout**: Horizontal and vertical scrolling with sticky headers
- **Clean architecture**: Modular components with single responsibilities

## Tech Stack

- **React.js** (functional components + hooks)
- **Tailwind CSS** (utility-first styling)
- **dayjs** (date manipulation)
- **Vite** (build tool)

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── Scheduler.jsx          # Main scheduler container
│   ├── ResourceRow.jsx        # Individual resource row
│   ├── DateHeader.jsx         # Timeline date headers
│   ├── DateCell.jsx           # Individual date cells
│   ├── BookingBlock.jsx       # Existing booking visualization
│   ├── SelectionOverlay.jsx  # Selection range overlay
│   └── BookingModal.jsx      # Booking creation modal
├── utils/
│   └── dateUtils.js          # Date utility functions
├── App.jsx                   # Main application component
├── main.jsx                  # Application entry point
└── index.css                 # Tailwind CSS imports
```

## Usage

### Basic Example

```jsx
import Scheduler from './components/Scheduler'

const resources = [
  { id: 1, name: 'Property A' },
  { id: 2, name: 'Property B' }
]

const bookings = [
  {
    id: 1,
    resourceId: 1,
    startDate: '2026-01-10',
    endDate: '2026-01-12'
  }
]

function App() {
  const handleBookingCreate = (bookingData) => {
    console.log('New booking:', bookingData)
  }

  return (
    <Scheduler
      resources={resources}
      bookings={bookings}
      onBookingCreate={handleBookingCreate}
      daysToShow={60}
      cellWidth={100}
    />
  )
}
```

## Component API

### Scheduler

Main scheduler component.

**Props:**
- `resources` (Array): Array of resource objects with `id` and `name`
- `bookings` (Array): Array of booking objects
- `onBookingCreate` (Function): Callback when a new booking is created
- `daysToShow` (Number): Number of days to display (default: 30)
- `cellWidth` (Number): Width of each date cell in pixels (default: 100)

### Booking Data Structure

```javascript
{
  id: Number,
  resourceId: Number,
  startDate: String, // YYYY-MM-DD format
  endDate: String,   // YYYY-MM-DD format
  name: String,      // Optional
  notes: String      // Optional
}
```

## Selection Behavior

1. **Click** on a date cell to start selection
2. **Drag** across cells to expand the selection range
3. Selection is limited to a single resource row
4. **Release** mouse button to finalize selection and open booking modal

## Customization

The scheduler is built with extensibility in mind. Key areas for customization:

- **Styling**: Modify Tailwind classes in component files
- **Date range**: Adjust `daysToShow` prop or modify `generateDateRange` utility
- **Cell width**: Change `cellWidth` prop for different cell sizes
- **Booking rendering**: Customize `BookingBlock` component
- **Modal fields**: Extend `BookingModal` with additional form fields

## Browser Support

Modern browsers with ES6+ support (Chrome, Firefox, Safari, Edge)

