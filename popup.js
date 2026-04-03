document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("tabList");

  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      const row = document.createElement("div");
      row.className = "tab-row";

      const title = document.createElement("span");
      title.textContent = tab.title?.slice(0, 30) || "Untitled";
      if (tab.discarded) title.classList.add("discarded");

      const btn = document.createElement("button");
      btn.className = "discard-btn";
      btn.textContent = tab.discarded ? "Paused" : "Pause";
      btn.disabled = tab.discarded || tab.active;

      btn.addEventListener("click", () => {
        chrome.runtime.sendMessage(
          { action: "discardTab", tabId: tab.id },
          (res) => {
            btn.textContent = "Paused";
            btn.disabled = true;
            title.classList.add("discarded");
          }
        );
      });

      row.appendChild(title);
      row.appendChild(btn);
      list.appendChild(row);
    });
  });

  document.getElementById("discardAllBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "discardAllInactive" }, (res) => {
      alert(`Paused ${res.count} tabs`);
      window.location.reload();
    });
  });
});