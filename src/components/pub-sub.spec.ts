import pubSub from './pub-sub';

describe('PubSub', () => {
  test('should allow subscription to an event', () => {
    const subscriptionCallback = jest.fn();
    pubSub.subscribe('test:subscribeEvent', subscriptionCallback);

    expect(subscriptionCallback).not.toHaveBeenCalled();
  });

  test('should call subscribed callbacks when an event is published', () => {
    const subscriptionCallback = jest.fn();
    pubSub.subscribe('test:subscribeEvent', subscriptionCallback);

    pubSub.publish('test:subscribeEvent', 'Test Event');

    expect(subscriptionCallback).toHaveBeenCalledWith('Test Event');
  });

  test('should not call unsubscribed callbacks when an event is published', () => {
    const subscriptionCallback = jest.fn();
    pubSub.subscribe('test:unsubscribeEvent', subscriptionCallback);
    pubSub.unsubscribe('test:unsubscribeEvent', subscriptionCallback);

    pubSub.publish('test:unsubscribeEvent', 'Test Event');

    expect(subscriptionCallback).not.toHaveBeenCalled();
  });

  test('should handle multiple subscriptions to the same event', () => {
    const subscriptionCallback = jest.fn();
    const anotherSubscriptionCallback = jest.fn();

    pubSub.subscribe('test:subscribeEvent', subscriptionCallback);
    pubSub.subscribe('test:subscribeEvent', anotherSubscriptionCallback);

    pubSub.publish('test:subscribeEvent', 'Test Event');

    expect(subscriptionCallback).toHaveBeenCalledWith('Test Event');
    expect(anotherSubscriptionCallback).toHaveBeenCalledWith('Test Event');
  });

  test('should not affect other events when unsubscribing from one', () => {
    const subscriptionCallback = jest.fn();
    const anotherSubscriptionCallback = jest.fn();

    pubSub.subscribe('test:unsubscribeEvent', subscriptionCallback);
    pubSub.subscribe('test:subscribeEvent', anotherSubscriptionCallback);

    pubSub.unsubscribe('test:unsubscribeEvent', subscriptionCallback);
    pubSub.publish('test:subscribeEvent', 'Test Event');

    expect(subscriptionCallback).not.toHaveBeenCalled();
    expect(anotherSubscriptionCallback).toHaveBeenCalledWith('Test Event');
  });

  test('should not call callbacks for other events', () => {
    const subscriptionCallback = jest.fn();
    pubSub.subscribe('test:subscribeEvent', subscriptionCallback);

    pubSub.publish('test:unsubscribeEvent', 'Test Event');

    expect(subscriptionCallback).not.toHaveBeenCalled();
  });
});
