document.addEventListener('DOMContentLoaded', async function () {
  const calendarEl = document.getElementById('calendar');
  const slotList = document.getElementById('slot-list');
  const selectedDateEl = document.getElementById('selected-date');
  const timeSlotBox = document.getElementById('timeslots');

  let bookableDays = {}; // Will be filled by backend
  let calendar; // 🔑 This is now global to access in markDateWithTick()

  // 🔁 Fetch availability data from backend
  async function loadAvailability() {
    try {
      const res = await fetch('https://private2-uzol.onrender.com/get-availability', {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer von-UDBNdsjf-4nfd!f9'
        }
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Fetch error: ${res.status} - ${errorText}`);
      }

      const data = await res.json();
      console.log('Availability data received:', data);

      // Group slots by date
      const grouped = {};
      data.forEach(item => {
        if (item.start && typeof item.start === 'string') {
          const date = item.start.split("T")[0];
          const time = new Date(item.start).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          });
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(time);
        } else {
          console.warn('Invalid item.start:', item.start);
        }
      });

      bookableDays = grouped;
      loadCalendar(); // load calendar *after* data
    } catch (err) {
      console.error('Error loading availability:', err);
    }
  }

  function loadCalendar() {
    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      selectable: true,
      showNonCurrentDates: false,
      dateClick: function (info) {
        const dateStr = info.dateStr;

        if (bookableDays[dateStr]) {
          selectedDateEl.textContent = `Selected Date: ${dateStr}`;
          timeSlotBox.style.display = 'block';
          slotList.innerHTML = '';

          bookableDays[dateStr].forEach(slot => {
            const li = document.createElement('li');
            li.textContent = slot;
            li.classList.add('timeslot');
            li.addEventListener('click', () => {
              localStorage.setItem('selectedDate', dateStr);
              localStorage.setItem('selectedTime', slot);
              console.log(dateStr);
              console.log(slot);
              markDateWithTick(dateStr);
            });
            slotList.appendChild(li);
          });
        } else {
          timeSlotBox.style.display = 'none';
        }
      },
      events: Object.keys(bookableDays).map(date => ({
        title: '',
        start: date,
        display: 'background',
        backgroundColor: '#FFA4EE'
      }))
    });

    

    // Restore tick mark and selected date if saved
    const savedDate = localStorage.getItem('selectedDate');
    if (savedDate) {
      calendar.on('datesSet', function () {
        markDateWithTick(savedDate);
        selectedDateEl.textContent = `Selected Date: ${savedDate}`;
      });
    }
    calendar.render();
  }

  function markDateWithTick(dateStr) {
    setTimeout(() => {
      // Remove any existing ticks
      document.querySelectorAll('.fc-daygrid-day .tick-mark').forEach(t => t.remove());
      console.log(`chosen: ${dateStr}`)
      // Find the correct calendar cell
      const dayCell = document.querySelector(`.fc-daygrid-day[data-date="${dateStr}"]`);
      if (dayCell) {
        const tick = document.createElement('div');
        tick.classList.add('tick-mark');
        tick.textContent = '✓';
        tick.style.position = 'absolute';
        tick.style.top = '40px';
        tick.style.right = '50px';
        tick.style.fontSize = '1.8rem';
        tick.style.color = 'black';
        dayCell.style.position = 'relative';
        dayCell.appendChild(tick);
        console.log(dayCell);
      }
    }, 50);

    timeSlotBox.style.display = 'none';
  }

  // 🚀 Kick off the availability fetch
  await loadAvailability();
});
