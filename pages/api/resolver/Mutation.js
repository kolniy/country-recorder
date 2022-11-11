const createNewLocation = async (parent, args, { prisma }, info) => {
  try {
    const { country, year, area, population } = args.data;
    const newLocationData = await prisma.location.create({
      data: {
        country,
        year,
        area,
        total_population: population,
      },
    });
    return newLocationData;
  } catch (error) {
    throw error;
  }
};

const updateLocation = async (parent, args, { prisma }, info) => {
  const {
    idOfLocation,
    data: { country, year, area, population },
  } = args;
  try {
    const updatedLocation = await prisma.location.update({
      where: {
        id: idOfLocation,
      },
      data: {
        country,
        year,
        area,
        total_population: population,
      },
    });
    return updatedLocation;
  } catch (error) {
    throw error;
  }
};

const deleteLocation = async (parent, args, { prisma }, info) => {
  const { idOfLocation } = args;
  try {
    const deletedLocation = await prisma.location.delete({
      where: {
        id: idOfLocation,
      },
    });
    return deletedLocation;
  } catch (error) {
    throw error;
  }
};

export { createNewLocation, updateLocation, deleteLocation };
