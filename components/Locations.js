import { useQuery, gql } from "@apollo/client";
import LocationItem from "./LocationItem";

export const getLocationsQuery = gql`
  query {
    getLocations {
      id
      year
      country
      total_population
    }
  }
`;

const Locations = () => {
  const { data, loading, error } = useQuery(getLocationsQuery);

  if (loading) {
    return <h2 className="text-center font-medium text-lg">Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const locations = data.getLocations;

  return locations.map((location) => (
    <LocationItem location={location} key={location.id} />
  ));
};

export default Locations;
