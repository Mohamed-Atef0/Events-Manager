const addBtn = document.querySelector(".add");

function getDate() {
  const today = new Date();
  const year = today.getFullYear();
  // JavaScript months start from 0, so we add 1.
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function setMinDate() {
  const today = getDate();
  const eventDate = document.querySelector(".event-date");
  eventDate.min = today;
  eventDate.addEventListener("input", () => {
    if (eventDate.value < today) {
      eventDate.value = today;
    }
  });
}
setMinDate();

// Creates a new event and saves it in localStorage.
function addEvent() {
  const eventName = document.querySelector(".event-name").value.trim();
  const eventDate = document.querySelector(".event-date").value.trim();
  const eventOrganizer = document.querySelector(".organizer").value.trim();
  const timeStamp = new Date(eventDate).getTime();

  if (eventName && eventDate && eventOrganizer) {
    const event = {
      name: eventName,
      date: eventDate,
      organizer: eventOrganizer,
      timestamp: timeStamp,
    };

    const events = JSON.parse(localStorage.getItem("events")) || [];
    events.push(event);
    localStorage.setItem("events", JSON.stringify(events));

    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
    displayEvent();
  } else {
    alert("Please fill all fields ❌");
  }
}

addBtn.addEventListener("click", addEvent);

function getCountDown(timestamp) {
  const now = Date.now();
  const timeLeft = timestamp - now;
  if (timeLeft <= 0) {
    return "Event Started✅";
  } else {
    /*
    1 second  = 1000 ms
    1 minute  = 1000 * 60 ms
    1 hour    = 1000 * 60 * 60 ms
    1 day     = 1000 * 60 * 60 * 24 ms
  */
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}

function displayEvent() {
  const events = JSON.parse(localStorage.getItem("events")) || [];
  const eventsList = document.querySelector(".events");
  eventsList.innerHTML = "";
  events.forEach((event, index) => {
    const countDown = getCountDown(event.timestamp);
    eventsList.innerHTML += `
    <div class="event">
      <h2>${event.name}</h2>
      <p><span>By</span>${event.organizer}</p>
      <p><span>On</span>${event.date}</p>
      <p>
      <span>Time Left</span>
      <span class="countdown">${countDown}</span>
      </p>
      <button onclick="deleteEvent(${index})">Delete</button>
    </div>`;
  });
}
displayEvent();

function deleteEvent(index) {
  const events = JSON.parse(localStorage.getItem("events"));
  events.splice(index, 1);
  localStorage.setItem("events", JSON.stringify(events));
  displayEvent();
}

function updateCountDown() {
  const events = JSON.parse(localStorage.getItem("events"));
  const countDowns = document.querySelectorAll(".countdown");
  countDowns.forEach((countdown, index) => {
    countdown.textContent = getCountDown(events[index].timestamp);
  });
}
setInterval(updateCountDown, 1000);
