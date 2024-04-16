import { Component, ChangeDetectorRef, OnInit } from '@angular/core'
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core'
import interactionPlugin from '@fullcalendar/interaction'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import listPlugin from '@fullcalendar/list'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { User } from './Interface/user'
import { users } from './dataBase/user'
import { Tache } from './Interface/tache'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  users: any[] = [];
  taches: any[] = [];
  user: User = {} as User;
  tache: Tache = {} as Tache;
  showModal: boolean = false;
   dateSelectArg : DateSelectArg | null = null;
  calendarVisible = true;
  showModalCalandar = false;
  strnig: string = 'totot';
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    eventLeave: this.handleEventDrop.bind(this),
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    
  }
  currentEvents: EventApi[] = []

  constructor(private changeDetector: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.users = users;
    console.log(this.users);    
  }

  handleEventMouseEnter(info: any) {
    console.log(info);
  }
  

  handleCalendarToggle() {
    this.calendarVisible = !this.calendarVisible
  }

  handleWeekendsToggle() {
    const { calendarOptions } = this
    calendarOptions.weekends = !calendarOptions.weekends
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.tache = {} as Tache;
    this.showModalCalandar = true;
    this.dateSelectArg = selectInfo;
//     const title = this.tache.title;  
// console.log(title)

//     const calendarApi = selectInfo.view.calendar
//     calendarApi.unselect() 
//     if (title) {
// console.log(title)
//       calendarApi.addEvent({
//         id: createEventId(),
//         title,
//         start: selectInfo.startStr,
//         end: selectInfo.endStr,
//         allDay: selectInfo.allDay,
//       })
//     }
  }

  handleEventClick(clickInfo: EventClickArg) {
    console.log('Événement cliqué :', clickInfo.event.title)
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove()
    }
  }

  handleEvents(events: EventApi[]) {
    console.log('handleEvents');
    this.currentEvents = events;
    this.changeDetector.detectChanges()
  }

  // Fonction appelée lorsqu'un événement est déplacé
  handleEventDrop(arg: any) {
    console.log('Événement déplacé :', arg.event)
  }

  // saveTache() {
    
  //   this.handleDateSelect(selectInfo: DateSelectArg);
  //   console.log(this.taches);
  //   this.showModalCalandar = false;
  // }
  OpenModal() {
    this.showModal = true;
    this.user = {} as User;
  }

  closeModal() {
    this.showModal = false;
  }

  addUser() {
    this.users.push(this.user);
    console.log(this.users);    
    this.showModal = false;
  }

  removeUser(id: number) {
    this.users = this.users.filter(user => user.id !== id);
  }

  closeModalCalandar() {
    this.showModalCalandar = false;
  }

  saveTache() {
    if(!this.dateSelectArg ) return 
    this.taches.push(this.tache);
    const calendarApi = this.dateSelectArg.view.calendar
    calendarApi.unselect() // clear date selection
      calendarApi.addEvent({
        id: createEventId(),
        title: this.tache.title,
        start: this.dateSelectArg.startStr,
        end: this.dateSelectArg.endStr,
        allDay: this.dateSelectArg.allDay,
      })
        this.showModalCalandar = false;
        this.dateSelectArg = null;
  }

  

}
