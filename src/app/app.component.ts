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
  events: any = [
    {
      title: 'All-day event',
      date: '2024-04-01',
      color: 'yellow',
    },
    {
      title: 'All-day event',
      date: '2024-04-01',
      color: 'bleu',
    },
    {
      title: 'All-day event',
      date: '2024-04-02',
      color: 'red',
    },
  ];
  users: any[] = [];
  taches: any[] = [];
  user: User = {} as User;
  tache: Tache = {} as Tache;
  showModal: boolean = false;
  showDesc: boolean = true;
  currentSelected: number | null = null;
  dateSelectArg : DateSelectArg | null = null;
  calendarVisible = true;
  showModalCalandar = false;
  strnig: string = 'totot';
  desc: string = ''; 
  nameUser: string = '';
  calendarOptions: CalendarOptions = {
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'dayGridMonth',
    events: this.events,
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
    eventMouseEnter: this.handleEventMouseEnter.bind(this),
    eventMouseLeave: this.handleEventMouseLeave.bind(this),
    // eventDidMount: function(info) {
    //   var tooltip = new Tooltip(info.el, {
    //     title: info.event.extendedProps.description,
    //     placement: 'top',
    //     trigger: 'hover',
    //     container: 'body'
    //   });
    // },
  }
  currentEvents: EventApi[] = []

  constructor(private changeDetector: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.users = users;
    console.log(this.users);    
  }
  handleEventMouseLeave(info:any): void {
    console.log(info);
    this.showDesc = false;
    this.currentSelected = null;    
  }
  handleEventMouseEnter(info: any) {
    const { el , event } = info  
    const id = event?.id 
    const elem = this.taches.find((t) => +t.id === +id) 
    this.desc = elem?.description;
    this.nameUser = elem?.user;
    if(elem){
      this.showDesc = true;
      this.currentSelected = +id;
    }


  }

  handleWeekendsToggle() {
    const { calendarOptions } = this
    calendarOptions.weekends = !calendarOptions.weekends
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.tache = {} as Tache;
    this.showModalCalandar = true;
    this.dateSelectArg = selectInfo;

  }

  

  handleEventClick(clickInfo: EventClickArg) {
    console.log(clickInfo.event.title);
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
    console.log(this.tache);    
    if(!this.dateSelectArg ) return 

    const id = createEventId()
    this.taches.push({...this.tache, id });
  
    const calendarApi = this.dateSelectArg.view.calendar
    calendarApi.unselect() // clear date selection
      calendarApi.addEvent({
        id, 
        title: this.tache.title,
        color: this.tache.color,
        start: this.dateSelectArg.startStr ,
        end: this.dateSelectArg.endStr,
        description: this.tache.description
      })
        this.showModalCalandar = false;
        this.dateSelectArg = null;
  }

  

}
