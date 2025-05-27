import React, { useState, useEffect } from "react";
import "./Calendar.scss";
import { format, addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, isToday, isSameDay } from "date-fns";
import { enGB } from "date-fns/locale";

export default function CustomCalendar({ initialDate, onShowMonthly, events = [] }) {
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());

  useEffect(() => {
    setCurrentDate(initialDate);
  }, [initialDate]);

  const daysInWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const startWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const endWeek = endOfWeek(addWeeks(currentDate, 1), { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: startWeek, end: endWeek });

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <button className="nav-btn" onClick={() => setCurrentDate(subWeeks(currentDate, 2))}>&#10094;</button>
        <h1>{format(currentDate, "MMMM yyyy", { locale: enGB })}</h1>
        <button className="nav-btn" onClick={() => setCurrentDate(addWeeks(currentDate, 2))}>&#10095;</button>
      </div>

      {/* Weekdays Row */}
      <div className="weekdays-row">
        {daysInWeek.map((day, index) => (
          <div key={index} className="weekday">{day}</div>
        ))}
      </div>

      {/* Dates Grid */}
      <div className="dates-grid">
        {weekDays.map((day, index) => {
          const today = isToday(day);
          const dayEvents = events.filter(event => isSameDay(new Date(event.start), day));
          return (
            <div key={index} className={`date-box ${today ? "today" : ""}`}>
              <span className="date-number">{format(day, "d")}</span>
              {today ? (
                <span className="today-text">Today</span>
              ) : (
                <span className="month-text">{format(day, "MMMM", { locale: enGB })}</span>
              )}
              {dayEvents.length > 0 && (
                <div className="event-indicator">{dayEvents.length}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Load More Button */}
      <button className="load-more" onClick={onShowMonthly}>
        Show more dates
      </button>
    </div>
  );
}
