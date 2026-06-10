"use client";

import { useForm, Controller } from "react-hook-form";
import { Label } from "@nuru/ui/components/label";
import { Select } from "@nuru/ui/components/select";
import { SelectContent } from "@nuru/ui/components/select";
import { SelectItem } from "@nuru/ui/components/select";
import { SelectTrigger } from "@nuru/ui/components/select";
import { SelectValue } from "@nuru/ui/components/select";
import { Input } from "@nuru/ui/components/input";
import { Button } from "@nuru/ui/components/button";

export type ModuleFormInputs = {
	title: string;
	difficulty: string;
	visibility: string;
};

export default function ModuleForm({
	onSubmit,
	initialData,
	isUpdate = false,
}: {
	onSubmit: (data: ModuleFormInputs) => void;
	initialData?: Partial<ModuleFormInputs>;
	isUpdate?: boolean;
}) {
	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ModuleFormInputs>({
		defaultValues: {
			title: initialData?.title || "",
			difficulty: initialData?.difficulty || "medium",
			visibility: initialData?.visibility || "private",
		},
	});

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl mx-auto p-6 bg-background rounded-lg border">
			<div className="flex justify-between items-center border-b pb-4">
				<h2 className="text-2xl font-bold">{isUpdate ? "Edit Module Settings" : "Create New Module"}</h2>
				<Button type="submit">{isUpdate ? "Save Changes" : "Create"}</Button>
			</div>

			<div className="space-y-2">
				<Label>Module Title</Label>
				<Input {...register("title", { required: "Title is required" })} className="rounded-none" />
				{errors.title && <p className="text-destructive text-xs">{errors.title.message}</p>}
			</div>

			<div className="grid w-fit grid-cols-1 gap-4 md:grid-cols-2">
				<div className="space-y-2">
					<Label>Difficulty</Label>
					<Controller
						control={control}
						name="difficulty"
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className="rounded-none w-48">
									<SelectValue placeholder="Select difficulty" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="easy">Easy</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="hard">Hard</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
				</div>
				<div className="space-y-2">
					<Label>Visibility</Label>
					<Controller
						control={control}
						name="visibility"
						render={({ field }) => (
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger className="rounded-none w-48">
									<SelectValue placeholder="Select visibility" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="public">Public</SelectItem>
									<SelectItem value="private">Private</SelectItem>
									<SelectItem value="organization">Organization</SelectItem>
								</SelectContent>
							</Select>
						)}
					/>
				</div>
			</div>
		</form>
	);
}
