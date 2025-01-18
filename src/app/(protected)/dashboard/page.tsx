"use client";

import useProject from "@/hooks/use-project";
import { useUser } from "@clerk/nextjs";
import { ExternalLinkIcon, Github } from "lucide-react";
import Link from "next/link";

const page = () => {
  const { user } = useUser();
  const { project } = useProject();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-y-4">
        {/* github link */}
        <div className="w-fit rounded-md bg-[#FFF574] px-4 py-3">
          <div className="flex items-center">
            <Github className="size-5 text-[#3D3D3D]" />
            <div className="ml-2">
              <p className="text-sm font-medium text-[#3D3D3D]">
                this project is linked to {""}
                <Link
                  href={project?.githubUrl ?? ""}
                  className="inline-flex items-center text-[#3D3D3D] hover:underline"
                >
                  {project?.githubUrl}
                  <ExternalLinkIcon className="ml-1 size-4" />
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="h-4"></div>

        <div className="flex items-center gap-4">
          TeamMembers InviteButton ArchiveButton
        </div>
      </div>

      <div className="mt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          AskQuestionCard Meet card
        </div>
      </div>

      <div className="mt-8">CommitLog</div>
    </div>
  );
};

export default page;
