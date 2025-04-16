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

// Event type colors with gradients
const eventColors = {
  sanitation: 'linear-gradient(45deg, #2196f3 0%, #21cbf3 100%)',
  program: 'linear-gradient(45deg, #4caf50 0%, #8bc34a 100%)',
  other: 'linear-gradient(45deg, #ff9800 0%, #ffc107 100%)'
};

// Mock data for initial calendar events
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Water Quality Inspection',
    start: new Date(new Date().setDate(new Date().getDate() - 2)),
    end: new Date(new Date().setDate(new Date().getDate() - 2)),
    type: 'sanitation',
    description: 'Regular water quality check at main facility',
    location: 'Main Water Treatment Plant'
  },
  {
    id: '2',
    title: 'Community Hygiene Workshop',
    start: new Date(new Date().setDate(new Date().getDate() + 3)),
    end: new Date(new Date().setDate(new Date().getDate() + 3)),
    type: 'program',
    description: 'Educational workshop for community members',
    location: 'Community Center'
  },
  {
    id: '3',
    title: 'Equipment Maintenance',
    start: new Date(new Date().setDate(new Date().getDate() + 1)),
    end: new Date(new Date().setDate(new Date().getDate() + 1)),
    type: 'sanitation',
    description: 'Regular maintenance of filtration systems',
    location: 'Treatment Facility B'
  },
  {
    id: '4',
    title: 'Staff Training',
    start: new Date(new Date().setDate(new Date().getDate() + 5)),
    end: new Date(new Date().setDate(new Date().getDate() + 5)),
    type: 'program',
    description: 'New staff orientation and training session',
    location: 'Training Room'
  },
  {
    id: '5',
    title: 'Stakeholder Meeting',
    start: new Date(new Date().setDate(new Date().getDate() + 7)),
    end: new Date(new Date().setDate(new Date().getDate() + 7)),
    type: 'other',
    description: 'Quarterly meeting with stakeholders',
    location: 'Conference Room A'
  }
];

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
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
    const endDate = new Date(clickedDate.getTime() + 60 * 60 * 1000);
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

  const handleEventDrop = (info: any) => {
    const updatedEvents = events.map(event => {
      if (event.id === info.event.id) {
        return {
          ...event,
          start: info.event.start,
          end: info.event.end || info.event.start,
        };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  const handleEventClick = (info: any) => {
    if (window.confirm(`Do you want to delete the event '${info.event.title}'?`)) {
      handleEventDelete(info.event.id);
    }
  };

  const handleDayCellContent = (args: any) => {
    const isToday = args.date.toDateString() === new Date().toDateString();
    return {
      html: `<div class="calendar-day${isToday ? ' today' : ''}">${args.dayNumberText}</div>`
    };
  };

  const calendarStyles = `
    @keyframes slideIn {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }

    .fc-event {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      border: none !important;
      border-radius: 8px !important;
      padding: 4px 8px !important;
      animation: slideIn 0.4s ease-out;
      cursor: pointer;
    }

    .fc-event:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }

    .fc-daygrid-day:hover {
      background: rgba(0,0,0,0.03);
      transition: background 0.3s ease;
    }

    .fc-toolbar-title {
      font-weight: 700 !important;
      color: #2c3e50;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .fc-button-primary {
      background: linear-gradient(45deg, #2196f3 0%, #21cbf3 100%) !important;
      border: none !important;
      border-radius: 8px !important;
      transition: all 0.3s ease !important;
      text-transform: uppercase !important;
      font-weight: 600 !important;
    }

    .fc-button-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(33,150,243,0.3);
    }

    .today {
      background: #2196f3;
      color: white !important;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
    }
  `;

  return (
    <Box sx={{ 
      height: 'calc(100vh - 80px)',
      width: '100%',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <style>{calendarStyles}</style>
      
      <Paper sx={{ 
        p: 2, 
        mb: 2, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <Typography variant="h5" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          WASH Calendar
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Tooltip title="Filter Events">
            <IconButton size="small" sx={{ color: 'primary.main' }}>
              <FilterList />
            </IconButton>
          </Tooltip>
          {Object.entries(eventColors).map(([type, color]) => (
            <Chip
              key={type}
              label={type.charAt(0).toUpperCase() + type.slice(1)}
              sx={{
                background: selectedTypes.includes(type as EventType) ? color : 'transparent',
                color: selectedTypes.includes(type as EventType) ? 'white' : 'inherit',
                border: 'none',
                transition: 'all 0.3s ease',
                transform: 'scale(1)',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                },
                '& .MuiChip-label': {
                  fontWeight: 600
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
                background: 'linear-gradient(45deg, #2196f3 0%, #21cbf3 100%)',
                color: 'white',
                boxShadow: '0 4px 12px rgba(33,150,243,0.3)',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 16px rgba(33,150,243,0.4)'
                }
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
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        borderRadius: '16px',
        background: 'white',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
        }
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
            backgroundColor: 'transparent',
            borderColor: 'transparent',
            classNames: ['event-card'],
            extendedProps: {
              style: {
                background: eventColors[event.type],
                color: '#ffffff',
                fontSize: '0.9em',
                fontWeight: 500,
              }
            }
          }))}
          dateClick={handleDateClick}
          height="100%"
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventDrop={handleEventDrop}
          eventClick={handleEventClick}
          dayCellContent={handleDayCellContent}
        />
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog} 
        maxWidth="sm" 
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            transform: 'translateY(-20px)',
            opacity: 0,
            transition: 'all 0.3s ease',
            borderRadius: '16px',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          },
          '& .MuiDialog-paper.MuiDialog-paperScrollBody': {
            transform: 'translateY(0)',
            opacity: 1,
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          borderBottom: '1px solid rgba(0,0,0,0.1)',
          pb: 1
        }}>
          Create New Event
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Event Title"
              fullWidth
              value={newEvent.title}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2196f3'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderWidth: '2px'
                  }
                }
              }}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Start Date & Time"
                value={newEvent.start}
                onChange={(date: Date | null) => setNewEvent({ ...newEvent, start: date })}
                sx={{ width: '100%' }}
                slotProps={{
                  textField: {
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2196f3'
                        }
                      }
                    }
                  }
                }}
              />
              <DateTimePicker
                label="End Date & Time"
                value={newEvent.end}
                onChange={(date: Date | null) => setNewEvent({ ...newEvent, end: date })}
                sx={{ width: '100%' }}
                minDateTime={newEvent.start || undefined}
                slotProps={{
                  textField: {
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2196f3'
                        }
                      }
                    }
                  }
                }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select
                value={newEvent.type || 'other'}
                label="Event Type"
                onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
                sx={{
                  borderRadius: '8px',
                  '& .MuiSelect-select': {
                    padding: '12px 14px'
                  }
                }}
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
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2196f3'
                  }
                }
              }}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newEvent.description}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  transition: 'all 0.3s ease',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#2196f3'
                  }
                }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleCloseDialog} 
            sx={{
              color: '#666',
              '&:hover': {
                background: 'rgba(0,0,0,0.05)'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleAddEvent} 
            variant="contained" 
            disabled={!newEvent.title}
            sx={{
              background: 'linear-gradient(45deg, #2196f3 0%, #21cbf3 100%)',
              borderRadius: '8px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              boxShadow: '0 4px 12px rgba(33,150,243,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 6px 16px rgba(33,150,243,0.4)'
              }
            }}
          >
            Create Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CalendarPage;