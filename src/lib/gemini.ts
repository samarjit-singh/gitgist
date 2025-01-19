import { GoogleGenerativeAI } from "@google/generative-ai";

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const model = genAi.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export const aiSummarizeCommits = async (diff: string) => {
  // https://github.com/samarjit-singh/gitgist/commit/<commithash>.diff
  const response = await model.generateContent([
    `
          You are an expert programmer summarizing a git diff. Your task is to analyze the changes and provide a clear and concise summary of the modifications.

          ### Reminders about the git diff format:
          1. Each file's diff starts with metadata, such as:
             - Example: \`diff --git a/src/file.js b/src/file.js\`
               This indicates that the file \`src/file.js\` was modified in this commit.
          2. The metadata may include information like file permissions, file names, or other attributes.
          3. Lines beginning with:
             - \`+\` indicate lines of code added.
             - \`-\` indicate lines of code deleted.
             - Lines starting with neither \`+\` nor \`-\` are context lines for better understanding of the changes.

          ### Example Summary Comments:
          - Increased the API limit from 10 to 100 in \`src/config.js\`.
          - Fixed typos in function comments across multiple files.
          - Moved the database initialization code to a new file (\`src/db/init.js\`).
          - Refactored utility functions for improved reusability (\`src/utils/helpers.js\`).
          - Reduced numeric precision in test calculations.

          **Note**: Avoid copying the examples into your output. They are for guidance only.

          ### Instructions:
          1. Review the provided diff file content.
          2. Summarize the changes made in the commit.
          3. Include specific details such as:
             - What was added, removed, or modified.
             - The purpose of the change, if identifiable (e.g., bug fix, refactoring, feature addition).
          4. Reference file names when the changes are localized to one or two files. If the changes span multiple files, avoid listing all file names.
          5. Use concise, developer-friendly language.

          ### Diff Content:
          ${diff}
          `,
  ]);

  const summary = response?.response?.text();
  if (!summary) {
    console.error("AI summary generation failed for diff:", diff);
    return "";
  }

  return summary;
};
