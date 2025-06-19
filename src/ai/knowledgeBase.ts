// src/ai/knowledgeBase.ts

interface Knowledge {
  [appliance: string]: {
    keywords: { [keyword: string]: string };
    default: string;
  };
}

export const knowledgeBase: Knowledge = {
  "Smart TV": {
    keywords: {
      wifi: 'To connect the TV to Wi-Fi, go to Settings > Network > Network Setup and select "Digital Guidebook_Guest". The password is "perfect-stay-2024!".',
      netflix:
        "The TV has a dedicated Netflix button on the remote. Just press it and log in with your own account.",
      input:
        'To change the input (e.g., for a game console), press the "Source" or "Input" button on the remote and select the correct HDMI port.',
      sound:
        "The soundbar is connected via HDMI ARC. Ensure the soundbar is powered on. You can control its volume with the main TV remote.",
    },
    default:
      "I can help with questions about Wi-Fi, Netflix, changing inputs, or sound issues. What would you like to know?",
  },
  "Nespresso Machine": {
    keywords: {
      start:
        "To start the machine, ensure it has water in the back reservoir, insert a coffee pod, close the lever, and press either the small cup (espresso) or large cup (lungo) button.",
      water:
        "The water reservoir is located at the back of the machine. Lift it straight up to remove it for refilling.",
      pods: "You can find complimentary coffee pods in the small drawer next to the machine. Feel free to use them!",
      clean:
        "To run a cleaning cycle, ensure no pod is in the machine, then press and hold the large cup button for 3 seconds.",
    },
    default:
      "I can help with questions about how to start the machine, where to find pods, or how to clean it. What do you need help with?",
  },
};
