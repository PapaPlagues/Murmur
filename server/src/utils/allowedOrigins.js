export const getAllowedOrigins = ({ isProduction, devOrigin, productionOrigin }) =>
  (isProduction ? [productionOrigin] : [devOrigin, productionOrigin]).filter(
    Boolean,
  );