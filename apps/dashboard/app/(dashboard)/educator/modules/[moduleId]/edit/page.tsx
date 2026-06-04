import { getModuleWithLessons, updateModule } from "@/app/actions/modules";
import ModuleForm, { type ModuleFormInputs } from "@/components/editor/module-form";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function EditModulePage({ 
    params 
}: { 
    params: Promise<{ moduleId: string }> 
}) {
    const { moduleId } = await params;
    const module = await getModuleWithLessons(moduleId);

    if (!module) {
        notFound();
    }

    const initialData: ModuleFormInputs = {
        title: typeof module.title === 'string' ? module.title : (module.title as any).en,
        difficulty: module.difficulty || "medium",
        visibility: module.visibility || "private",
    };

    async function updateAction(data: ModuleFormInputs) {
        "use server";

        if(!module) throw new Error("What are you editing you idiot.");
        
        await updateModule(moduleId, {
            title: { en: data.title, sw: data.title }, 
            difficulty: data.difficulty,
            visibility: data.visibility,
            executorType: module.executorType,
            layoutConfig: module.layoutConfig,
        });

        redirect(`/educator/modules/${moduleId}`);
    }

    return (
        <div className="container mx-auto py-10">
            <ModuleForm 
                onSubmit={updateAction} 
                initialData={initialData} 
                isUpdate={true} 
            />
        </div>
    );
}
