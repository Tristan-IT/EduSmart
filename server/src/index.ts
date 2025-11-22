import env from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { createApp } from "./app.js";
import "./config/passport.js";

const bootstrap = async () => {
  try {
    await connectDatabase();
    const app = createApp();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Server bootstrap failed", error);
    process.exit(1);
  }
};

bootstrap();
