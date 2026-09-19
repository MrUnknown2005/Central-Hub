/** A quiet, centered placeholder shown while a route waits on the auth session
 *  to resolve. Deliberately minimal — near-monochrome, no spinner chrome. */
export function RouteLoading() {
  return (
    <div className="grid min-h-[40vh] place-items-center">
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  )
}
