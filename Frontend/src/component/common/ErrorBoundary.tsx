import { Component, type ErrorInfo, type ReactNode } from 'react';

export default class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unable to render this page', error, info.componentStack);
  }
  render() {
    if (this.state.failed) return (
      <main role="alert" className="mx-auto max-w-xl p-8 text-center">
        <h1 className="text-2xl font-semibold">This page could not load</h1>
        <p className="my-4">Please reload the page or return home to continue.</p>
        <button className="rounded bg-black px-4 py-2 text-white" onClick={() => window.location.reload()}>Reload</button>
        <a className="ml-4 underline" href="/">Return home</a>
      </main>
    );
    return this.props.children;
  }
}
