package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

// Define Event struct - to represent event data
type Event struct {
	ID          int       `json:"id"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"` // omitempty: omit if description is empty
	StartTime   time.Time `json:"startTime"`
	EndTime     time.Time `json:"endTime"`
}

// In-memory event data (for demonstration - NOT for production persistence)
var events = []Event{
	{
		ID:          1,
		Title:       "Meeting with Client",
		Description: "Discuss project proposal",
		StartTime:   time.Now().Add(time.Hour * 2), // Start in 2 hours
		EndTime:     time.Now().Add(time.Hour * 3), // End in 3 hours
	},
	{
		ID:          2,
		Title:       "Team Lunch",
		StartTime:   time.Now().Add(time.Hour * 24), // Start in 24 hours (tomorrow same time)
		EndTime:     time.Now().Add(time.Hour * 25), // End in 25 hours
	},
}

// Event handler to return the list of events as JSON
func eventsHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json") // Set header for JSON response
	json.NewEncoder(w).Encode(events)                 // Encode 'events' slice to JSON and send
}

// Home handler (still included, but less central now)
func homeHandler(w http.ResponseWriter, r *http.Request) {
	message := map[string]string{"message": "Welcome to the Functional Go API! Access /api/events for events."} // More informative message
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(message)
}

func main() {
	http.HandleFunc("/", homeHandler)       // Handle root path "/"
	http.HandleFunc("/api/events", eventsHandler) // Handle "/api/events" path for event data

	fmt.Println("Go HTTP Server is listening on port 8081")
	log.Fatal(http.ListenAndServe(":8081", nil))
}
