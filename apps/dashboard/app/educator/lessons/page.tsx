import { Button, Card, CardHeader, CardTitle, CardContent } from "@nuru/ui";
import Link from "next/link";

export default function EducatorLessonsPage() {
	return (
		<div className="container mx-auto py-10 space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold">My Lessons</h1>
				<Link href="/educator/lessons/create">
					<Button>Create New Lesson</Button>
				</Link>
			</div>
			
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Sample Lesson</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground mb-4">A basic placeholder lesson.</p>
						<div className="flex gap-2">
							<Link href="/educator/lessons/create">
								<Button variant="outline" size="sm">Edit</Button>
							</Link>
							<Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
