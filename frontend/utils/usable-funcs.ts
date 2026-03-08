// converting iso format to readable time format
export function formatToCustomTime(timestamp: string): string {
  const date = new Date(timestamp);

  // Define weekday, month names
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Extract values
  const dayName = days[date.getUTCDay()];
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = months[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} (CAT)`;
}

// converting logs duration
export function convertDuration(duration: string): string {
    // Split the duration string "HH:MM:SS"
    const [hours, minutes, seconds] = duration.split(":").map(Number);

    // Convert to total minutes
    const totalMinutes = hours * 60 + minutes + seconds / 60;

    // Convert to hours and days
    const totalHours = totalMinutes / 60;
    const totalDays = totalHours / 24;

    // Return the most appropriate format
    if (totalDays >= 1) {
        return `${Math.floor(totalDays)} day${totalDays >= 2 ? "s" : ""}`;
    } else if (totalHours >= 1) {
        return `${Math.floor(totalHours)} hour${totalHours >= 2 ? "s" : ""}`;
    } else {
        return `${Math.floor(totalMinutes)} minute${totalMinutes >= 2 ? "s" : ""}`;
    }
}

export function downloadBlob(data: Blob, filename: string) {
  const url = window.URL.createObjectURL(data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

export function printBlob(data: Blob, filename: string) {
  const url = window.URL.createObjectURL(data);
  const printWindow = window.open(url, '_blank', 'width=800,height=600');
  
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
      printWindow.onafterprint = () => {
        printWindow.close();
        window.URL.revokeObjectURL(url);
      };
    };
  } else {
    // Fallback: download the file if popup is blocked
    downloadBlob(data, filename);
  }
}
