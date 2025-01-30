import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add as AddIcon, FilterList } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';

// Event type definitions
export type EventType = 'sanitation' | 'program' | 'other';

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: EventType;
  description?: string;
  location?: string;
}

interface NewEventState {
  title: string;
  type: EventType;
  description?: string;
  location?: string;
  start: Date | null;
  end: Date | null;
}

// Event type colors
const eventColors = {
  sanitation: '#2196f3', // Blue
  program: '#4caf50',    // Green
  other: '#ff9800'       // Orange
};

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState<NewEventState>({
    title: '',
    type: 'other',
    description: '',
    location: '',
    start: null,
    end: null
  });
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>(['sanitation', 'program', 'other']);

  const handleDateClick = (arg: any) => {
    const clickedDate = arg.date;
    const endDate = new Date(clickedDate.getTime() + 60 * 60 * 1000); // 1 hour later
    setSelectedDate(clickedDate);
    setNewEvent({
      ...newEvent,
      start: clickedDate,
      end: endDate
    });
    setOpenDialog(true);
  };

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const event: CalendarEvent = {
        id: Date.now().toString(),
        title: newEvent.title,
        start: newEvent.start,
        end: newEvent.end,
        type: newEvent.type as EventType,
        description: newEvent.description,
        location: newEvent.location
      };

      setEvents([...events, event]);
      handleCloseDialog();
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDate(null);
    setNewEvent({
      title: '',
      type: 'other',
      description: '',
      location: '',
      start: null,
      end: null
    });
  };

  const toggleEventType = (type: EventType) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredEvents = events.filter(event => selectedTypes.includes(event.type));

  return (
    <Box sx={{ 
      height: 'calc(100vh - 80px)', // Account for top padding and header
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
          Calendar
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Filter Events">
            <IconButton size="small">
              <FilterList />
            </IconButton>
          </Tooltip>
          {Object.entries(eventColors).map(([type, color]) => (
            <Chip
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              sx={{
                bgcolor: selectedTypes.includes(type as EventType) ? color : 'transparent',
                color: selectedTypes.includes(type as EventType) ? 'white' : 'inherit',
                border: `1px solid ${color}`,
                '&:hover': {
                  bgcolor: selectedTypes.includes(type as EventType) ? color : 'transparent',
                }
              }}
              onClick={() => toggleEventType(type as EventType)}
            />
          ))}
          <Tooltip title="Add Event">
            <IconButton 
              color="primary" 
              onClick={() => setOpenDialog(true)}
              sx={{ 
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      <Paper sx={{ 
        p: 2, 
        flex: 1,
        minHeight: 0, // Important for proper flex behavior
        display: 'flex',
        flexDirection: 'column'
      }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={filteredEvents.map(event => ({
            ...event,
            backgroundColor: eventColors[event.type],
            borderColor: eventColors[event.type]
          }))}
          dateClick={handleDateClick}
          height="100%"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
        />
      </Paper>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Event Title"
              fullWidth
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Date & Time"
                value={newEvent.start}
                onChange={(date: Date | null) => setNewEvent({ ...newEvent, start: date })}
                sx={{ width: '100%' }}
              />
              <DateTimePicker
                label="End Date & Time"
                value={newEvent.end}
                onChange={(date: Date | null) => setNewEvent({ ...newEvent, end: date })}
                sx={{ width: '100%' }}
                minDateTime={newEvent.start || undefined}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={newEvent.type || 'other'}
                label="Event Type"
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
              >
                <MenuItem value="sanitation">Sanitation</MenuItem>
                <MenuItem value="program">Program</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Location"
              fullWidth
              value={newEvent.location}
              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleAddEvent} 
            variant="contained" 
            disabled={!newEvent.title}
          >
            Add Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage; 