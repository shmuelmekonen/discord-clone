import { Prisma } from "@prisma/client";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const serverWithMembersAndProfiles =
  Prisma.validator<Prisma.ServerDefaultArgs>()({
    include: {
      members: {
        include: {
          profile: true,
        },
      },
    },
  });

export type ServerWithMembersWithProfiles = Prisma.ServerGetPayload<
  typeof serverWithMembersAndProfiles
>;
