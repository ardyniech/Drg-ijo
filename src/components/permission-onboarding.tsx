import { GpsCard } from "./onboarding/gps-card";
import { PushOnboardingCard } from "./onboarding/push-card";

interface PermissionOnboardingProps {
  userId?: string;
}

export function PermissionOnboarding({ userId }: PermissionOnboardingProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <GpsCard userId={userId} />
      <PushOnboardingCard userId={userId} />
    </div>
  );
}
