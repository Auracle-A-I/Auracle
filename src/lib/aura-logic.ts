export interface AuraData {
  birthDate: Date;
  zodiacSign: string;
  zodiacElement: "Fire" | "Earth" | "Air" | "Water";
  zodiacModality: "Cardinal" | "Fixed" | "Mutable";
  birthstone: string;
  innerHueHex: string;
  innerHueName: string;
  outerHueHex: string;
  outerHueName: string;
  minutesAlive: string;
  temporalSignature: string;
  permeability: string;
  description: string;
}

export function computeAura(date: Date): AuraData {
  const month = date.getMonth() + 1; // 1-12
  const day = date.getDate();
  const year = date.getFullYear();

  // Zodiac logic
  let zodiacSign = "";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) zodiacSign = "Aries";
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) zodiacSign = "Taurus";
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) zodiacSign = "Gemini";
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) zodiacSign = "Cancer";
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) zodiacSign = "Leo";
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) zodiacSign = "Virgo";
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) zodiacSign = "Libra";
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) zodiacSign = "Scorpio";
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) zodiacSign = "Sagittarius";
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) zodiacSign = "Capricorn";
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) zodiacSign = "Aquarius";
  else zodiacSign = "Pisces";

  const fireSigns = ["Aries", "Leo", "Sagittarius"];
  const earthSigns = ["Taurus", "Virgo", "Capricorn"];
  const airSigns = ["Gemini", "Libra", "Aquarius"];
  const waterSigns = ["Cancer", "Scorpio", "Pisces"];

  let zodiacElement: "Fire" | "Earth" | "Air" | "Water" = "Fire";
  if (fireSigns.includes(zodiacSign)) zodiacElement = "Fire";
  if (earthSigns.includes(zodiacSign)) zodiacElement = "Earth";
  if (airSigns.includes(zodiacSign)) zodiacElement = "Air";
  if (waterSigns.includes(zodiacSign)) zodiacElement = "Water";

  const cardinalSigns = ["Aries", "Cancer", "Libra", "Capricorn"];
  const fixedSigns = ["Taurus", "Leo", "Scorpio", "Aquarius"];
  let zodiacModality: "Cardinal" | "Fixed" | "Mutable" = "Mutable";
  if (cardinalSigns.includes(zodiacSign)) zodiacModality = "Cardinal";
  if (fixedSigns.includes(zodiacSign)) zodiacModality = "Fixed";

  const birthstones = [
    "Garnet", "Amethyst", "Aquamarine", "Diamond", 
    "Emerald", "Pearl", "Ruby", "Peridot", 
    "Sapphire", "Opal", "Topaz", "Turquoise"
  ];
  const birthstone = birthstones[month - 1];

  // HSL Color logic
  let baseHue = 0;
  if (zodiacElement === "Fire") baseHue = (day * 1) % 30; // 0-30
  if (zodiacElement === "Earth") baseHue = 80 + (day * 2) % 60; // 80-140
  if (zodiacElement === "Air") baseHue = 180 + (day * 1.5) % 40; // 180-220
  if (zodiacElement === "Water") baseHue = 250 + (day * 1.2) % 40; // 250-290

  const innerHueHex = hslToHex(baseHue, 80, 50);
  const innerHueName = getHueName(baseHue);

  let outerHue = baseHue;
  let outerSat = 80;
  let outerLight = 50;

  if (zodiacModality === "Cardinal") {
    outerSat = 100;
    outerLight = 60;
  } else if (zodiacModality === "Fixed") {
    outerSat = 90;
    outerLight = 30;
  } else {
    outerHue = (baseHue + 30) % 360;
  }
  
  const outerHueHex = hslToHex(outerHue, outerSat, outerLight);
  const outerHueName = getHueName(outerHue, outerLight < 40);

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  const minutesStr = new Intl.NumberFormat().format(minutes);

  const tsNum = (minutes * day * month) + year;
  const tsStr = tsNum.toString(36).toUpperCase().padStart(12, "0");
  const temporalSignature = `${tsStr.slice(0, 4)}-${tsStr.slice(4, 8)}-${tsStr.slice(8, 12)}`;

  const permeability = ((day * month) % 100) + "%";

  const descriptions = {
    "Fire": {
      "Cardinal": "An initiator of energy, radiating fierce pioneer warmth that cuts through darkness.",
      "Fixed": "A steady, enduring flame that provides unwavering light and localized gravity.",
      "Mutable": "A flickering, dancing energy, adapting and spreading warmth unpredictably."
    },
    "Earth": {
      "Cardinal": "A tectonic force, pushing upward to create new structures and boundaries.",
      "Fixed": "Deep bedrock energy, immovable and resonating with ancient, grounded certainty.",
      "Mutable": "Shifting sands, resourceful and grounding, accommodating the flow of time."
    },
    "Air": {
      "Cardinal": "A sudden gust of insight, driving intellectual currents and swift changes.",
      "Fixed": "A concentrated pressure system, sustaining deep focus and enduring thought.",
      "Mutable": "A gentle, pervasive breeze, connecting dispersed ideas with fluid curiosity."
    },
    "Water": {
      "Cardinal": "A surging wave, initiating deep emotional currents and washing away the old.",
      "Fixed": "A profound, still ocean—impenetrable on the surface, transformative beneath.",
      "Mutable": "A misty, adaptable essence, shifting between states with boundless empathy."
    }
  };

  const description = descriptions[zodiacElement][zodiacModality];

  return {
    birthDate: date,
    zodiacSign,
    zodiacElement,
    zodiacModality,
    birthstone,
    innerHueHex,
    innerHueName,
    outerHueHex,
    outerHueName,
    minutesAlive: minutesStr,
    temporalSignature,
    permeability,
    description
  };
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

  const toHex = (v: number) => {
    const hex = Math.round((v + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function getHueName(h: number, dark = false): string {
  if (h < 15) return dark ? "Crimson" : "Scarlet";
  if (h < 45) return dark ? "Burnt Orange" : "Amber";
  if (h < 75) return dark ? "Ochre" : "Gold";
  if (h < 105) return dark ? "Olive" : "Chartreuse";
  if (h < 135) return dark ? "Forest" : "Emerald";
  if (h < 165) return dark ? "Pine" : "Jade";
  if (h < 195) return dark ? "Teal" : "Cyan";
  if (h < 225) return dark ? "Cobalt" : "Azure";
  if (h < 255) return dark ? "Navy" : "Cerulean";
  if (h < 285) return dark ? "Indigo" : "Violet";
  if (h < 315) return dark ? "Plum" : "Amethyst";
  if (h < 345) return dark ? "Magenta" : "Fuchsia";
  return dark ? "Crimson" : "Scarlet";
}
