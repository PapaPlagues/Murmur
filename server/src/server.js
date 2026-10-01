import app from "./app.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", (err) => {
  if (err) {
    console.error("Server failed to start:", err);
    process.exit(1);
  }

  console.log(`Server running on port ${PORT}`);
});
