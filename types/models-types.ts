import { Prisma } from "@prisma/client";

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

// import { Server, Member, Profile } from "@prisma/client";

// export type ServerWithMembersWithProfiles = Server & {
//   members: (Member & { profile: Profile })[];
// };
