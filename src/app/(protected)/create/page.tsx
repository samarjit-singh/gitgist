"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type FormInput = {
  repoUrl: string;
  projectName: string;
  githubToken: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();

  function onSubmit(data: FormInput) {
    window.alert(JSON.stringify(data));
    return true;
  }

  return (
    <div className="flex h-full items-center justify-center gap-12">
      <img src="/connect.svg" alt="logo" className="h-56 w-auto" />
      <div>
        <div>
          <h1 className="text-2xl font-semibold text-[#3D3D3D]">
            Link your GitHub repository
          </h1>
          <p className="text-sm text-[#3D3D3D] text-muted-foreground">
            Enter the URL of your GitHub repository to link it to GitGist.
          </p>
        </div>
        <div className="h-4"></div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register("projectName", { required: true })}
              placeholder="Project Name"
              required
              className="text-[#3D3D3D]"
            />
            <div className="h-2"></div>
            <Input
              {...register("repoUrl", { required: true })}
              placeholder="Github URL"
              type="url"
              required
              className="text-[#3D3D3D]"
            />
            <div className="h-2"></div>
            <Input
              {...register("githubToken")}
              placeholder="Github Token (Optional)"
              className="text-[#3D3D3D]"
            />
            <div className="h-4"></div>
            <Button
              type="submit"
              variant={"outline"}
              className="bg-[#3D3D3D] text-[#E7FBB4]"
            >
              Create Project
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
