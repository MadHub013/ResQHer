export const handleBotResponse = async (message: string): Promise<string> => {
  const text = message.trim().toLowerCase();

  if (/\b(help|emergency|sos|danger)\b/.test(text)) {
    return "ResQHer cannot contact authorities or share your location. If you are in immediate danger, call 112 now or use the phone app to contact someone you trust.";
  }

  if (text.includes("safe route")) {
    return "This app cannot assess route safety in real time. Safe Travel can open directions in Google Maps, but those directions are not verified as safe.";
  }

  if (text.includes("legal")) {
    return "This offline guide cannot connect you to a lawyer or provide legal advice. Use the Helplines screen to call listed services, and verify providers independently.";
  }

  if (text.includes("report")) {
    return "The incident form saves a report only on this device; it does not send it to authorities. In an emergency, call 112.";
  }

  if (text.includes("contact")) {
    return "Your emergency contacts are stored on this device. Open your profile to manage them or call a contact directly.";
  }

  if (text.includes("mental health")) {
    return "This offline guide is not a counselor. Open Helplines for available support numbers. If there is immediate danger, call 112.";
  }

  return "This is an offline help guide, not a live AI service. I can point you to the app's report form, Safe Travel, profile contacts, or Helplines. For immediate danger, call 112.";
};
