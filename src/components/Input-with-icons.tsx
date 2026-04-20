import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { type ReactNode } from "react";

export const InputWithIcons = ({
  data,
}: {
  data: {
    name: string;
    type: string;
    placeholder?: string;
    iconStart?: ReactNode;
    iconEnd?: ReactNode;
  };
}) => {
  return (
    <Field className="w-full">
      <FieldLabel className="text-gray-700">{data.name}</FieldLabel>

      <InputGroup>
        {data.iconStart && (
          <InputGroupAddon align="inline-start">
            {data.iconStart}
          </InputGroupAddon>
        )}

        <InputGroupInput
          type={data.type}
          placeholder={data.placeholder || data.name}
        />

        {data.iconEnd && (
          <InputGroupAddon align="inline-end">{data.iconEnd}</InputGroupAddon>
        )}
      </InputGroup>
    </Field>
  );
};
