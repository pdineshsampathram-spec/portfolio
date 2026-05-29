import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('Portfolio error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position:'fixed', inset:0, background:'#04060f',
          display:'flex', alignItems:'center', justifyContent:'center',
          color:'#64C8FF', fontFamily:'monospace', fontSize:'13px',
          flexDirection:'column', gap:'12px', zIndex: 100000
        }}>
          <div>SYSTEM ERROR — REBOOT REQUIRED</div>
          <button onClick={() => window.location.reload()}
            style={{
              background:'transparent', border:'1px solid rgba(100,200,255,0.3)',
              color:'#64C8FF', padding:'8px 20px', cursor:'pointer', fontFamily:'monospace'
            }}>
            REINITIALIZE
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
