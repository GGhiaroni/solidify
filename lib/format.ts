const formatSmartTime = (totalMinutes: number) => {
  if (totalMinutes === 0) {
    return { value: "0", unit: "min", full: "0 min" };
  }

  if (totalMinutes < 60) {
    return {
      value: totalMinutes.toString(),
      unit: "min",
      full: `${totalMinutes} min`,
    };
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (minutes === 0) {
    return {
      value: hours.toString(),
      unit: hours === 1 ? "hora" : "horas",
      full: `${hours}h`,
    };
  }

  return {
    value: `${hours}h ${minutes.toString().padStart(2, "0")}m`,
    unit: "",
    full: `${hours}h ${minutes}m`,
  };
};
