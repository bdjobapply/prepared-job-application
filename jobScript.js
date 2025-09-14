// === Configuration ===
const TELEGRAM_TOKEN = "8280827701:AAF4g062-ToCZITDx4avgNhWX3tqXa1W3fY";   // এখানে আপনার আসল বট টোকেন বসান
const TELEGRAM_CHAT_ID = "7079142411";   // এখানে আপনার আসল চ্যাট আইডি বসান

// === Form & Loading ===
const form = document.getElementById("jobForm");
const loadingDiv = document.getElementById("loading");

// === Helper: Format date to dd-mm-yyyy ===
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (isNaN(d)) return dateString;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

// === Function to send file to Telegram ===
async function sendFile(file) {
  if (file) {
    const formData = new FormData();
    formData.append("chat_id", TELEGRAM_CHAT_ID);
    formData.append("document", file);
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendDocument`, {
        method: "POST",
        body: formData
      });
    } catch (err) {
      console.error("❌ Telegram File Error:", err);
    }
  }
}

// === Form Submit ===
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  loadingDiv.style.display = "flex";

  // Collect data
  const data = {
    circularDate: formatDate(document.getElementById("circularDate").value),
    startDate: formatDate(document.getElementById("startDate").value),
    endDate: formatDate(document.getElementById("endDate").value),
    orgName: document.getElementById("orgName").value,
    postName: document.getElementById("postName").value,
    postCount: document.getElementById("postCount").value,
    grade: document.getElementById("grade").value,
    priority: document.getElementById("priority").value,
    applyLink: document.getElementById("applyLink").value,
    paymentAmount: document.getElementById("paymentAmount").value
  };

  // === CSV line (with double quotes) ===
const csvLine = [
  data.circularDate,
  data.startDate,
  data.endDate,
  data.orgName,
  data.postName,
  data.postCount,
  data.grade,
  data.priority,
  data.applyLink,
  data.paymentAmount
].map(value => `"${value}"`).join(",");

  // === Telegram text message ===
  const textMessage =
    `📝 চাকরির বিজ্ঞপ্তির তথ্যঃ\n\n` +
    `📅 বিজ্ঞপ্তি প্রকাশের তারিখঃ ${data.circularDate}\n` +
    `🚀 আবেদন শুরুর তারিখঃ ${data.startDate}\n` +
    `⏳ আবেদনের শেষ তারিখঃ ${data.endDate}\n` +
    `🏢 প্রতিষ্ঠানের নামঃ ${data.orgName}\n` +
    `📌 পদের নামঃ ${data.postName}\n` +
    `🔢 পদের সংখ্যাঃ ${data.postCount}\n` +
    `🎖️ গ্রেডঃ ${data.grade}\n` +
    `⭐ অগ্রাধিকারঃ ${data.priority}\n` +
    `🔗 লিংকঃ ${data.applyLink}\n` +
    `💰 আনুমানিক পেমেন্টর পরিমাণঃ ${data.paymentAmount}\n\n` +
    `📊 Sheet-ready CSV:\n${csvLine}`;

  try {
    // === Send text to Telegram ===
    await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: textMessage })
    });

    // === Send file (circular) ===
    await sendFile(document.getElementById("circularFile")?.files[0]);

    alert("✅ ডেটা সফলভাবে সাবমিট হয়েছে।");
    form.reset();

  } catch (err) {
    console.error("❌ Error:", err);
    alert("❌ ডেটা পাঠাতে সমস্যা হয়েছে, আবার চেষ্টা করুন!");
  } finally {
    loadingDiv.style.display = "none";
  }
});
