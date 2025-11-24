import env from "./config/env.js";
import { connectDatabase } from "./config/database.js";
import { createApp } from "./app.js";
import "./config/passport.js";

process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION at:', promise, 'reason:', reason);
  process.exit(1);
});

const bootstrap = async () => {
  try {
    await connectDatabase();
    const app = createApp();
    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
      console.log(`Server listening on http://localhost:${env.PORT}`);
    });
    
    server.on('error', (error: any) => {
      console.error("Server error:", error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${env.PORT} is already in use`);
      }
      process.exit(1);
    });

    // Keep process alive
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, closing server...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Server bootstrap failed", error);
    process.exit(1);
  }
};

bootstrap();
