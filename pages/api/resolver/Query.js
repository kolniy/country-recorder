const getLocations = async (parent, args, { prisma }, info) => {
  try {
    const locations = await prisma.location.findMany();
    return locations;
  } catch (error) {
    throw error;
  }
};

export { getLocations };
