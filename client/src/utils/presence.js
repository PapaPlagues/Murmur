export const isUserOnline = (lastSeenAt) => {
    if (!lastSeenAt) return false;

    // 60 seconds
    const chosenSeconds = 60_000;

    const lastSeen = new Date(lastSeenAt).getTime();
    const now = Date.now();

    return now - lastSeen < chosenSeconds;
}