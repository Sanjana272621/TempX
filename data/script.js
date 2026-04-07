async function fetchData() {
  try {
    const response = await fetch("/data");
    const data = await response.json();

    document.getElementById("temperature").textContent = data.temperature.toFixed(1);
    document.getElementById("humidity").textContent = data.humidity.toFixed(1);
    document.getElementById("uptime").textContent = data.uptime;

    const now = new Date();
    document.getElementById("lastUpdated").textContent = now.toLocaleTimeString();

    const badge = document.getElementById("statusBadge");
    badge.textContent = data.status;
    badge.className = "badge";

    if (data.status === "NORMAL") {
      badge.classList.add("normal");
    } else {
      badge.classList.add("alert");
    }
  } catch (error) {
    console.error("Error fetching data:", error);

    const badge = document.getElementById("statusBadge");
    badge.textContent = "OFFLINE";
    badge.className = "badge loading";
    document.getElementById("lastUpdated").textContent = "Fetch failed";
  }
}

// First load
fetchData();

// Repeat every 3 seconds
setInterval(fetchData, 3000);