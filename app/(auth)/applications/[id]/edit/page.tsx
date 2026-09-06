// app/(auth)/applications/[id]/edit/page.tsx
"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TechStackInput } from "@/components/tech-stack-input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { CompanyCombobox } from "@/components/company-combobox";
import { trpc } from "@/lib/trpc";
import {
  editApplicationFormSchema,
  EditApplicationFormInput,
  EditApplicationFormValues,
} from "@/lib/schemas/application";
import { ContactsSection } from "@/components/contacts-section";
import { AnswersSection } from "@/components/answers-section";
import { HistorySection } from "@/components/history-section";
import { StatusStepper } from "@/components/status-stepper";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { data, isLoading } = trpc.application.byId.useQuery({ id });

  const updateApplication = trpc.application.update.useMutation({
    meta: { successMessage: "Application updated" },
    onSuccess: () => {
      utils.application.list.invalidate();
      utils.application.byId.invalidate({ id });
    },
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditApplicationFormInput, unknown, EditApplicationFormValues>({
    resolver: zodResolver(editApplicationFormSchema),
  });

  useEffect(() => {
    if (data) {
      reset({
        id: data.id,
        title: data.title,
        companyId: data.companyId,
        url: data.url ?? "",
        location: data.location ?? "",
        remotePolicy: (data.remotePolicy as any) ?? "hybrid",
        salaryMin: data.salaryMin ?? undefined,
        salaryMax: data.salaryMax ?? undefined,
        techStack: data.techStack,
        description: data.description ?? "",
        formAnswers: data.formAnswers.map((fa) => ({
          question: fa.question,
          answer: fa.answer,
        })),
      });
    }
  }, [data, reset]);

  const saveOnBlur = () => {
    handleSubmit((values) => updateApplication.mutate(values))();
  };

  const deleteApplication = trpc.application.delete.useMutation({
    meta: { successMessage: "Application deleted" },
    onSuccess: () => {
      utils.application.list.invalidate();
      router.push("/applications");
    },
  });

  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <FieldGroup>
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 mb-4 flex gap-4 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="w-17"
            onClick={() => router.push("/applications")}
          >
            <ChevronLeft /> Back
          </Button>
          <h2>
            {data.title} at {data.company.name}
          </h2>
          <StatusStepper
            applicationId={data.id}
            currentStatus={data.currentStatus}
          />
        </div>
        <div className="col-span-4 flex flex-col gap-2">
          <Field>
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} onBlur={saveOnBlur} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </Field>

          <Field>
            <Label>Company</Label>
            <Controller
              name="companyId"
              control={control}
              render={({ field }) => (
                <CompanyCombobox
                  value={field.value}
                  onChange={(v) => {
                    field.onChange(v);
                    saveOnBlur();
                  }}
                />
              )}
            />
          </Field>

          <Field>
            <Label htmlFor="url">Link</Label>
            <Input
              id="url"
              type="url"
              {...register("url")}
              onBlur={saveOnBlur}
            />
            {errors.url && (
              <p className="text-sm text-destructive">{errors.url.message}</p>
            )}
          </Field>

          <Field>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              {...register("location")}
              onBlur={saveOnBlur}
            />
          </Field>

          <Field>
            <Label>Location type</Label>
            <Controller
              name="remotePolicy"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={(v) => {
                    field.onChange(v);
                    saveOnBlur();
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="hybrid" id="hybrid" />
                    <Label htmlFor="hybrid">Hybrid</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="on-site" id="on-site" />
                    <Label htmlFor="on-site">On-site</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="remote" id="remote" />
                    <Label htmlFor="remote">Remote</Label>
                  </div>
                </RadioGroup>
              )}
            />
          </Field>

          <Field>
            <Label>Salary</Label>
            <div className="flex gap-2 items-center">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
                <Input
                  className="pl-7"
                  {...register("salaryMin")}
                  onBlur={saveOnBlur}
                />
              </div>
              -
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  €
                </span>
                <Input
                  className="pl-7"
                  {...register("salaryMax")}
                  onBlur={saveOnBlur}
                />
              </div>
            </div>
            {errors.salaryMax && (
              <p className="text-sm text-destructive">
                {errors.salaryMax.message}
              </p>
            )}
          </Field>

          <Field>
            <Label>Tech stack</Label>
            <Controller
              name="techStack"
              control={control}
              render={({ field }) => (
                <TechStackInput
                  value={field.value || []}
                  onChange={(v) => {
                    field.onChange(v);
                    saveOnBlur();
                  }}
                />
              )}
            />
          </Field>
        </div>
        <div className="col-span-4">
          <ContactsSection companyId={data.companyId} />
          {data.currentStatus !== "SAVED" ? (
            <AnswersSection applicationId={id} />
          ) : null}
        </div>
        <div className="col-span-4">
          <HistorySection applicationId={id} events={data.statusEvents} />
        </div>
        <Field className="col-span-12">
          <Label htmlFor="description">Description</Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <RichTextEditor
                value={field.value ?? ""}
                onChange={(v) => {
                  field.onChange(v);
                  saveOnBlur();
                }}
              />
            )}
          />
        </Field>
        <div className="col-span-12">
          <Button
            variant="destructive"
            onClick={() => {
              deleteApplication.mutate({ id: data.id });
            }}
          >
            Delete this application
          </Button>
        </div>
      </div>
    </FieldGroup>
  );
}
