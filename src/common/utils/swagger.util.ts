interface CreateOperationProps {
  name: string;
  description: string;
  studentOnly?: boolean;
}
type CreateOperation = ({
  name,
  description,
  studentOnly,
}: CreateOperationProps) => {
  summary: string;
  description: string;
};
export const createOpertation: CreateOperation = ({
  name,
  description,
  studentOnly,
}) => {
  return {
    summary: name,
    description: [
      `<h2>설명</h2><p>${description}</p>`,
      studentOnly && "<h2>학생 전용</h2>",
    ]
      .filter((v) => v)
      .join("<br>"),
  };
};
