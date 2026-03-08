'use client'

import React, { FC, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type calendarProps = {
  selectedDate: Date | null
  setSelectedDate: (date: Date) => void
}
const CustomCalendar: FC<calendarProps> = ({
  selectedDate,
  setSelectedDate
}) => {
  const [currentDate, setCurrentDate] = useState(new Date())

  const today = new Date() // Get today's date
  const startOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  )
  const endOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  )
  const startDay = startOfMonth.getDay()
  const daysInMonth = endOfMonth.getDate()

  // Function to handle previous/next month navigation
  const changeMonth = (offset: number) => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1)
    )
  }

  // Function to handle date selection
  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
    setSelectedDate(newDate)
  }

  return (
    <div className='w-80 p-4 border border-[#D0D5DD] rounded-lg shadow-md bg-white'>
      {/* Header - Month & Navigation */}
      <div className='flex justify-between items-center mb-4'>
        <button
          onClick={() => changeMonth(-1)}
          className='p-2 rounded-md hover:bg-gray-200'
          title='Previous Month'
        >
          <ChevronLeft className='w-5 h-5' />
        </button>
        <h2 className='text-lg font-semibold'>
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          })}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className='p-2 rounded-md hover:bg-gray-200'
          title='Next Month'
        >
          <ChevronRight className='w-5 h-5' />
        </button>
      </div>

      {/* Days of the Week */}
      <div className='grid grid-cols-7 text-center text-sm font-semibold text-gray-600'>
        {daysOfWeek.map(day => (
          <div key={day} className='py-2'>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className='grid grid-cols-7 text-center'>
        {/* Empty spaces before first day of the month */}
        {Array(startDay)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className='py-2 text-gray-400'></div>
          ))}

        {/* Days of the Month */}
        {Array.from({ length: daysInMonth }, (_, index) => {
          const day = index + 1
          const isSelected =
            selectedDate &&
            selectedDate.getFullYear() === currentDate.getFullYear() &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getDate() === day

          const isToday =
            today.getFullYear() === currentDate.getFullYear() &&
            today.getMonth() === currentDate.getMonth() &&
            today.getDate() === day

          return (
            <div
              key={day}
              onClick={() => handleDateSelect(day)}
              className={cn(
                'py-2 cursor-pointer rounded-md transition',
                isToday && 'bg-secondary-white text-secondary-blue',
                isSelected && 'bg-secondary-blue text-white'
              )}
            >
              {day}
            </div>
          )
        })}
      </div>

      {/* Display Selected Date */}
      {selectedDate && (
        <div className='mt-4 text-center text-sm'>
          Selected Date:{' '}
          <span className='font-semibold'>{selectedDate.toDateString()}</span>
        </div>
      )}
    </div>
  )
}

export default CustomCalendar