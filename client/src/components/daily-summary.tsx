import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import EffortChart from "./effort-chart";
import { format } from "date-fns";

type CategorySummary = {
  category: string;
  totalEffort: number;
  taskCount: number;
};

export default function DailySummary() {
  const { data: tasks, isLoading } = useQuery<Task[]>({
    queryKey: ["/api/tasks", format(new Date(), "yyyy-MM-dd")],
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!tasks?.length) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No data to summarize yet.
        </CardContent>
      </Card>
    );
  }

  const categorySummary: CategorySummary[] = Object.values(
    tasks.reduce((acc: { [key: string]: CategorySummary }, task) => {
      if (!acc[task.category]) {
        acc[task.category] = {
          category: task.category,
          totalEffort: 0,
          taskCount: 0,
        };
      }
      acc[task.category].totalEffort += task.effort;
      acc[task.category].taskCount += 1;
      return acc;
    }, {})
  );

  const totalEffort = categorySummary.reduce(
    (sum, cat) => sum + cat.totalEffort,
    0
  );
  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-2xl font-bold">{tasks.length}</div>
              <div className="text-sm text-muted-foreground">Total Tasks</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{completedTasks}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">{totalEffort}</div>
              <div className="text-sm text-muted-foreground">Total Minutes</div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold">
                {Math.round(totalEffort / 60)}
              </div>
              <div className="text-sm text-muted-foreground">Total Hours</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="font-medium">Effort by Category</div>
            <EffortChart data={categorySummary} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
