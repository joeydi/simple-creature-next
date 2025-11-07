import { Textarea } from "@/components/ui/textarea"
import { Project } from "./types"

interface Props {
  project: Project
}

export function ProjectContentBuilder({ project }: Props) {
  return (
    <Textarea
      id="content"
      name="content"
      defaultValue={project.content ? JSON.stringify(project.content, null, 2) : ""}
      placeholder='{"sections": [], "images": []}'
      rows={8}
    />
  )
}
