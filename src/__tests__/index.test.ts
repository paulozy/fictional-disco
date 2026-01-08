import { add, greet } from '../index';

describe('greet', () => {
  it('should return a greeting message', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  it('should greet different names', () => {
    expect(greet('TypeScript')).toBe('Hello, TypeScript!');
  });
});

describe('add', () => {
  it('should add two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(add(-5, 3)).toBe(-2);
  });
});
