export interface DiscordRole {
  id: string;
  name: string;
}

/**
 * Fetch a member's roles from Discord and map them to their names.
 *
 * @param discordUserId Discord user ID to look up.
 * @param botToken Bot token used for authentication.
 * @param guildId Discord guild (server) ID.
 * @returns Array of mapped roles and membership flag.
 * @throws Error when the Discord API returns a non-404 error for the member fetch.
 */
export async function fetchDiscordRoles(
  discordUserId: string,
  botToken: string,
  guildId: string
): Promise<{ roles: DiscordRole[]; isMember: boolean }> {
  const memberRes = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
    {
      headers: { Authorization: `Bot ${botToken}` },
      cache: 'no-store',
    }
  );

  if (memberRes.status === 404) {
    return { roles: [], isMember: false };
  }

  if (!memberRes.ok) {
    const text = await memberRes.text().catch(() => '');
    throw new Error(text || `Discord API error: ${memberRes.status}`);
  }

  const member = await memberRes.json();
  const roleIds: string[] = member.roles || [];

  const rolesRes = await fetch(
    `https://discord.com/api/v10/guilds/${guildId}/roles`,
    {
      headers: { Authorization: `Bot ${botToken}` },
      cache: 'no-store',
    }
  );

  if (!rolesRes.ok) {
    // Unable to map names, but the user is a guild member.
    return { roles: [], isMember: true };
  }

  const guildRoles: Array<{ id: string; name: string } & Record<string, unknown>> =
    await rolesRes.json();
  const idToName = new Map(guildRoles.map((r) => [r.id, r.name] as const));
  const roles = roleIds
    .map((id) => ({ id, name: idToName.get(id) || id }))
    .filter((r) => r.name !== '@everyone');

  return { roles, isMember: true };
}
