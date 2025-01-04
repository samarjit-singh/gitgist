import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useProject = () => {
  const { data: projects } = api.project.getProjects.useQuery();
  //   useLocalStorage is similar to useState, but it persists data in localStorage
  const [projectId, setProjectId] = useLocalStorage("gitgist-projectId", " ");
  const project = projects?.find((project) => project.id === projectId);

  return {
    projects,
    project,
    projectId,
    setProjectId,
  };
};

export default useProject;
