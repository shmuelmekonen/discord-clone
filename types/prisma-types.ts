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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const messageWithMemberWithProfile =
  Prisma.validator<Prisma.MessageDefaultArgs>()({
    include: {
      member: {
        include: {
          profile: true,
        },
      },
    },
  });

export type MessageWithMemberWithProfile = Prisma.MessageGetPayload<
  typeof messageWithMemberWithProfile
>;
