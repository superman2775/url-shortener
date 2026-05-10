const dashboardEl = document.getElementById("dashboard");
const addBtn = document.getElementById("add-btn");
const copyBtn = document.getElementById("copy-json-btn");
const jsonOutput = document.getElementById("json-output");

let redirects = {};

// Load redirects.json on page load
async function loadRedirects() {
  try {
    const url = "/redirects.json";
    const res = await fetch(url + "?t=" + Date.now()); // cache bust
    redirects = await res.json();
    renderDashboard();
  } catch (err) {
    redirects = {};
    alert("Could not load redirects.json. Make sure it exists.");
  }
}

function renderDashboard() {
  dashboardEl.innerHTML = "";

  Object.keys(redirects).forEach(key => {
    const div = document.createElement("div");
    div.className = "entry";

    const keyInput = document.createElement("input");
    keyInput.type = "text";
    keyInput.value = key;
    keyInput.placeholder = "short key";
    keyInput.dataset.oldKey = key;

    const urlInput = document.createElement("input");
    urlInput.type = "url";
    urlInput.value = redirects[key];
    urlInput.placeholder = "https://...";

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => {
      delete redirects[key];
      renderDashboard();
      updateJsonOutput();
    };

    [keyInput, urlInput].forEach(input => {
      input.addEventListener("input", () => {
        const oldKey = input.dataset.oldKey;
        const newKey = keyInput.value.trim();
        const newUrl = urlInput.value.trim();

        if (!newKey || !newUrl) return;

        if (newKey !== oldKey) {
          delete redirects[oldKey];
          updateKeyInOutputs(oldKey, newKey);
        }
        redirects[newKey] = newUrl;
        input.dataset.oldKey = newKey;
        updateJsonOutput();
      });
    });

    div.append(keyInput, urlInput, removeBtn);
    dashboardEl.appendChild(div);
  });

  updateJsonOutput();
}

function updateJsonOutput() {
  const obj = {};
  for (const k of Object.keys(redirects).sort()) {
    obj[k] = redirects[k];
  }
  const str = JSON.stringify(obj, null, 2);
  jsonOutput.textContent = str;
}

function addEntry() {
  const key = "newkey" + Date.now();
  redirects[key] = "https://example.com";

  renderDashboard();
  const inputs = dashboardEl.querySelectorAll("input");
  const lastKey = inputs[inputs.length - 4];  // rough, but works for demo
  if (lastKey) lastKey.focus();
}

function updateKeyInOutputs(oldKey, newKey) {
  const entries = dashboardEl.querySelectorAll(".entry");
  entries.forEach(e => {
    const keyIn = e.querySelector("input");
    if (keyIn.dataset.oldKey === oldKey) {
      keyIn.dataset.oldKey = newKey;
    }
  });
}

addBtn.addEventListener("click", addEntry);

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(jsonOutput.textContent)
    .then(() => {
      copyBtn.textContent = "Copied JSON!";
      setTimeout(() => copyBtn.textContent = "Copy updated JSON", 1500);
    })
    .catch(() => alert("Could not copy to clipboard."));
});

// Load data on page load
loadRedirects();