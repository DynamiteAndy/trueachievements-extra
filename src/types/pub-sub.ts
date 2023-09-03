export type PubTypeFn<E> = <Key extends string & keyof E>(event: Key, message?: E[Key]) => void;

export type SubTypeFn<E> = <Key extends string & keyof E>(
  event: Key,
  fn: (message: E[Key]) => void
) => (message: E[Key]) => void;

export type UnsubTypeFn<E> = <Key extends string & keyof E>(event: Key, fn: (message: E[Key]) => void) => void;

export type PubSubType<E> = {
  publish: PubTypeFn<E>;
  subscribe: SubTypeFn<E>;
  unsubscribe: UnsubTypeFn<E>;
};
