import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./App.css";

function App() {
  const [chambres, setChambres] = useState([]);
  const [clients, setClients] = useState([]);
  const [newChambre, setNewChambre] = useState({ numero: "", type: "", price: "" });
  const [newClient, setNewClient] = useState({ name: "" });
  const [newReservation, setNewReservation] = useState({ chambre_id: "", client_id: "", date: "" });
  const [updatedChambre, setUpdatedChambre] = useState({ id: "", numero: "", type: "", price: "" });

  useEffect(() => {
    Axios.get("http://localhost:3001/api/chambre")
      .then((response) => setChambres(response.data))
      .catch((error) => console.error("Error fetching rooms:", error));
  }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/clients")
      .then((response) => setClients(response.data))
      .catch((error) => console.error("Error fetching clients:", error));
  }, []);

  const addClient = () => {
    if (!newClient.name) {
      alert("Client name is required!");
      return;
    }
    Axios.post("http://localhost:3001/api/client", newClient)
      .then(() => {
        alert("Client added successfully!");
        setNewClient({ name: "" });
        Axios.get("http://localhost:3001/api/clients").then((response) => setClients(response.data));
      })
      .catch((error) => console.error("Error adding client:", error));
  };

  const addRoom = () => {
    if (!newChambre.numero || !newChambre.type || !newChambre.price) {
      alert("All fields are required!");
      return;
    }
    Axios.post("http://localhost:3001/api/chambre", newChambre)
      .then(() => {
        alert("Room added successfully!");
        setNewChambre({ numero: "", type: "", price: "" });
        Axios.get("http://localhost:3001/api/chambre").then((response) => setChambres(response.data));
      })
      .catch((error) => console.error("Error adding room:", error));
  };

  const updateRoom = () => {
    if (!updatedChambre.numero || !updatedChambre.type || !updatedChambre.price) {
      alert("All fields are required!");
      return;
    }

    Axios.put(`http://localhost:3001/api/chambre/${updatedChambre.id}`, updatedChambre)
      .then(() => {
        alert("Room updated successfully!");
        Axios.get("http://localhost:3001/api/chambre").then((response) => setChambres(response.data));
        setUpdatedChambre({ id: "", numero: "", type: "", price: "" }); // Clear inputs after update
      })
      .catch((error) => console.error("Error updating room:", error));
  };

const deleteRoom = (id) => {
  if (window.confirm("Are you sure you want to delete this room?")) {
    Axios.delete(`http://localhost:3001/api/chambre/${id}`)
      .then(() => {
        alert("Room deleted successfully!");
        Axios.get("http://localhost:3001/api/chambre")
          .then((response) => setChambres(response.data));
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.error);  // Show the error message returned from the backend
        } else {
          console.error("Error deleting room:", error);
          alert("Error deleting room!");
        }
      });
  }
};


  const addReservation = () => {
    if (!newReservation.chambre_id || !newReservation.client_id || !newReservation.date) {
      alert("All fields are required!");
      return;
    }

    Axios.get(`http://localhost:3001/api/chambre/${newReservation.chambre_id}/available/${newReservation.date}`)
      .then((response) => {
        if (response.data.available) {
          Axios.post("http://localhost:3001/api/reservation", newReservation)
            .then(() => {
              alert("Reservation added successfully!");
              setNewReservation({ chambre_id: "", client_id: "", date: "" });
              Axios.get("http://localhost:3001/api/chambre").then((response) => setChambres(response.data));
            })
            .catch((error) => console.error("Error adding reservation:", error));
        } else {
          alert("Room is already reserved on this date!");
        }
      })
      .catch((error) => console.error("Error checking availability:", error));
  };

  return (
    <div className="App">
      <h1>Room Management</h1>

      <div>
        <h2>Add Room</h2>
        <input
          type="text"
          placeholder="Room Number"
          value={newChambre.numero}
          onChange={(e) => setNewChambre({ ...newChambre, numero: e.target.value })}
        />
        <input
          type="text"
          placeholder="Room Type"
          value={newChambre.type}
          onChange={(e) => setNewChambre({ ...newChambre, type: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          value={newChambre.price}
          onChange={(e) => setNewChambre({ ...newChambre, price: e.target.value })}
        />
        <button onClick={addRoom}>Add Room</button>
      </div>

      <div>
        <h2>Add Client</h2>
        <input
          type="text"
          placeholder="Client Name"
          value={newClient.name}
          onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
        />
        <button onClick={addClient}>Add Client</button>
      </div>

      <div>
        <h2>Add Reservation</h2>
        <select
          onChange={(e) => setNewReservation({ ...newReservation, chambre_id: e.target.value })}
        >
          <option value="">Select Room</option>
          {chambres.map((room) => (
            <option key={room.id} value={room.id}>
              {room.numero}
            </option>
          ))}
        </select>
        <select
          onChange={(e) => setNewReservation({ ...newReservation, client_id: e.target.value })}
        >
          <option value="">Select Client</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
        />
        <button onClick={addReservation}>Add Reservation</button>
      </div>

      <div>
        <h2>Update Room</h2>
        <input
          type="text"
          placeholder="Room Number"
          value={updatedChambre.numero}
          onChange={(e) => setUpdatedChambre({ ...updatedChambre, numero: e.target.value })}
        />
        <input
          type="text"
          placeholder="Room Type"
          value={updatedChambre.type}
          onChange={(e) => setUpdatedChambre({ ...updatedChambre, type: e.target.value })}
        />
        <input
          type="text"
          placeholder="Price"
          value={updatedChambre.price}
          onChange={(e) => setUpdatedChambre({ ...updatedChambre, price: e.target.value })}
        />
        <button onClick={updateRoom}>Update Room</button>
      </div>

      <div>
        <h2>Rooms</h2>
        <ul>
          {chambres.map((room) => (
            <li key={room.id}>
              <p>Room Number: {room.numero}</p>
              <p>Type: {room.type}</p>
              <p>Price: {room.price}</p>
              <button onClick={() => setUpdatedChambre({ id: room.id, numero: room.numero, type: room.type, price: room.price })}>
                Update
              </button>
              <button onClick={() => deleteRoom(room.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
