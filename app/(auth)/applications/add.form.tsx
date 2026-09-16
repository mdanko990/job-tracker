"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TechStackInput } from "@/components/tech-stack-input";
import { RichTextEditor } from "@/components/rich-text-editor";
import { CompanyCombobox } from "@/components/company-combobox";
import { trpc } from "@/lib/trpc";
import {
  applicationFormSchema,
  ApplicationFormInput,
  ApplicationFormValues,
} from "@/lib/schemas/application";

export default function AddForm() {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();

  const createApplication = trpc.application.create.useMutation({
    meta: { successMessage: "Application saved" },
    onSuccess: () => {
      utils.application.list.invalidate();
      setOpen(false);
      reset();
    },
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormInput, unknown, ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      title: "",
      companyId: "",
      url: "",
      location: "",
      remotePolicy: "hybrid",
      techStack: [],
      description: "",
    },
  });

  function onSubmit(values: ApplicationFormValues) {
    createApplication.mutate({ ...values, url: values.url || undefined });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add</Button>
      </DialogTrigger>
      <DialogContent className="w-[80vw] max-w-[80vw]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add application</DialogTitle>
            <DialogDescription>Save a job posting to track.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <div className="grid grid-cols-6 gap-4 mb-4 max-h-[80vh]">
              <div className="col-span-2 flex flex-col gap-2">
                <Field>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && (
                    <p className="text-sm text-destructive">
                      {errors.title.message}
                    </p>
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
                        onChange={field.onChange}
                      />
                    )}
                  />
                  {errors.companyId && (
                    <p className="text-sm text-destructive">
                      {errors.companyId.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="url">Link</Label>
                  <Input id="url" type="url" {...register("url")} />
                  {errors.url && (
                    <p className="text-sm text-destructive">
                      {errors.url.message}
                    </p>
                  )}
                </Field>

                <Field>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" {...register("location")} />
                </Field>

                <Field>
                  <Label>Location type</Label>
                  <Controller
                    name="remotePolicy"
                    control={control}
                    render={({ field }) => (
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
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
                        type="number"
                        className="pl-7"
                        {...register("salaryMin")}
                      />
                    </div>
                    -
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                        €
                      </span>
                      <Input
                        type="number"
                        className="pl-7"
                        {...register("salaryMax")}
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
                        onChange={field.onChange}
                      />
                    )}
                  />
                </Field>
              </div>

              <Field className="col-span-4">
                <Label htmlFor="description">Description</Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      className="h-7/10"
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  )}
                />
              </Field>
            </div>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={createApplication.isPending}>
              {createApplication.isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
