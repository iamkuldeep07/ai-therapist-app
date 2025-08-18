import express, { Request, Response } from "express";
import { serve } from "inngest/express";
import { inngest } from "./inngest";
import {functions as inngestFunctions } from "./inngest/functions"
import { logger } from "./utils/logger";
import { connectDB } from "./utils/db";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/errorHandler";


dotenv.config();

const app = express();


app.use(cors());
app.use(helmet());
app.use(morgan("dev"));


app.use(express.json());

app.use(
    "/api/inngest", 
    serve({ client: inngest, functions: inngestFunctions })
);


app.use("/auth", authRoutes);


app.use(errorHandler);

const startServer = async () => {
    try {

        await connectDB();
        const PORT = process.env.PORT || 3001;
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
            logger.info(
                `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
            );
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
};
startServer();

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });