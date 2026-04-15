export function Feedback({ error, success }: { error?: string | null; success?: string | null }) {
  return <>{error ? <div className="alert error">{error}</div> : null}{success ? <div className="alert success">{success}</div> : null}</>;
}
