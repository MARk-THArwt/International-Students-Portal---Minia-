import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { type ReactNode } from "react";

export const InputWithIcons = ({
  data,
  value,
  readOnly,
}: {
  data: {
    name: string;
    type: string;
    placeholder?: string;
    iconStart?: ReactNode;
    iconEnd?: ReactNode;
  };
  value?: string;
  readOnly?: boolean;
}) => {
  return (
    <Field className="w-full">
      <FieldLabel className="text-original-text">{data.name}</FieldLabel>

      <InputGroup>
        {data.iconStart && (
          <InputGroupAddon align="inline-start">
            {data.iconStart}
          </InputGroupAddon>
        )}

        <InputGroupInput
          type={data.type}
          placeholder={data.placeholder || data.name}
          value={value}
          readOnly={readOnly}
          className={readOnly ? "cursor-default focus:ring-0" : ""}
        />

        {data.iconEnd && (
          <InputGroupAddon align="inline-end">{data.iconEnd}</InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  );
};
