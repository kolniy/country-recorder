import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import Modal from "./Modal";
import { useAlert } from "react-alert";
import { PencilIcon, TrashIcon, XIcon } from "@heroicons/react/outline";
import { getLocationsQuery } from "./Locations";

const DELETE_LOCATION_MUTATION = gql`
  mutation ($idOfLocation: ID!) {
    deleteLocation(idOfLocation: $idOfLocation) {
      id
      year
      country
      total_population
      area
    }
  }
`;

const UPDATE_LOCATION_MUTATION = gql`
  mutation ($idOfLocation: ID!, $locationUpdateData: updateLocationInput!) {
    updateLocation(idOfLocation: $idOfLocation, data: $locationUpdateData) {
      id
      year
      country
      total_population
      area
    }
  }
`;

const LocationItem = ({ location }) => {
  const alert = useAlert();
  const [createLocationDetails, setCreateLocationDetails] = useState({
    country: "",
    year: "",
    area: "",
    total_population: "",
  });
  const [deleteLocationConfirmation, setDeleteLocationConfirmation] =
    useState(false);

  const [updateLocationConfirmation, setUpdateLocationConfirmation] =
    useState(false);

  const handleEditClick = () => {
    setUpdateLocationConfirmation(true);
  };

  const handleDeleteClick = () => {
    setDeleteLocationConfirmation(true);
  };

  const [deleteLocation, { loading }] = useMutation(DELETE_LOCATION_MUTATION, {
    variables: {
      idOfLocation: location.id,
    },
    onError: (error) => {
      alert.show(error.message, {
        type: "error",
      });
    },
    onCompleted: () => {
      alert.show("Record Deleted", {
        type: "success",
      });
      setDeleteLocationConfirmation(false);
    },
    update(cache, { data: { deleteLocation } }) {
      const { getLocations } = cache.readQuery({
        query: getLocationsQuery,
      });

      cache.writeQuery({
        query: getLocationsQuery,
        data: {
          getLocations: getLocations.filter(
            (locationItem) => locationItem.id !== deleteLocation.id
          ),
        },
      });
    },
  });

  const [updateLocation, { loading: updateLoading }] = useMutation(
    UPDATE_LOCATION_MUTATION,
    {
      variables: {
        idOfLocation: location.id,
        locationUpdateData: {
          country: createLocationDetails.country,
          year: createLocationDetails.year,
          area: parseInt(createLocationDetails.area),
          population: parseInt(createLocationDetails.total_population),
        },
      },
      onError: (error) => {
        alert.show(error.message, {
          type: "error",
        });
        console.log(JSON.stringify(error));
      },
      onCompleted: () => {
        alert.show("Record updated Successfully", {
          type: "success",
        });
        setUpdateLocationConfirmation(false);
      },
      update(cache, { data: updateLocation }) {
        const { getLocations } = cache.readQuery({
          query: getLocationsQuery,
        });

        cache.writeQuery({
          query: getLocationsQuery,
          data: {
            getLocations: getLocations.map((location) =>
              location.id === updateLocation.id
                ? { ...location, updateLocation }
                : location
            ),
          },
        });
      },
    }
  );

  const updateFormInputs = (e) =>
    setCreateLocationDetails({
      ...createLocationDetails,
      [e.target.name]: e.target.value,
    });

  const { country, year, area, total_population } = createLocationDetails;

  useEffect(() => {
    if (location) {
      setCreateLocationDetails({
        ...createLocationDetails,
        country: location.country,
        year: location.year,
        area: location.area,
        total_population: location.total_population,
      });
    }
  }, []);

  return (
    <>
      <div className="w-full py-5 px-7 bg-white my-4 rounded-md shadow-sm">
        <div
          id="location-data__cta"
          className="flex justify-between items-center pb-4 border-b-2"
        >
          <h1 className="font-semibold text-xl">{location.country}</h1>
          <div className="flex items-center space-x-4">
            <PencilIcon
              onClick={handleEditClick}
              className="h-5 cursor-pointer"
            />
            <TrashIcon
              onClick={handleDeleteClick}
              className="h-5 cursor-pointer"
            />
          </div>
        </div>
        <div className="mt-2 flex items-end justify-between">
          <div>
            <p className="font-semibold text-lg text-md text-blue-600">
              Year ({location.year})
            </p>
            <p className="text-sm text-[#a0a4ae] mt-3">
              Population - {location.total_population}
            </p>
          </div>
          <p className="text-sm text-[#a0a4ae] mt-3">
            Area - {location.area} k&#13217;
          </p>
        </div>
      </div>
      <Modal isOpen={deleteLocationConfirmation}>
        <div className="w-1/3 h-auto min-w-[380px] bg-gray-100 rounded-sm">
          {/* modal header  */}
          <div className="modal-header pt-5 pb-3 px-7 flex items-center border-b-2 justify-between">
            <h3 className="font-semibold text-xl">Delete Confrimation</h3>
            <XIcon
              onClick={() => setDeleteLocationConfirmation(false)}
              className="h-5 w-5 cursor-pointer font-bold"
            />
          </div>
          {/* modal body  */}
          <div className="w-full px-6 py-20">
            <p className="text-center">
              Are your sure you want to delete this record ?
            </p>
          </div>

          {/* modal footer  */}
          <div className="flex flex-row items-center justify-end px-5 space-x-5 py-5 border-t-2">
            <button
              onClick={() => setDeleteLocationConfirmation(false)}
              className="py-3 w-full px-7 text-sm cursor-pointer text-[#f25f3a] border-2 border-[#f25f3a] bg-white rounded-md"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={deleteLocation}
              className="py-3 w-full px-7 text-sm cursor-pointer text-white bg-[#F25F3A] rounded-md"
            >
              {loading ? "Deleting..." : "Delete Record"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={updateLocationConfirmation}>
        <div className="w-1/3 h-auto min-w-[380px] bg-gray-100 rounded-sm">
          {/* modal header  */}
          <div className="modal-header pt-5 pb-3 px-7 flex items-center border-b-2 justify-between">
            <h3 className="font-semibold text-xl">Update Record.</h3>
            <XIcon
              onClick={() => setUpdateLocationConfirmation(false)}
              className="h-5 w-5 cursor-pointer font-bold"
            />
          </div>
          {/* modal body  */}
          <div className="w-full px-7 py-11">
            <div className="input-container flex flex-col space-y-2 mb-3">
              <label className="text-md ml-3 font-semibold text-slate-500">
                Country
              </label>
              <input
                placeholder="Country"
                type="text"
                name="country"
                value={country}
                onChange={(e) => updateFormInputs(e)}
                className="outline-none rounded-md px-6 py-3 text-xs text-slate-400"
              />
            </div>
            <div className="input-container flex flex-col space-y-2 mb-3">
              <label className="text-md ml-3 font-semibold text-slate-500">
                Year
              </label>
              <input
                placeholder="Year"
                type="string"
                name="year"
                value={year}
                onChange={(e) => updateFormInputs(e)}
                className="outline-none rounded-md px-6 py-3 text-xs text-slate-400"
              />
            </div>
            <div className="input-container flex flex-col space-y-2 mb-3">
              <label className="text-md ml-3 font-semibold text-slate-500">
                Population
              </label>
              <input
                placeholder="Population"
                type="number"
                name="total_population"
                value={total_population}
                onChange={(e) => updateFormInputs(e)}
                className="outline-none rounded-md font-semibold px-6 py-3 text-xs text-slate-400"
              />
            </div>
            <div className="input-container flex flex-col space-y-2 mb-3">
              <label className="text-md ml-3 font-semibold text-slate-500">
                Area
              </label>
              <input
                type="number"
                placeholder="Area"
                name="area"
                value={area}
                onChange={(e) => updateFormInputs(e)}
                className="outline-none rounded-md px-6 py-3 text-xs text-slate-400"
              />
            </div>
          </div>

          {/* modal footer  */}
          <div className="flex flex-row items-center justify-end px-5 space-x-5 py-5 border-t-2">
            <button
              onClick={() => setUpdateLocationConfirmation(false)}
              className="py-3 w-full px-7 text-sm cursor-pointer text-[#f25f3a] border-2 border-[#f25f3a] bg-white rounded-md"
            >
              Cancel
            </button>
            <button
              disabled={updateLoading}
              onClick={updateLocation}
              className="py-3 w-full px-7 text-sm cursor-pointer text-white bg-[#F25F3A] rounded-md"
            >
              {updateLoading ? "Updating" : "Update Record"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LocationItem;
