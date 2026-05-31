import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

export function isStrongPassword(value: string): boolean {
  return (
    value.length >= 8 &&
    /[a-z]/.test(value) &&
    /[A-Z]/.test(value) &&
    /\d/.test(value) &&
    /[^a-zA-Z0-9]/.test(value)
  );
}

type Mapper<TStore, TComp> = {
  getValueProps: (v: TStore) => { value: TComp };
  normalize: (v: TComp) => TStore;
};

export function applyMapper<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
  TStore,
  TComp,
>(field: ControllerRenderProps<TFieldValues, TName>, mapper: Mapper<TStore, TComp>) {
  return {
    ...field,
    ...mapper.getValueProps(field.value as TStore),
    onChange: (v: TComp) => field.onChange(mapper.normalize(v)),
  };
}
