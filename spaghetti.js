// Get references to the input and button elements
const urlInput = document.getElementById("urlInput");
const amount = document.getElementById("amount");
const openButton = document.getElementById("openButton");
const allMonitorsCheckbox = document.getElementById("monitors"); // Ensure this matches the checkbox ID in HTML

// Add a click event listener to the button
openButton.addEventListener("click", async () => {
  const url = urlInput.value.trim();
  const amt = amount.value.trim();
  const useAllMonitors = allMonitorsCheckbox.checked; // Check if "All monitors" is selected

  // Validate the URL
  if (url) {
    // Ensure the URL starts with "http://" or "https://"
    const fullUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;

    try {
      // Get all displays
      const displays = await browser.windows.getAll({ populate: true });

      // Loop through the number of windows to create
      for (let i = 0; i < parseInt(amt); i++) {
        let display;
        if (useAllMonitors) {
          // Use all monitors: cycle through displays
          const displayIndex = i % displays.length;
          display = displays[displayIndex];
        } else {
          // Use only the primary monitor
          display = displays[0]; // Primary display is usually the first one
        }

        // Generate random positions within the display's bounds
        const left = Math.floor(Math.random() * (display.width - 800)) + display.left;
        const top = Math.floor(Math.random() * (display.height - 600)) + display.top;

        // Open the URL in a new window on the current display
        browser.windows.create({
          url: fullUrl,
          type: "normal",
          width: 1000,
          height: 800,
          left: left,
          top: top
        });
        console.log(`New window opened on display ${useAllMonitors ? i % displays.length + 1 : "primary"}`);
      }
    } catch (error) {
      console.error("Error getting displays or creating windows:", error);
    }
  } else {
    alert("Please enter a valid URL.");
  }
});