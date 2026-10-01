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

export const getAllowedOrigins = ({ isProduction, devOrigin, productionOrigin }) =>
  (isProduction ? [productionOrigin] : [devOrigin, productionOrigin])
    .map(normalizeOrigin)
    .filter(Boolean);