import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import ApplicationsPie from "./applications-pie";
import StageFunnel from "./stage-funnel";
import ActivityHeatmap from "./activity-heatmap";
import RecentApplications from "./recent-applications";
import { MoveRight } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return (
    <div>
      <h1 className="text-xl mb-4">Welcome back, {session.user.name}</h1>
      <div className="w-full grid grid-cols-9 gap-2">
        <div className="col-span-3 flex flex-col gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Current status of applications</CardTitle>
            </CardHeader>
            <CardContent>
              <ApplicationsPie />
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>How far applications got</CardTitle>
              <CardDescription>
                Furthest stage reached, including rejected ones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <StageFunnel />
            </CardContent>
          </Card>
        </div>
        <div className="col-span-6 flex flex-col gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <ActivityHeatmap />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <h3>Recent applications</h3>
                <Link
                  href="/applications"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <span>View all</span>
                  <MoveRight size={14} />
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RecentApplications />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
