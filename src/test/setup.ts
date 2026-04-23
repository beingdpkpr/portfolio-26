import '@testing-library/jest-dom'

if (!Element.prototype.scrollTo) {
  Element.prototype.scrollTo = () => {}
}

global.IntersectionObserver = class IntersectionObserver {
  constructor(_cb: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
} as unknown as typeof IntersectionObserver
