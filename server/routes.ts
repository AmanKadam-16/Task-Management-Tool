import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { insertTaskSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  setupAuth(app);

  // Tasks API
  app.post("/api/tasks", async (req, res) => {
    try {
      if (!req.isAuthenticated()) return res.sendStatus(401);

      const parseResult = insertTaskSchema.safeParse(req.body);
      if (!parseResult.success) {
        console.error("Task validation failed:", parseResult.error);
        return res.status(400).json(parseResult.error);
      }

      const task = await storage.createTask(req.user!.id, parseResult.data);
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.get("/api/tasks", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const tasks = await storage.getTasks(req.user!.id, date);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.patch("/api/tasks/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    try {
      const { status } = req.body;
      if (!status) return res.status(400).send("Status is required");

      const task = await storage.updateTaskStatus(parseInt(req.params.id), status);
      res.json(task);
    } catch (error) {
      console.error("Error updating task status:", error);
      res.status(500).json({ message: "Failed to update task status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}