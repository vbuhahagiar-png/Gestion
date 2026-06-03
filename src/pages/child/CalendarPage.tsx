import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useFamilyStore } from '../../store/useFamilyStore';
import { ChildNav } from '../../components/Layout/ChildNav';

export const ChildCalendarPage: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();
  const { events } = useFamilyStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (monthStart.getDay() + 6) % 7;
  const padDays = Array(startPad).fill(null);

  const myEvents = events.filter(e =>
    !e.assignedTo || e.assignedTo.length === 0 || e.assignedTo.includes(childId || '')
  );

  const getEventsForDay = (day: Date) =>
    myEvents.filter(e => isSameDay(parseISO(e.date), day));

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 pt-10 pb-6 px-4 text-white">
        <div className="text-xl font-black">Calendrier 📅</div>
        <div className="text-blue-100 text-sm mt-1">Les événements de la famille</div>
      </div>

      <div className="px-4 pt-4 space-y-4">
        {/* Month nav */}
        <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-2 shadow-sm">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="font-bold text-gray-900 capitalize">
            {format(currentDate, 'MMMM yyyy', { locale: fr })}
          </h2>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1">
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
          <div className="grid grid-cols-7 mb-2">
            {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
              <div key={i} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {padDays.map((_, i) => <div key={`pad-${i}`} />)}
            {days.map(day => {
              const dayEvts = getEventsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  className={`flex flex-col items-center py-1.5 rounded-xl transition-all ${
                    isSelected ? 'bg-blue-500 text-white' :
                    isToday ? 'bg-blue-100 text-blue-700' :
                    'hover:bg-gray-50'
                  }`}
                >
                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {dayEvts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {dayEvts.slice(0, 2).map((e, i) => (
                        <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : e.color || 'bg-blue-400'}`} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day */}
        {selectedDay && (
          <div>
            <h3 className="font-bold text-gray-900 mb-2 capitalize">
              {format(selectedDay, 'EEEE d MMMM', { locale: fr })}
            </h3>
            {dayEvents.length === 0 ? (
              <div className="text-center py-4 text-gray-400 text-sm">
                Rien ce jour-là 😴
              </div>
            ) : (
              <div className="space-y-2">
                {dayEvents.map(evt => (
                  <div key={evt.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm">
                    <div className={`w-10 h-10 ${evt.color} rounded-xl flex items-center justify-center text-xl text-white`}>
                      {evt.emoji}
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{evt.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Upcoming */}
        <div>
          <h3 className="font-bold text-gray-900 mb-2">Prochains événements 🗓️</h3>
          {myEvents
            .filter(e => parseISO(e.date) >= new Date())
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5)
            .map(evt => (
              <div key={evt.id} className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm mb-2">
                <div className={`w-10 h-10 ${evt.color} rounded-xl flex items-center justify-center text-xl text-white`}>
                  {evt.emoji}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{evt.title}</div>
                  <div className="text-xs text-gray-400 capitalize">
                    {format(parseISO(evt.date), 'EEEE d MMM', { locale: fr })}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      <ChildNav />
    </div>
  );
};
