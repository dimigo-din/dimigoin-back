interface CreateOperationProps {
  name: string;
  description: string;
  only?: "student" | "teacher";
}
type CreateOperation = ({ name, description, only }: CreateOperationProps) => {
  summary: string;
  description: string;
};
export const createOpertation: CreateOperation = ({
  name,
  description,
  only,
}) => {
  return {
    summary: name,
    description: [
      `<h2>설명</h2><p>${description}</p>`,
      only
        ? `<h2>제한</h2><p>${
            {
              student: "학생",
              teacher: "선생님",
            }[only]
          }</p>`
        : null,
    ]
      .filter((v) => v)
      .join("<br>"),
  };
};
