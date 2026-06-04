"use client";

import { Controller, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@nuru/ui/components/label";
import { Input } from "@nuru/ui/components/input";
import { Badge } from "@nuru/ui/components/badge";
import { Button } from "@nuru/ui/components/button";
import { Textarea } from "@nuru/ui/components/textarea";
import { Switch } from "@nuru/ui/components/switch";
import { Card, CardContent } from "@nuru/ui/components/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@nuru/ui/components/select";

import { cn } from "@nuru/ui/lib/utils";
import { Trash2Icon, EyeIcon, PlusIcon } from "lucide-react";
import TiptapEditor from "./tiptap-editor";

import { nuruLanguage } from "@nuru/ui/lib/nuru-syntax";
import { CodeEditor } from "@nuru/ui/components/code-editor";
import { testCaseSchema_v1, type TestCaseV1 } from "@nuru/ui/validation/test-cases";

const lessonSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	task: z.string().min(1, "Task is required"),
	defaultCodeTemplate: z.string(),
	testCases: z.array(testCaseSchema_v1).min(1, "At least one test case is required"),
});

export type LessonFormInputs = z.infer<typeof lessonSchema>;

export default function LessonEditor({ onSubmit, initialData, isUpdate = false }: { onSubmit: (data: LessonFormInputs) => void; initialData?: Partial<LessonFormInputs>; isUpdate?: boolean }) {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isDirty },
		watch,
	} = useForm<LessonFormInputs>({
		resolver: zodResolver(lessonSchema),
		defaultValues: {
			title: initialData?.title || "",
			description: initialData?.description || "",
			task: initialData?.task || "",
			defaultCodeTemplate: initialData?.defaultCodeTemplate || "",
			testCases: (initialData?.testCases as TestCaseV1[]) || [],
		},
	});

	const {
		fields: testCases,
		append,
		remove,
	} = useFieldArray({
		control,
		name: "testCases",
	});

	const watchedTestCases = watch("testCases");

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-4xl mx-auto p-6 bg-background rounded-lg border">
			<div className="flex justify-between items-center border-b pb-4">
				<h2 className="text-2xl font-bold">{isUpdate ? "Edit Lesson Content" : "Lesson Content"}</h2>
				<Button disabled={!isDirty} type="submit">
					{isUpdate ? "Save Changes" : "Save Lesson"}
				</Button>
			</div>

			<div className="space-y-2">
				<Label className="text-lg mb-2 block">Lesson Title</Label>
				<Input {...register("title")} className="rounded-none bg-slate-900" />
				{errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
			</div>

			<div className="space-y-2">
				<Label className="text-lg mb-2 block">Description (Concept Explanation)</Label>
				<Controller
					control={control}
					name="description"
					render={({ field, fieldState }) => (
						<>
							<TiptapEditor value={field.value} onChange={field.onChange} className={cn(fieldState.error && "border-destructive", "bg-slate-900")} />
							{fieldState.error && <span className="text-destructive text-xs">{fieldState.error.message}</span>}
						</>
					)}
				/>
			</div>

			<div className="space-y-2">
				<Label className="text-lg mb-2 block">Task (What the student should do)</Label>
				<Textarea rows={3} {...register("task")} className="bg-slate-900" placeholder="e.g. Create a variable called 'jina' and assign it your name." />
				{errors.task && <p className="text-destructive text-xs">{errors.task.message}</p>}
			</div>

			<div className="space-y-2 pt-4">
				<Label className="text-lg mb-2 block">Default Code Template</Label>
				<Controller control={control} name="defaultCodeTemplate" render={({ field }) => <CodeEditor className="bg-slate-900" code={field.value} onChange={field.onChange} extensions={[nuruLanguage]} />} />
			</div>

			<div className="space-y-4 pt-4">
				<div className="flex items-center justify-between">
					<div>
						<Label className="text-lg">Test Cases</Label>
						<p className="text-muted-foreground text-sm">Manage test cases for this lesson.</p>
					</div>
					<Button variant="outline" type="button" onClick={() => append({ id: crypto.randomUUID(), type: "io", input: "", expectedOutput: "", message: "Test failed", isPublic: false })}>
						<PlusIcon className="mr-1 h-4 w-4" /> Add Test Case
					</Button>
				</div>
				<div className="space-y-3">
					{testCases.map((field, index) => {
						const type = watchedTestCases[index]?.type;
						return (
							<Card key={field.id} className="border-l-4 border-l-blue-500 bg-slate-900/50">
								<CardContent className="p-4">
									<div className="mb-3 flex items-center justify-between">
										<div className="flex items-center gap-2">
											<Badge variant="outline" className="text-xs">
												Test Case {index + 1}
											</Badge>
											<Controller
												control={control}
												name={`testCases.${index}.type`}
												render={({ field: subField }) => (
													<Select onValueChange={subField.onChange} defaultValue={subField.value}>
														<SelectTrigger className="h-7 w-[140px] text-xs bg-slate-800 border-none">
															<SelectValue placeholder="Type" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="io">I/O Pair</SelectItem>
															<SelectItem value="match_output">Regex Output</SelectItem>
															<SelectItem value="match_code">Regex Code</SelectItem>
															<SelectItem value="exact_output">Exact Output</SelectItem>
														</SelectContent>
													</Select>
												)}
											/>
											{watchedTestCases[index]?.isPublic && (
												<Badge variant="secondary" className="text-xs">
													<EyeIcon className="mr-1 h-3 w-3" />
													Sample
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-2">
												<Label htmlFor={`public-${index}`} className="text-xs">
													Public
												</Label>
												<Controller control={control} name={`testCases.${index}.isPublic`} render={({ field: subField }) => <Switch id={`public-${index}`} checked={subField.value} onCheckedChange={subField.onChange} />} />
											</div>
											<Button variant="destructive" size="icon" type="button" className="h-8 w-8" onClick={() => remove(index)}>
												<Trash2Icon className="h-4 w-4" />
											</Button>
										</div>
									</div>

									<div className="space-y-4">
										{type === "io" && (
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label className="text-xs">Input (Stdin)</Label>
													<Controller control={control} name={`testCases.${index}.input`} render={({ field: subField }) => <Textarea rows={2} {...subField} className="font-mono text-sm bg-slate-900" placeholder="e.g. 5" />} />
												</div>
												<div className="space-y-2">
													<Label className="text-xs">Expected Output (Stdout)</Label>
													<Controller control={control} name={`testCases.${index}.expectedOutput`} render={({ field: subField }) => <Textarea rows={2} {...subField} className="font-mono text-sm bg-slate-900" placeholder="e.g. 25" />} />
												</div>
											</div>
										)}

										{(type === "match_output" || type === "match_code") && (
											<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
												<div className="space-y-2">
													<Label className="text-xs">Pattern (Regex)</Label>
													<Input {...register(`testCases.${index}.pattern`)} className="font-mono text-sm bg-slate-900" placeholder="e.g. \bvariable\b" />
												</div>
												<div className="space-y-2">
													<Label className="text-xs">Flags</Label>
													<Input {...register(`testCases.${index}.flags`)} className="font-mono text-sm bg-slate-900" placeholder="e.g. i" />
												</div>
											</div>
										)}

										{type === "exact_output" && (
											<div className="space-y-2">
												<Label className="text-xs">Expected Output</Label>
												<Controller control={control} name={`testCases.${index}.expectedOutput`} render={({ field: subField }) => <Textarea rows={2} {...subField} className="font-mono text-sm bg-slate-900" placeholder="e.g. Hello World" />} />
											</div>
										)}

										<div className="space-y-2">
											<Label className="text-xs">Failure Message</Label>
											<Input {...register(`testCases.${index}.message`)} className="bg-slate-900 text-sm" placeholder="e.g. The output should be 25" />
										</div>
									</div>
								</CardContent>
							</Card>
						);
					})}
					{errors.testCases?.root?.message && <p className="text-destructive text-xs">{errors.testCases.root.message}</p>}
					{errors.testCases?.message && <p className="text-destructive text-xs">{errors.testCases.message as string}</p>}
				</div>
			</div>
		</form>
	);
}
