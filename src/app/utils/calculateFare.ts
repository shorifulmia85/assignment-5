export const getFare = (payload: { duration: number; distance: number }) => {
  const baseFare = 50;
  const perkmFare = 20;
  const perMinFare = 2;

  const journeyMin = payload.duration / 60;

  const total =
    baseFare + payload?.distance * perkmFare + journeyMin * perMinFare;

  return Number(total.toFixed(2));
};
