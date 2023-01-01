const eventList = {};
const listenerQueue = new Map();

const getSymbol = (value: string|number): symbol|number => ((typeof value === 'string') ? Symbol.for(value) : value);
const contextExists = (event: string, context: string): boolean => (eventList[event] && eventList[event].has(context));

const unsubscribeByIdentifier = (event: string, context: string, identifier: string | number): void => {
  const id = getSymbol(identifier);

  if (!listenerQueue.get(id)) return;

  const listeners = eventList[event].get(context);

  if (!listeners.includes(id)) return;

  listenerQueue.delete(id);
  listeners.splice(listeners.indexOf(id), 1);

  if (listeners.length) eventList[event].set(context, listeners);
  else eventList[event].delete(context);

  if (!eventList[event].size) delete eventList[event];
};

const unsubscribeByListener = (event: string, context: string, fn: (...params: any[]) => void): void => {
  listenerQueue.forEach((listener, identifier: string | number) => {
    if (listener === fn) unsubscribeByIdentifier(event, context, identifier);
  });
};

const unsubscribeAllListeners = (event: string, context: string): void => {
  const listeners = eventList[event].get(context);

  for (const listener of listeners) listenerQueue.delete(listener);

  eventList[event].delete(context);

  if (!eventList[event].size) delete eventList[event];
};

export const broadcast = (event: string, context = 'global', data?: any): void => {
  if (!contextExists(event, context)) return;
  const listeners = eventList[event].get(context);

  if (typeof data !== 'undefined')
    for (const listener of listeners) listenerQueue.get(listener).call(null, data);
  else
    for (const listener of listeners) listenerQueue.get(listener)();
};

export const subscribe = (event: string, listener: (...params: any[]) => void, identifier?: string | number, context = 'global', binding = null): number | symbol => {
  const listenerId = identifier ? getSymbol(identifier) : Symbol();

  if (listenerQueue.has(listenerId)) throw new Error('You can\'t override an existing listener identifier. You must unsubscribe it first');
  if (!eventList[event]) eventList[event] = new Map();
  if (!eventList[event].has(context)) eventList[event].set(context, []);

  const listeners = eventList[event].get(context);
  listeners.push(listenerId);
  eventList[event].set(context, listeners);
  listenerQueue.set(listenerId, binding ? listener.bind(binding) : listener);

  return listenerId;
};

export const unsubcribe = (event: string, listener: (...params: any[]) => void, context = 'global'): void => {
  if (!contextExists(event, context)) return;

  if (!listener) unsubscribeAllListeners(event, context);
  else if (typeof listener === 'function') unsubscribeByListener(event, context, listener);
  else unsubscribeByIdentifier(event, context, listener);
};