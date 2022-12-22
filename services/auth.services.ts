import { PrismaClient, RefreshToken } from "@prisma/client";
import { hashToken } from "../utils/hashToken";

const prisma = new PrismaClient();

interface ICreateRefreshTokenArgs {
  jti: string;
  refreshToken: string;
  userId: number;
}

// Used when creating a new token
export const addRefreshTokenToWhitelist = ({
  jti,
  refreshToken,
  userId,
}: ICreateRefreshTokenArgs) => {
  return prisma.refreshToken.create({
    data: {
      id: jti,
      hashedToken: hashToken(refreshToken),
      userId,
    },
  });
};
