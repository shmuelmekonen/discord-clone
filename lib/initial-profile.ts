import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "./db";

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirect("/sign-in");
  }
  try {
    const profile = await db.profile.findUnique({
      where: {
        userId: user.id,
      },
    });
    if (profile) return profile;

    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName}${user.lastName ? ` ${user.lastName}` : ""}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    return newProfile;
  } catch (error) {
    console.error("[INITIAL_PROFILE_ERROR]", error);
    throw new Error(
      "Authentication service is temporarily unavailable. Please check your connection.",
    );
  }
};
