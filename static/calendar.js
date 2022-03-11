
let cal = new Calendar({
    id: "#calendar",
    theme: "glass",
    primaryColor: "#19dbac",
    // border: "5px solid black",
    weekdayType: "long-upper",
    startWeekday: 1,
    monthDisplayType: "long",
    headerColor: "rgba(0, 0, 0, 0.6)",
    headerBackgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: "1rem",
    calendarSize: "small",
    customMonthValues: [
        "Styczeń",
        "Luty",
        "Marzec",
        "Kwiecień",
        "Maj",
        "Czerwiec",
        "Lipiec",
        "Sierpień",
        "Wrzesień",
        "Październik",
        "Listopad",
        "Grudzień"
    ],
    customWeekdayValues: ["N", "Pn", "Wt", "Śr", "Cz", "Pt", "So"],
    // layoutModifiers: ["month-left-align"],
    dateChanged: (currentDate, events) => {
        console.log("date change", currentDate, events);
    },
    monthChanged: (currentDate, events) => {
        console.log("month change", currentDate, events);
    }
});