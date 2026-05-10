const urlInput   = document.getElementById("url-input");
const shortenBtn = document.getElementById("shorten-btn");
const resultDiv  = document.getElementById("result");
const shortUrl   = document.getElementById("short-url");
const copyBtn    = document.getElementById("copy-btn");
const errorP     = document.getElementById("error");
const infoP      = document.getElementById("info");

shortenBtn.addEventListener("click", async () => {
  const longUrl = urlInput.value.trim();
  if (!longUrl) {
    showError("Please enter a valid URL.");
    return;
  }

  // In a real workflow, you'd somehow pick a short key (e.g., "abc123")
  // and then manually add it to redirects.json on GitHub
  const shortKey = prompt("Short key (e.g. 'news2026'):", "");
  if (!shortKey || !/^[a-zA-Z0-9_-]+$/.test(shortKey)) {
    showError("Please enter a valid short key (letters, numbers, _, -).");
    return;
  }

  // Example domain: your GitHub Pages site
  const base = `https://${window.location.host}`;

  const shortLink = `${base}/${shortKey}`;

  showResult(shortLink);
});

copyBtn.addEventListener("click", () => {
  const text = shortUrl.href;
  navigator.clipboard.writeText(text)
    .then(() => {
      copyBtn.textContent = "Copied!";
      setTimeout(() => copyBtn.textContent = "Copy", 1500);
    })
    .catch(() => showError("Could not copy."));
});

function showResult(short) {
  shortUrl.href = short;
  shortUrl.textContent = short;
  resultDiv.classList.remove("hide");
  errorP.classList.add("hide");
}

function showError(msg) {
  errorP.textContent = msg;
  errorP.classList.remove("hide");
  resultDiv.classList.add("hide");
}