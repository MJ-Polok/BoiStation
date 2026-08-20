const defaultClientOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];

export const getAllowedOrigins = () => {
  const envOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  return [...new Set([...envOrigins, ...defaultClientOrigins])];
};
