const normalizeOrigin = (value) => {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    return url.origin;
  } catch {
    return null;
  }
};

const parseOrigins = (value) =>
  (typeof value === "string" ? value.split(",") : [])
    .map((origin) => normalizeOrigin(origin.trim()))
    .filter(Boolean);

export const getAllowedOrigins = ({
  isProduction,
  devOrigin,
  productionOrigin,
}) =>
  (isProduction ? [productionOrigin] : [devOrigin, productionOrigin])
    .flatMap(parseOrigins)
    .filter(Boolean);
