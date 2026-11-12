import "dotenv/config";
import app from "./src/app.js";
import connectTODB from "./src/config/database.js";

const port = process.env.PORT || 3000;

try {
  await connectTODB();
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exitCode = 1;
}