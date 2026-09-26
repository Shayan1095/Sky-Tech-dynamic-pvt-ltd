/* Nothing, unless a drawer route has been intercepted. Next.js renders this
   slot on every other address, so it has to resolve to nothing rather than
   being absent. */
export default function NoDrawer() {
  return null;
}
