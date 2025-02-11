import { users, tasks, type User, type InsertUser, type Task, type InsertTask } from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  createTask(userId: number, task: InsertTask): Promise<Task>;
  getTasks(userId: number, date?: Date): Promise<Task[]>;
  updateTaskStatus(taskId: number, status: string): Promise<Task>;

  sessionStore: session.SessionStore;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createTask(userId: number, insertTask: InsertTask): Promise<Task> {
    const [task] = await db
      .insert(tasks)
      .values({ ...insertTask, userId })
      .returning();
    return task;
  }

  async getTasks(userId: number, date?: Date): Promise<Task[]> {
    let query = db.select().from(tasks).where(eq(tasks.userId, userId));

    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query = query.where(
        and(
          gte(tasks.date, start),
          lte(tasks.date, end)
        )
      );
    }

    return await query;
  }

  async updateTaskStatus(taskId: number, status: string): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({ status })
      .where(eq(tasks.id, taskId))
      .returning();

    if (!task) throw new Error("Task not found");
    return task;
  }
}

export const storage = new DatabaseStorage();