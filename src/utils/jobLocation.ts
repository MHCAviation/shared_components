const COUNTRY_ISO_MAP: Record<string, string> = {
  australia: "AU",
  austria: "AT",
  belgium: "BE",
  bulgaria: "BG",
  canada: "CA",
  china: "CN",
  croatia: "HR",
  cyprus: "CY",
  "czech republic": "CZ",
  denmark: "DK",
  estonia: "EE",
  finland: "FI",
  france: "FR",
  germany: "DE",
  greece: "GR",
  hungary: "HU",
  iceland: "IS",
  india: "IN",
  indonesia: "ID",
  ireland: "IE",
  italy: "IT",
  japan: "JP",
  latvia: "LV",
  lithuania: "LT",
  luxembourg: "LU",
  malta: "MT",
  malaysia: "MY",
  netherlands: "NL",
  "new zealand": "NZ",
  norway: "NO",
  philippines: "PH",
  poland: "PL",
  portugal: "PT",
  qatar: "QA",
  romania: "RO",
  "saudi arabia": "SA",
  singapore: "SG",
  slovakia: "SK",
  slovenia: "SI",
  "south africa": "ZA",
  spain: "ES",
  sweden: "SE",
  switzerland: "CH",
  thailand: "TH",
  turkey: "TR",
  "united arab emirates": "AE",
  "united kingdom": "GB",
  uk: "GB",
  "united states": "US",
  usa: "US",
  vietnam: "VN",
};

const toCountryIsoCode = (value?: string | null) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.length === 2) return trimmed.toUpperCase();
  return COUNTRY_ISO_MAP[trimmed.toLowerCase()] || trimmed;
};

export const parseJobLocation = (location?: string | null) => {
  if (!location) return null;

  const cleaned = location.replace(/\s*\([^)]*\)\s*$/, "").trim();
  if (!cleaned) return null;

  const codeMatch = location.match(/\(([A-Za-z]{2})\b/);
  const codeFromParen = codeMatch?.[1]?.toUpperCase();

  const parts = cleaned
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  const countryPart = parts[parts.length - 1] || cleaned;
  const addressCountry = codeFromParen || toCountryIsoCode(countryPart);
  const addressLocality = parts.length > 1 ? parts.slice(0, -1).join(", ") : "";

  return {
    name: cleaned,
    addressCountry,
    addressLocality: addressLocality || undefined,
  };
};
