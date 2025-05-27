import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { Box, Tooltip, Chip, CircularProgress, Alert } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import PropTypes from 'prop-types';

import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const eventStyleGetter = (event) => ({
  style: {
    backgroundColor: event.hasMeal ? '#4CAF50' : 
                   event.hasNotes ? '#9C27B0' : 
                   '#2196F3',
    borderRadius: '4px',
    color: 'white',
    padding: '2px 8px',
    fontSize: '0.9rem',
    border: 'none'
  }
});

export default function VisitCalendar() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get('/api/visits/');
        const formattedEvents = response.data.map(visit => ({
          id: visit.id,
          title: visit.visitor_name,
          start: new Date(visit.start_date),
          end: new Date(visit.end_date),
          hasMeal: visit.requirements?.meal_request,
          hasNotes: visit.requirements?.special_notes,
          mealRequest: visit.requirements?.meal_request,
          specialNotes: visit.requirements?.special_notes,
          allDay: true
        }));
        setEvents(formattedEvents);
      } catch {
        setError('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const CustomEvent = ({ event }) => (
    <Tooltip title={
      <div>
        <strong>{event.title}</strong>
        {event.mealRequest && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
            <RestaurantIcon fontSize="small" style={{ marginRight: 4 }} />
            <span>{event.mealRequest}</span>
          </div>
        )}
        {event.specialNotes && (
          <div style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
            <MedicalServicesIcon fontSize="small" style={{ marginRight: 4 }} />
            <span>{event.specialNotes}</span>
          </div>
        )}
      </div>
    }>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <EventNoteIcon fontSize="small" style={{ marginRight: 4 }} />
        <span>{event.title}</span>
      </div>
    </Tooltip>
  );
  CustomEvent.propTypes = {
    event: PropTypes.shape({
      title: PropTypes.string.isRequired,
      mealRequest: PropTypes.string,
      specialNotes: PropTypes.string,
    }).isRequired,
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '75vh', p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        components={{
          event: CustomEvent
        }}
        eventPropGetter={eventStyleGetter}
        style={{ 
          fontFamily: 'inherit',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px'
        }}
        views={['month', 'week', 'day']}
        defaultView="month"
      />
      
      <Box mt={2} display="flex" gap={1} flexWrap="wrap">
        <Chip 
          label="Visits" 
          icon={<EventNoteIcon />} 
          sx={{ bgcolor: '#2196F3', color: 'white' }} 
        />
        <Chip 
          label="Meal Requests" 
          icon={<RestaurantIcon />} 
          sx={{ bgcolor: '#4CAF50', color: 'white' }} 
        />
        <Chip 
          label="Special Notes" 
          icon={<MedicalServicesIcon />} 
          sx={{ bgcolor: '#9C27B0', color: 'white' }} 
        />
      </Box>
    </Box>
  );
}