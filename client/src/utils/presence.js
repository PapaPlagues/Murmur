export const isUserOnline = (lastSeenAt) => {
    if (!lastSeenAt) return false;

    // 3 minutes
    const chosenSeconds = 2 * 60_000;

    const lastSeen = new Date(lastSeenAt).getTime();
    const now = Date.now();

    return now - lastSeen < chosenSeconds;
}