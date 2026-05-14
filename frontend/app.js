const API_URL = "http://localhost:3000/api";

let token = localStorage.getItem("token");
const currentPage = window.location.pathname;

// Ha a jegyzetek oldalon vagyunk, de nincs token, visszadob a belépésre
if (currentPage.includes("notes.html") && !token) {
  window.location.href = "index.html";
}

// Ha már be vagyunk jelentkezve és a belépés/regisztráció oldalon vagyunk,
// akkor automatikusan átdob a jegyzetek oldalra
if (
  (currentPage.includes("index.html") ||
    currentPage.includes("register.html") ||
    currentPage.endsWith("/")) &&
  token
) {
  window.location.href = "notes.html";
}

async function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const authMessage = document.getElementById("auth-message");

  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();
    authMessage.textContent = data.message;

    if (response.ok) {
      authMessage.textContent = "Sikeres regisztráció, átirányítás a belépéshez...";

      setTimeout(() => {
        window.location.href = "index.html";
      }, 5000);
    }
  } catch (error) {
    authMessage.textContent = "Nem sikerült kapcsolódni a szerverhez.";
  }
}

async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const authMessage = document.getElementById("auth-message");

  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      authMessage.textContent = data.message;
      return;
    }

    token = data.token;
    localStorage.setItem("token", token);

    window.location.href = "notes.html";
  } catch (error) {
    authMessage.textContent = "Nem sikerült kapcsolódni a szerverhez.";
  }
}

function logout() {
  token = null;
  localStorage.removeItem("token");
  window.location.href = "index.html";
}

async function createNote() {
  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;
  const category = document.getElementById("note-category").value;

  try {
    const response = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content, category }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    document.getElementById("note-title").value = "";
    document.getElementById("note-content").value = "";
    document.getElementById("note-category").value = "";

    getNotes();
  } catch (error) {
    alert("Nem sikerült a jegyzet mentése.");
  }
}

async function getNotes() {
  const notesList = document.getElementById("notes-list");

  if (!notesList) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/notes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const notes = await response.json();

    notesList.innerHTML = "";

    if (notes.length === 0) {
      notesList.innerHTML = "<p>Még nincs mentett jegyzeted.</p>";
      return;
    }

    notes.forEach((note) => {
      const noteElement = document.createElement("div");
      noteElement.className = "note";

      noteElement.innerHTML = `
        <h4>${note.title}</h4>
        <p>${note.content}</p>
        <p class="category">Kategória: ${note.category || "nincs megadva"}</p>
        <div class="note-actions">
          <button class="edit-btn" onclick="editNote(${note.id})">Szerkesztés</button>
          <button class="delete-btn" onclick="deleteNote(${note.id})">Törlés</button>
        </div>
      `;

      notesList.appendChild(noteElement);
    });
  } catch (error) {
    notesList.innerHTML = "<p>Nem sikerült betölteni a jegyzeteket.</p>";
  }
}

async function editNote(id) {
  const newTitle = prompt("Új cím:");
  const newContent = prompt("Új tartalom:");
  const newCategory = prompt("Új kategória:");

  if (!newTitle || !newContent) {
    alert("A cím és a tartalom nem lehet üres.");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: newTitle,
        content: newContent,
        category: newCategory,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    getNotes();
  } catch (error) {
    alert("Nem sikerült a jegyzet szerkesztése.");
  }
}

async function deleteNote(id) {
  const confirmed = confirm("Biztosan törlöd ezt a jegyzetet?");

  if (!confirmed) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/notes/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message);
      return;
    }

    getNotes();
  } catch (error) {
    alert("Nem sikerült a jegyzet törlése.");
  }
}

// Ha a notes.html oldalon vagyunk, automatikusan betölti a jegyzeteket
if (currentPage.includes("notes.html")) {
  getNotes();
}