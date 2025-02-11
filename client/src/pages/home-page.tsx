import { useAuth } from "@/hooks/use-auth";
import TaskEntry from "@/components/task-entry";
import TaskList from "@/components/task-list";
import DailySummary from "@/components/daily-summary";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { BarChart4, LogOut } from "lucide-react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="min-h-screen bg-background pt-16">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Daily Effort Tracker</h1>
          <div className="flex items-center gap-4">
            <span className="text-muted-foreground">Welcome, {user?.username}</span>
            <Link href="/reports">
              <Button variant="outline">
                <BarChart4 className="h-4 w-4 mr-2" />
                Reports
              </Button>
            </Link>
            <Button
              variant="ghost"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <TaskEntry />
            <TaskList />
          </div>
          <div>
            <DailySummary />
          </div>
        </div>
      </main>
    </div>
  );
}