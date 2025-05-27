import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from "date-fns";
import { enGB } from "date-fns/locale";
import "./MonthlyView.scss";

export default function MonthlyView({
    initialDate,
    onClose,
    onSelectDay,
    posts = [],
  }) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saterday", "Sunday"];

  return (
    <div className="modal-overlay">
      <div className="monthly-view-container">
        <button className="close-btn" onClick={onClose}>×</button>
        <div className="monthly-header">
          <button className="nav-btn" onClick={() => setCurrentDate(subMonths(currentDate, 1))}>
            &#10094;
          </button>
          <h2>{format(currentDate, "MMMM yyyy", { locale: enGB })}</h2>
          <button className="nav-btn" onClick={() => setCurrentDate(addMonths(currentDate, 1))}>
            &#10095;
          </button>
        </div>
        <div className="weekdays-row">
          {weekdays.map((day, index) => (
            <div key={index} className="weekday">{day}</div>
          ))}
        </div>
        <div className="days-grid">
          {days.map((day, index) => {
            const hasPost = posts.some((p) =>
              isSameDay(new Date(p.date), day)
            );
            return (
              <div
                key={index}
                className={`day-cell ${
                  !isSameMonth(day, currentDate) ? "disabled" : ""
                } ${isToday(day) ? "today" : ""} ${hasPost ? "has-post" : ""}`}
                onClick={() => {
                  if (isSameMonth(day, currentDate)) onSelectDay(day);
                }}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
