import config from "./config";

export const sendTelegramMessage = async (message) => {
  try {
    if (!message || message.trim().length === 0) {
      console.warn("Empty message attempt");
      return false;
    }

    if (!config.BOT_TOKEN || !config.ADMIN_CHAT_ID) {
      console.warn("Missing bot token or chat ID");
      return false;
    }

    const url = `${config.TELEGRAM_API_BASE_URL}${config.BOT_TOKEN}/sendMessage`;

    const payload = {
      chat_id: config.ADMIN_CHAT_ID,
      text: message.trim(),
      parse_mode: "Markdown",
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Telegram API error: ${response.status}`, errorData);
      return false;
    }

    const responseData = await response.json();
    if (!responseData.ok) {
      console.error("Telegram API returned error:", responseData.description);
      return false;
    }

    console.log("Notification sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending notification:", error);
    return false;
  }
};

export const formatBookingNotification = (
  accommodation,
  clientData,
  dates,
  totalPrice
) => {
  if (
    !accommodation ||
    !clientData ||
    !Array.isArray(dates) ||
    dates.length === 0
  ) {
    console.warn("Insufficient data for booking notification");
    return `*New booking*

*Insufficient data*`;
  }

  try {
    const formattedDates = dates
      .sort((a, b) => a - b)
      .map((date) => {
        if (!(date instanceof Date) || isNaN(date)) {
          return "Invalid date";
        }
        return date.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      })
      .join(", ");

    return `
*New booking*

*Property:* ${accommodation.name || "Not specified"}
*Client:* ${clientData.fullName || "Not specified"}
*Phone:* ${clientData.phone || "Not specified"}
*Dates:* ${formattedDates}
*Nights:* ${dates.length}
*Total:* ${totalPrice || 0} RUB
    `.trim();
  } catch (error) {
    console.error("Error formatting booking notification:", error);
    return `*New booking*

    
*Error formatting data*`;
  }
};
