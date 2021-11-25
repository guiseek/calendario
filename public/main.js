(() => {
  // src/elements/calendar.ts
  var CalendarElement = class extends HTMLElement {
    constructor() {
      super(...arguments);
      this.today = new Date();
      this.currentMonth = this.today.getMonth();
      this.currentYear = this.today.getFullYear();
      this.months = [];
      this.days = [];
      this.monthDefault = [
        "Janeiro",
        "Fevereiro",
        "Mar\xE7o",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
      ];
      this.dayDefault = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
    }
    connectedCallback() {
      const shadow = this.attachShadow({mode: "open"});
      const template = document.createElement("template");
      template.innerHTML = `<link rel="stylesheet" href="styles/button.css" />
    <link rel="stylesheet" href="styles/calendar.css" />
    
    
    <div class="button-container-calendar">
      <button id="previous">&#8249;</button>
      <h3 id="month-and-year"></h3>
      <button id="next">&#8250;</button>
    </div>
  
    <table class="table-calendar" id="calendar" data-lang="pt-br">
      <thead id="thead-month"></thead>
      <tbody id="calendar-body"></tbody>
    </table>
  
    <div class="footer-container-calendar">
      <label for="month">Ir para: </label>
      <select id="month"></select>
      <select id="year"></select>
    </div>`;
      shadow.appendChild(template.content.cloneNode(true));
      this.monthAndYear = this.shadowRoot.querySelector("#month-and-year");
      this.buttonPrevious = this.shadowRoot.querySelector("#previous");
      this.buttonNext = this.shadowRoot.querySelector("#next");
      this.selectYear = this.shadowRoot.querySelector("#year");
      this.selectMonth = this.shadowRoot.querySelector("#month");
      this.calendar = this.shadowRoot.querySelector("#calendar");
      this.lang = this.calendar.dataset.lang;
      this.monthDefault.forEach((m, i) => {
        this.selectMonth.add(new Option(m, `${i}`));
      });
      this.generateYearRange(1970, 2030);
      this.buttonPrevious.onclick = this.previous();
      this.buttonNext.onclick = this.next();
      this.selectMonth.onchange = this.jump();
      this.selectYear.onchange = this.jump();
      if (this.lang === "pt-br") {
        this.months = this.monthDefault;
        this.days = this.dayDefault;
      }
      const thead = this.calendar.createTHead();
      const theadRow = thead.insertRow();
      this.days.forEach((value, index) => {
        const th = theadRow.insertCell();
        th.dataset.days = index.toString();
        th.textContent = value;
      });
      this.showCalendar(this.currentMonth, this.currentYear);
      this.dayFnMapper = (day) => {
        const detail = day.dataset;
        const event = new CustomEvent("selected", {detail});
        this.dispatchEvent(event);
      };
    }
    previous() {
      return () => {
        this.currentYear = this.currentMonth === 0 ? this.currentYear - 1 : this.currentYear;
        this.currentMonth = this.currentMonth === 0 ? 11 : this.currentMonth - 1;
        this.showCalendar(this.currentMonth, this.currentYear);
      };
    }
    next() {
      return () => {
        this.currentYear = this.currentMonth === 11 ? this.currentYear + 1 : this.currentYear;
        this.currentMonth = (this.currentMonth + 1) % 12;
        this.showCalendar(this.currentMonth, this.currentYear);
      };
    }
    jump() {
      return () => {
        this.currentYear = +this.selectYear.value;
        this.currentMonth = +this.selectMonth.value;
        this.showCalendar(this.currentMonth, this.currentYear);
      };
    }
    attachListeners() {
      const tbody = this.calendar.querySelector("tbody");
      this.selectableDays = tbody.querySelectorAll("td.date-picker");
      this.selectableDays.forEach((day) => {
        day.addEventListener("click", () => this.dayFnMapper(day));
      });
    }
    detachListeners() {
      if (this.selectableDays) {
        this.selectableDays.forEach((day) => {
          day.removeEventListener("click", () => this.dayFnMapper(day));
        });
      }
    }
    showCalendar(month, year) {
      const firstDay = new Date(year, month).getDay();
      this.detachListeners();
      const tbody = this.calendar.querySelector("tbody");
      tbody.innerHTML = "";
      this.monthAndYear.textContent = `${this.months[month]} ${year}`;
      this.selectYear.value = `${year}`;
      this.selectMonth.value = `${month}`;
      let date = 1;
      for (let calendarRow = 0; calendarRow < 6; calendarRow++) {
        const row = tbody.insertRow();
        for (let calendarCol = 0; calendarCol < 7; calendarCol++) {
          if (calendarRow === 0 && calendarCol < firstDay) {
            row.insertCell();
          } else if (date > this.daysInMonth(month, year)) {
            break;
          } else {
            const cell = row.insertCell();
            cell.dataset.date = `${date}`;
            cell.dataset.month = `${month + 1}`;
            cell.dataset.year = `${year}`;
            cell.dataset.monthName = `${this.months[month]}`;
            cell.textContent = `${date}`;
            cell.classList.add("date-picker");
            if (date === this.today.getDate() && year === this.today.getFullYear() && month === this.today.getMonth()) {
              cell.classList.add("date-picker", "selected");
            }
            date++;
          }
        }
      }
      this.attachListeners();
    }
    daysInMonth(iMonth, iYear) {
      return 32 - new Date(iYear, iMonth, 32).getDate();
    }
    generateYearRange(start, end) {
      for (let year = start; year <= end; year++) {
        this.selectYear.add(new Option(`${year}`, `${year}`));
      }
    }
  };
  customElements.define("boot-calendar", CalendarElement);

  // src/utilities/handle-form-button.ts
  function handleFormButton(form) {
    const button = form.querySelector("button");
    if (button)
      button.disabled = true;
    form.onchange = () => {
      const valid = !form.checkValidity();
      if (button)
        button.disabled = valid;
    };
  }

  // src/utilities/format-from-calendar.ts
  function formatFromCalendar(value) {
    const {year, month, date} = value;
    const d = date.length === 1 ? `0${date}` : date;
    const m = month.length === 1 ? `0${month}` : month;
    return `${year}-${m}-${d}`;
  }

  // src/utilities/format-from-form.ts
  function formatFromForm(value) {
    const [year, month, day] = value.split("-");
    return `${year}-${month}-${day}`;
  }

  // src/utilities/format-task.ts
  function formatTask(data) {
    const value = Object.fromEntries(data.entries());
    return value;
  }

  // src/utilities/get-tasks.ts
  function getTasks(date) {
    const key = formatFromForm(date);
    const tasks = localStorage.getItem(key);
    return tasks ? JSON.parse(tasks) : [];
  }

  // src/utilities/set-tasks.ts
  function setTasks(data) {
    const key = formatFromForm(data.get("date").toString());
    const tasks = getTasks(key);
    tasks.push(formatTask(data));
    localStorage.setItem(key, JSON.stringify(tasks));
  }

  // src/main.ts
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    if (form) {
      handleFormButton(form);
      form.onsubmit = (ev) => {
        ev.preventDefault();
        setTasks(new FormData(form));
      };
    }
    const calendar = document.querySelector("boot-calendar");
    calendar.addEventListener("selected", ({detail}) => {
      const inputDate = form.querySelector("#date");
      const tasks = getTasks(formatFromCalendar(detail));
      console.log(tasks);
      inputDate.value = formatFromCalendar(detail);
    });
  });
  customElements.whenDefined("boot-calendar").then(() => {
  });
})();
//# sourceMappingURL=main.js.map
