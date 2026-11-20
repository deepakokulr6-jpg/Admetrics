import { useCallback, useRef } from 'react';
import type { TextInput, TextInputProps } from 'react-native';

type InputInstance = React.ComponentRef<typeof TextInput>;

/**
 * Keyboard "Next" through a form's fields in order: each field shows Next
 * and focuses the following one (keyboard stays up); the last shows Done
 * and runs `onDone` (e.g. submit). Spread the result onto an InputField.
 */
export const useFieldChain = <K extends string>(
  order: readonly K[],
  onDone?: () => void,
) => {
  const refs = useRef<Partial<Record<K, InputInstance | null>>>({});
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  return useCallback(
    (key: K) => {
      const next = order[order.indexOf(key) + 1];
      return {
        inputRef: (input: InputInstance | null) => {
          refs.current[key] = input;
        },
        returnKeyType: (next
          ? 'next'
          : 'done') as TextInputProps['returnKeyType'],
        submitBehavior: (next
          ? 'submit'
          : 'blurAndSubmit') as TextInputProps['submitBehavior'],
        onSubmitEditing: () => {
          if (next) {
            refs.current[next]?.focus();
          } else {
            onDoneRef.current?.();
          }
        },
      };
    },
    // `order` is a constant list per screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
};
