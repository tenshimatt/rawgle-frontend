"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export type CalendarProps = {
  mode?: "single" | "multiple"
  selected?: Date | Date[]
  onSelect?: (date: Date | Date[] | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
}

export function Calendar({
  mode = "single",
  selected,
  onSelect,
  disabled,
  className = "",
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate()

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay()

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (mode === "single" && selected instanceof Date) {
      return (
        date.getDate() === selected.getDate() &&
        date.getMonth() === selected.getMonth() &&
        date.getFullYear() === selected.getFullYear()
      )
    }
    if (mode === "multiple" && Array.isArray(selected)) {
      return selected.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      )
    }
    return false
  }

  const isDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return disabled ? disabled(date) : false
  }

  const handleDayClick = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)

    if (isDisabled(day)) return

    if (mode === "single") {
      onSelect?.(date)
    } else if (mode === "multiple") {
      const selectedDates = Array.isArray(selected) ? selected : []
      const isAlreadySelected = selectedDates.some(
        (d) =>
          d.getDate() === date.getDate() &&
          d.getMonth() === date.getMonth() &&
          d.getFullYear() === date.getFullYear()
      )

      if (isAlreadySelected) {
        onSelect?.(selectedDates.filter(
          (d) =>
            !(d.getDate() === date.getDate() &&
              d.getMonth() === date.getMonth() &&
              d.getFullYear() === date.getFullYear())
        ))
      } else {
        onSelect?.([...selectedDates, date])
      }
    }
  }

  const renderDays = () => {
    const days = []

    // Empty cells for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2" />)
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelected(day)
      const disabled = isDisabled(day)

      days.push(
        <button
          key={day}
          onClick={() => handleDayClick(day)}
          disabled={disabled}
          className={`
            p-2 text-center rounded-lg text-sm transition-colors
            ${selected
              ? "bg-teal-600 text-white font-semibold"
              : "hover:bg-gray-100"
            }
            ${disabled
              ? "text-gray-300 cursor-not-allowed hover:bg-transparent"
              : "cursor-pointer"
            }
          `}
        >
          {day}
        </button>
      )
    }

    return days
  }

  return (
    <div className={`p-4 bg-white rounded-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={previousMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={nextMonth}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((name) => (
          <div key={name} className="text-center text-xs font-medium text-gray-600 p-2">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
    </div>
  )
}
