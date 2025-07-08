class MockImage extends Image {
  constructor() {
    super();

    Object.defineProperty(this, 'complete', {
      get() {
        return this.completeValue;
      },
      set(value: boolean) {
        this.completeValue = value;
      },
      configurable: true,
      enumerable: true
    });

    Object.defineProperty(this, 'src', {
      get() {
        return this.srcValue;
      },
      set(value: string) {
        this.srcValue = value;

        if (value === 'load-image.jpg' || value === 'error-image.jpg') {
          this.complete = false;

          const eventName = value === 'load-image.jpg' ? 'load' : 'error';

          setTimeout(() => {
            this.dispatchEvent(new Event(eventName));
          }, 250);
        } else {
          this.complete = true;
        }
      },
      configurable: true,
      enumerable: true
    });

    (this as unknown as { complete: boolean }).complete = true;
  }
}

vi.stubGlobal('Image', MockImage);
