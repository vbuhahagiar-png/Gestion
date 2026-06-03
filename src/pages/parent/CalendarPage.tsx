import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, parseISO, isSameMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useFamilyStore } from '../../store/useFamilyStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Modal } from '../../components/UI/Modal';
import { Button } from '../../components/UI/Button';
import type { CalendarEvent } from '../../types';

const EVENT_COLORS = ['bg-purple-500', 'bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-amber-500', 'bg-red-500'];
const EMOJI_OPTIONS = ['📅', '⚽', '🏫', '🎂', '🦷', '🎉', '🏊', '💃', '🧺', '🎭', '🏋️', '📚'];

const addToGoogleCalendar = (event: CalendarEvent) => {
  const start = event.date.replace(/-/g, '').slice(0, 8) + 'T090000';
  const end = event.date.replace(/-/g, '').slice(0, 8) + 'T100000';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent('Événement TiPoche - ' + event.title)}`;
  window.open(url, '_blank');
};

const addToOutlook = (event: CalendarEvent) => {
  const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${encodeURIComponent(event.title)}&startdt=${event.date}T09:00:00&enddt=${event.date}T10:00:00&body=${encodeURIComponent('Événement TiPoche')}`;
  window.open(url, '_blank');
};

export const CalendarPage: React.FC = () => {
  const { events, addEvent, deleteEvent } = useFamilyStore();
  const { currentFamily } = useAuthStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', emoji: '📅', color: 'bg-purple-500' });

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Padding for first day of week
  const startPad = (monthStart.getDay() + 6) % 7; // Mon=0
  const padDays = Array(startPad).fill(null);

  const getEventsForDay = (day: Date) =>
    events.filter(e => isSameDay(parseISO(e.date), day));

  const dayEvents = selectedDay ? getEventsForDay(selectedDay) : [];

  const handleAddEvent = () => {
    if (!newEvent.title.trim() || !selectedDay) return;
    addEvent({
      id: `ev-${Date.now()}`,
      familyId: currentFamily?.id || '',
      title: newEvent.title,
      date: format(selectedDay, 'yyyy-MM-dd'),
      emoji: newEvent.emoji,
      color: newEvent.color,
      assignedTo: [],
    });
    setNewEvent({ title: '', emoji: '📅', color: 'bg-purple-500' });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-black text-gray-900">Calendrier</h1>

      {/* Calendar sync buttons */}
      <div className="flex gap-2">
        <button onClick={() => window.open('https://calendar.google.com', '_blank')}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-gray-50 transition">
          <span>📅</span> Google Calendar
        </button>
        <button onClick={() => window.open('https://outlook.live.com/calendar', '_blank')}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-gray-50 transition">
          <span>📆</span> Outlook
        </button>
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 rounded-xl hover:bg-gray-100">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="font-bold text-gray-900 capitalize">
          {format(currentDate, 'MMMM yyyy', { locale: fr })}
        </h2>
        <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 rounded-xl hover:bg-gray-100">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-white rounded-3xl p-4 shadow-[0_4px_24px_rgba(0,0,0,0.07)]">
        {/* Day headers */}
        <div className="grid grid-cols-7 mb-2">
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
            <div key={i} className="text-center text-xs font-bold text-gray-400 py-1">{d}</div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-1">
          {padDays.map((_, i) => <div key={`pad-${i}`} />)}
          {days.map(day => {
            const dayEvts = getEventsForDay(day);
            const isToday = isSameDay(day, new Date());
            const isSelected = selectedDay && isSameDay(day, selectedDay);
            const isCurrentMonth = isSameMonth(day, currentDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(day)}
                className={`relative flex flex-col items-center py-1.5 rounded-xl transition-all ${
                  isSelected ? 'bg-purple-600 text-white' :
                  isToday ? 'bg-purple-100 text-purple-700' :
                  'hover:bg-gray-50'
                } ${!isCurrentMonth ? 'opacity-30' : ''}`}
              >
                <span className={`text-sm font-semibold ${isSelected ? 'text-white' : isToday ? 'text-purple-700' : 'text-gray-800'}`}>
                  {format(day, 'd')}
                </span>
                {dayEvts.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvts.slice(0, 3).map((e, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : e.color || 'bg-purple-400'}`} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day events */}
      {selectedDay && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-900 capitalize">
              {format(selectedDay, 'EEEE d MMMM', { locale: fr })}
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1 text-purple-600 text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Ajouter
            </button>
          </div>

          {dayEvents.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-sm">
              Aucun événement ce jour
            </div>
          ) : (
            <div className="space-y-2">
              {dayEvents.map(evt => (
                <div key={evt.id} className="bg-white rounded-2xl p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${evt.color} rounded-xl flex items-center justify-center text-xl text-white`}>
                      {evt.emoji}
                    </div>
                    <span className="flex-1 font-semibold text-gray-900 text-sm">{evt.title}</span>
                    <button onClick={() => deleteEvent(evt.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-2 ml-13">
                    <button
                      onClick={() => addToGoogleCalendar(evt)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                    >
                      📅 Google
                    </button>
                    <button
                      onClick={() => addToOutlook(evt)}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                    >
                      📆 Outlook
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upcoming events */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3">Prochains événements</h3>
        <div className="space-y-2">
          {events
            .filter(e => parseISO(e.date) >= new Date())
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 5)
            .map(evt => (
              <div key={evt.id} className="bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${evt.color} rounded-xl flex items-center justify-center text-xl text-white`}>
                    {evt.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 text-sm">{evt.title}</div>
                    <div className="text-xs text-gray-400 capitalize">
                      {format(parseISO(evt.date), 'EEEE d MMMM', { locale: fr })}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => addToGoogleCalendar(evt)}
                      className="text-xs text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                      title="Ajouter à Google Calendar"
                    >
                      📅
                    </button>
                    <button
                      onClick={() => addToOutlook(evt)}
                      className="text-xs text-gray-400 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                      title="Ajouter à Outlook"
                    >
                      📆
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add event modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Nouvel événement">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Emoji</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_OPTIONS.map(e => (
                <button
                  key={e}
                  onClick={() => setNewEvent(v => ({ ...v, emoji: e }))}
                  className={`w-10 h-10 rounded-xl text-xl transition-all ${newEvent.emoji === e ? 'bg-purple-100 ring-2 ring-purple-500' : 'bg-gray-100'}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-1">Titre</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={e => setNewEvent(v => ({ ...v, title: e.target.value }))}
              placeholder="Entraînement foot..."
              className="w-full px-4 py-2.5 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-sm"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-2">Couleur</label>
            <div className="flex gap-2">
              {EVENT_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setNewEvent(v => ({ ...v, color: c }))}
                  className={`w-8 h-8 ${c} rounded-xl transition-all ${newEvent.color === c ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : ''}`}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setShowAddModal(false)}>Annuler</Button>
            <Button variant="primary" fullWidth onClick={handleAddEvent}>Créer</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
