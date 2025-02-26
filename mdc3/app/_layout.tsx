import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import "@/global.css";
import { SessionProvider } from "@/provider/ctx";
import { Slot } from "expo-router";

export default function Root() {
  // Set up the auth context and render our layout inside of it.
  return (
    <GluestackUIProvider mode="light">
      <SessionProvider>
          <Slot />
      </SessionProvider>
    </GluestackUIProvider>
  );
}
