"use client";

import { Controller, useForm, useFieldArray } from "react-hook-form";
import { Label, Input, Badge, Button, Textarea, Switch, Card, CardContent, cn } from "@nuru/ui";
import { Trash2Icon, EyeIcon, PlusIcon } from "lucide-react";
import TiptapEditor from "./tiptap-editor";

export type LessonFormInputs = {
	title: string;
	description: string;
	task: string;
	defaultCodeTemplate: string;
	testCases: Array<{
		input: string;
		output: string;
		isPublic: boolean;
	}>;
};

export default function LessonEditor({
	onSubmit
}: {
	onSubmit: (data: LessonFormInputs) => void;
}) {
	const { register, control, handleSubmit, formState: { errors } } = useForm<LessonFormInputs>({
		defaultValues: {
			title: "",
			description: "",
			task: "",
			defaultCodeTemplate: "",
			testCases: [],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "testCases",
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-4xl mx-auto p-6 bg-background rounded-lg border">
			<div className="flex justify-between items-center border-b pb-4">
				<h2 className="text-2xl font-bold">Lesson Content</h2>
				<Button type="submit">Save Lesson</Button>
			</div>

			<div className="space-y-2">
				<Label>Lesson Title</Label>
				<Input {...register("title", { required: "Title is required" })} className="rounded-none" />
				{errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
			</div>

			<div className="space-y-2">
				<Label>Description (Concept Explanation)</Label>
				<Controller
					control={control}
					name="description"
					rules={{ required: "Description is required" }}
					render={({ field, fieldState }) => (
						<>
							<TiptapEditor
								value={field.value}
								onChange={field.onChange}
								className={cn(fieldState.error && "border-destructive")}
							/>
							{fieldState.error && <span className="text-destructive text-xs">{fieldState.error.message}</span>}
						</>
					)}
				/>
			</div>

			<div className="space-y-2">
				<Label>Task (What the student should do)</Label>
				<Textarea rows={3} {...register("task", { required: "Task is required" })} className="rounded-none" placeholder="e.g. Create a variable called 'jina' and assign it your name." />
				{errors.task && <p className="text-destructive text-xs">{errors.task.message}</p>}
			</div>

			<div className="space-y-2 pt-4 border-t">
				<Label>Default Code Template</Label>
				<Textarea rows={6} {...register("defaultCodeTemplate")} className="rounded-none font-mono text-sm" placeholder="// Andika msimbo wako hapa" />
			</div>

			<div className="space-y-4 pt-4 border-t">
				<div className="flex items-center justify-between">
					<div>
						<Label className="text-lg font-semibold">Test Cases</Label>
						<p className="text-muted-foreground text-sm">Manage input/output test cases for this lesson.</p>
					</div>
					<Button variant="outline" size="sm" type="button" onClick={() => append({ input: "", output: "", isPublic: true })}>
						<PlusIcon className="mr-2 h-4 w-4" /> Add Test Case
					</Button>
				</div>
				<div className="space-y-3">
					{fields.map((field, index) => (
						<Card key={field.id} className="rounded-none border-l-4 border-l-blue-500">
							<CardContent className="p-4">
								<div className="mb-3 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<Badge variant="outline" className="text-xs">Test Case {index + 1}</Badge>
										{field.isPublic && <Badge variant="secondary" className="text-xs"><EyeIcon className="mr-1 h-3 w-3" />Sample</Badge>}
									</div>
									<div className="flex items-center gap-4">
										<div className="flex items-center gap-2">
											<Label htmlFor={`public-${index}`} className="text-xs">Public</Label>
											<Controller
												control={control}
												name={`testCases.${index}.isPublic`}
												render={({ field: subField }) => (
													<Switch id={`public-${index}`} checked={subField.value} onCheckedChange={subField.onChange} />
												)}
											/>
										</div>
										<Button variant="ghost" size="icon" type="button" className="text-destructive h-8 w-8" onClick={() => remove(index)}>
											<Trash2Icon className="h-4 w-4" />
										</Button>
									</div>
								</div>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									<div className="space-y-2">
										<Label className="text-sm">Input</Label>
										<Controller
											control={control}
											name={`testCases.${index}.input`}
											render={({ field: subField }) => (
												<Textarea rows={3} {...subField} className="font-mono text-sm" placeholder="e.g. 5" />
											)}
										/>
									</div>
									<div className="space-y-2">
										<Label className="text-sm">Expected Output</Label>
										<Controller
											control={control}
											name={`testCases.${index}.output`}
											render={({ field: subField }) => (
												<Textarea rows={3} {...subField} className="font-mono text-sm" placeholder="e.g. 25" />
											)}
										/>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		</form>
	);
}
