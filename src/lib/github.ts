import { db } from "@/server/db";
import { Octokit } from "octokit"; // library for interacting with github api
import axios from "axios";
import { aiSummarizeCommits } from "./gemini";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitAuthorName: string;
  commitAuthorAvatar: string;
  commitDate: string;
};

export const getCommitHashes = async (
  gitHubUrl: string,
): Promise<Response[]> => {
  const [owner, repo] = gitHubUrl.split("/").slice(-2);

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner,
    repo,
  });

  const sortedCommits = data.sort((a: any, b: any) => {
    return (new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()) as any;
  });

  return sortedCommits.slice(0, 10).map((commit: any) => {
    const authorAvatar =
      commit.author?.avatar_url ?? commit.committer?.avatar_url ?? "";

    return {
      commitHash: commit.sha ?? "",
      commitMessage: commit.commit.message ?? "",
      commitAuthorName: commit.commit.author.name ?? "",
      commitAuthorAvatar: authorAvatar,
      commitDate: commit.commit.author.date ?? "",
    };
  });
};

export const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
    select: {
      githubUrl: true,
    },
  });

  if (!project?.githubUrl) {
    throw new Error("Project has no github url");
  }

  return {
    project,
    githubUrl: project?.githubUrl,
  };
};

async function filterUnprocessedCommits(
  projectId: string,
  commitHashes: Response[],
) {
  const processedCommits = await db.commit.findMany({
    where: { projectId },
  });

  const unprocessedCommits = commitHashes.filter(
    (commit) =>
      !processedCommits.some(
        (processedCommit) => processedCommit.commitHash === commit.commitHash,
      ),
  );

  return unprocessedCommits;
}

async function summarizeCommits(githubUrl: string, commitHashes: string) {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHashes}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff", // this is github own custom formating
    },
  });

  return await aiSummarizeCommits(data);
}

export const pollCommits = async (projectId: string) => {
  const { project, githubUrl } = await fetchProjectGithubUrl(projectId);
  const commitHashes = await getCommitHashes(githubUrl);
  const unprocessedCommits = await filterUnprocessedCommits(
    projectId,
    commitHashes,
  );
  const summaryResponses = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summarizeCommits(githubUrl, commit.commitHash);
    }),
  );
  const summaries = summaryResponses.map((response) => {
    if (response.status === "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  const commits = await db.commit.createMany({
    data: summaries.map((summary, index) => {
      if (!summary) {
        console.warn(
          `Empty summary for commit ${unprocessedCommits[index]?.commitHash}`,
        );
      }
      return {
        projectId: projectId,
        commitHash: unprocessedCommits[index]!.commitHash,
        commitMessage: unprocessedCommits[index]!.commitMessage,
        commitAuthorName: unprocessedCommits[index]!.commitAuthorName,
        commitAuthorAvatar: unprocessedCommits[index]!.commitAuthorAvatar,
        commitDate: unprocessedCommits[index]!.commitDate,
        summary,
      };
    }),
  });

  return commits;
};
