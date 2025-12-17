import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CdkScrollableModule } from '@angular/cdk/scrolling';

interface Event {
  id: string;
  title: string;
  day: number;
  venues: number[];
  startTime: string;
  endTime: string;
  color: string;
}

interface DayInfo {
  name: string;
  date: string;
}

@Component({
  selector: 'app-timetable',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatCardModule, MatIconModule, MatButtonModule, CdkScrollableModule],
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  @ViewChild('venuesHeader') venuesHeader!: ElementRef;
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChild('venuesContent') venuesContent!: ElementRef;
  
  days: DayInfo[] = [];
  timeSlots: string[] = [];
  events: Event[] = [];
  venues: string[] = [];
  selectedDay = 0;
  currentWeekStart = new Date();

  ngOnInit() {
    console.log('=== ngOnInit START ===');
    this.loadData();
    this.generateCurrentWeek();
    this.generateTimeSlots();
    console.log('=== ngOnInit END ===');
    console.log('Final state:', { venues: this.venues, events: this.events, currentWeekStart: this.currentWeekStart });
  }

  generateCurrentWeek() {
    this.days = [];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(this.currentWeekStart);
      date.setDate(this.currentWeekStart.getDate() + i);
      this.days.push({
        name: dayNames[i],
        date: date.toISOString().split('T')[0]
      });
    }
  }

  getCurrentWeekOffset(): number {
    const defaultWeekStart = this.getDefaultWeekStart();
    const daysDiff = Math.floor((this.currentWeekStart.getTime() - defaultWeekStart.getTime()) / (1000 * 60 * 60 * 24));
    const weekOffset = Math.floor(daysDiff / 7);
    console.log('getCurrentWeekOffset:', { defaultWeekStart, currentWeekStart: this.currentWeekStart, daysDiff, weekOffset });
    return weekOffset;
  }

  generateTimeSlots() {
    for (let hour = 8; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        this.timeSlots.push(time);
      }
    }
  }

  // Default data functions
  getDefaultVenues(): string[] {
    return ['Venue1', 'Venue2', 'Venue3', 'Venue4', 'Venue5', 'Venue6', 'Venue7', 'Venue8', 'Venue9', 'Venue10'];
  }

  getDefaultEvents(): Event[] {
    return [
      // Week 1 Events (days 0-6)
      { id: '1', title: 'Event1', day: 0, venues: [0], startTime: '08:00', endTime: '08:30', color: '#4CAF50' },
      { id: '2', title: 'Event2', day: 0, venues: [0, 1], startTime: '10:00', endTime: '10:30', color: '#FF9800' },
      { id: '3', title: 'Event3', day: 0, venues: [2], startTime: '09:45', endTime: '10:45', color: '#2196F3' },
      { id: '4', title: 'Meeting', day: 1, venues: [1], startTime: '09:00', endTime: '10:00', color: '#9C27B0' },
      { id: '5', title: 'Training', day: 2, venues: [0, 2], startTime: '14:00', endTime: '15:30', color: '#FF5722' },
      { id: '6', title: 'Conference', day: 3, venues: [3], startTime: '11:00', endTime: '12:00', color: '#607D8B' },
      { id: '7', title: 'Workshop', day: 4, venues: [1, 3], startTime: '13:00', endTime: '14:30', color: '#795548' },
      
      // Week 2 Events (days 7-13)
      { id: '8', title: 'Seminar', day: 7, venues: [0], startTime: '08:30', endTime: '09:30', color: '#3F51B5' },
      { id: '9', title: 'Team Meeting', day: 7, venues: [2, 3], startTime: '15:00', endTime: '16:00', color: '#009688' },
      { id: '10', title: 'Presentation', day: 8, venues: [1], startTime: '10:30', endTime: '11:30', color: '#FFC107' },
      { id: '11', title: 'Review', day: 9, venues: [0, 1], startTime: '12:00', endTime: '13:00', color: '#E91E63' },
      { id: '12', title: 'Planning', day: 10, venues: [2], startTime: '09:15', endTime: '10:45', color: '#8BC34A' },
      { id: '13', title: 'Demo', day: 11, venues: [3], startTime: '14:30', endTime: '15:30', color: '#FF9800' },
      { id: '14', title: 'Retrospective', day: 12, venues: [0, 2], startTime: '16:00', endTime: '17:00', color: '#673AB7' }
    ];
  }

  getDefaultSelectedDay(): number {
    return 0;
  }

  getDefaultWeekStart(): Date {
    // Fixed reference date - December 16, 2024 (Monday)
    return new Date('2024-12-16T00:00:00.000Z');
  }

  // Initialize localStorage with default values - force refresh
  initializeData() {
    // Clear existing data to force fresh initialization
    localStorage.removeItem('timetable-venues');
    localStorage.removeItem('timetable-events');
    localStorage.removeItem('timetable-selectedDay');
    localStorage.removeItem('timetable-weekStart');
    
    // Set fresh default data
    localStorage.setItem('timetable-venues', JSON.stringify(this.getDefaultVenues()));
    localStorage.setItem('timetable-events', JSON.stringify(this.getDefaultEvents()));
    localStorage.setItem('timetable-selectedDay', JSON.stringify(this.getDefaultSelectedDay()));
    localStorage.setItem('timetable-weekStart', JSON.stringify(this.getDefaultWeekStart().toISOString()));
  }

  // Load data from localStorage
  loadData() {
    console.log('=== loadData START ===');
    console.log('localStorage before init:', {
      venues: localStorage.getItem('timetable-venues'),
      events: localStorage.getItem('timetable-events'),
      weekStart: localStorage.getItem('timetable-weekStart')
    });
    
    this.initializeData();
    
    console.log('localStorage after init:', {
      venues: localStorage.getItem('timetable-venues'),
      events: localStorage.getItem('timetable-events'),
      weekStart: localStorage.getItem('timetable-weekStart')
    });
    
    this.venues = JSON.parse(localStorage.getItem('timetable-venues') || '[]');
    this.events = JSON.parse(localStorage.getItem('timetable-events') || '[]');
    this.selectedDay = JSON.parse(localStorage.getItem('timetable-selectedDay') || '0');
    const weekStartStr = JSON.parse(localStorage.getItem('timetable-weekStart') || 'null');
    if (weekStartStr) {
      this.currentWeekStart = new Date(weekStartStr);
    } else {
      this.currentWeekStart = this.getDefaultWeekStart();
    }
    console.log('Loaded venues:', this.venues);
    console.log('Loaded events:', this.events);
    console.log('Current week start:', this.currentWeekStart);
    console.log('=== loadData END ===');
  }

  // Save methods
  saveVenues() {
    localStorage.setItem('timetable-venues', JSON.stringify(this.venues));
  }

  saveEvents() {
    localStorage.setItem('timetable-events', JSON.stringify(this.events));
  }

  saveSelectedDay() {
    localStorage.setItem('timetable-selectedDay', JSON.stringify(this.selectedDay));
  }

  saveWeekStart() {
    localStorage.setItem('timetable-weekStart', JSON.stringify(this.currentWeekStart.toISOString()));
  }

  getEventsForDay(day: number): Event[] {
    const weekOffset = this.getCurrentWeekOffset();
    const absoluteDay = (weekOffset * 7) + day;
    const filteredEvents = this.events.filter(event => event.day === absoluteDay);
    console.log(`getEventsForDay(${day}): weekOffset=${weekOffset}, absoluteDay=${absoluteDay}, found ${filteredEvents.length} events:`, filteredEvents);
    return filteredEvents;
  }

  getEventPosition(event: Event) {
    debugger
    const startIndex = this.timeSlots.indexOf(event.startTime);
    const endIndex = this.timeSlots.indexOf(event.endTime);
    const minVenue = Math.min(...event.venues);
    const maxVenue = Math.max(...event.venues);
    
    return {
      top: `${startIndex * 60}px`,
      height: `${(endIndex - startIndex) * 60}px`,
      left: `${minVenue * 200}px`,
      width: `${(maxVenue - minVenue + 1) * 200}px`
    };
  }



  onTabChange(event: any) {
    this.selectedDay = event.index;
    this.saveSelectedDay();
    console.log('Tab changed to:', event.index);
  }

  previousWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() - 7);
    this.generateCurrentWeek();
    this.selectedDay = 0;
    this.saveWeekStart();
    this.saveSelectedDay();
  }

  nextWeek() {
    this.currentWeekStart.setDate(this.currentWeekStart.getDate() + 7);
    this.generateCurrentWeek();
    this.selectedDay = 0;
    this.saveWeekStart();
    this.saveSelectedDay();
  }

  onScroll(event: any) {
    const scrollElement = event.target as HTMLElement;
    if (this.venuesHeader) {
      this.venuesHeader.nativeElement.scrollLeft = scrollElement.scrollLeft;
    }
    
    const venuesContent = document.querySelector('.venues-content') as HTMLElement;
    if (venuesContent) {
      venuesContent.scrollLeft = scrollElement.scrollLeft;
    }
  }

  onWheel(event: WheelEvent) {
    if (event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
      event.preventDefault();
      const scrollAmount = event.deltaY || event.deltaX;
      
      if (this.venuesContent) {
        this.venuesContent.nativeElement.scrollLeft += scrollAmount;
      }
      
      if (this.venuesHeader) {
        this.venuesHeader.nativeElement.scrollLeft += scrollAmount;
      }
      
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollLeft += scrollAmount;
      }
    }
  }
}