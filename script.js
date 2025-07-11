const API_URL = "http://localhost:3000";

async function addEvent(newEvent) {
  const res = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEvent),
  });
  return await res.json();
}

async function deleteEvent(id) {
  await fetch(`${API_URL}/events/${id}`, { method: "DELETE" });
}

async function fetchEvents() {
  const res = await fetch(`${API_URL}/events`);
  return await res.json();
}

class EventListView {
  constructor() {
    this.newEventForm = document.querySelector(".event-form");
    this.nameInput = document.querySelector("#input-event-name");
    this.startInput = document.querySelector("#input-event-start");
    this.endInput = document.querySelector("#input-event-end");
    this.eventTable = document.querySelector("#event-table-body");
  }

  clearInputs() {
    this.nameInput.value = "";
    this.startInput.value = "";
    this.endInput.value = "";
  }

  render(events) {
    this.eventTable.innerHTML = "";
    events.forEach((event) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${event.name}</td>
        <td>${event.start}</td>
        <td>${event.end}</td>
        <td class="actions">
          <button class="btn-delete" data-id="${event.id}">🗑</button>
        </td>
      `;
      this.eventTable.appendChild(row);
    });
  }
}

class EventListModel {}

class EventListController {
  constructor(view, model) {
    this.view = view;
    this.model = model;
    this.init();
  }

  async init() {
    this.setUpEvents();
    const events = await fetchEvents();
    this.view.render(events);
  }

  setUpEvents() {
    this.setUpSubmitEvent();
    this.setUpDeleteEvent();
    this.setUpToggleForm();
  }

  setUpSubmitEvent() {
    this.view.newEventForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const newEvent = {
        name: this.view.nameInput.value,
        start: this.view.startInput.value,
        end: this.view.endInput.value,
      };

      if (!newEvent.name || !newEvent.start || !newEvent.end) {
        alert("Please fill all fields");
        return;
      }

      await addEvent(newEvent);
      const events = await fetchEvents();
      this.view.render(events);
      this.view.clearInputs();
      this.view.newEventForm.style.display = "none";
    });
  }

  setUpDeleteEvent() {
    this.view.eventTable.addEventListener("click", async (e) => {
      if (e.target.classList.contains("btn-delete")) {
        const id = e.target.dataset.id;
        await deleteEvent(id);
        const events = await fetchEvents();
        this.view.render(events);
      }
    });
  }

  setUpToggleForm() {
    const toggleBtn = document.getElementById("show-form-btn");
    toggleBtn.addEventListener("click", () => {
      const form = this.view.newEventForm;
      form.style.display = form.style.display === "none" ? "flex" : "none";
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const view = new EventListView();
  const model = new EventListModel();
  new EventListController(view, model);
});
