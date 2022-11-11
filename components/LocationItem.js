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

const LocationItem = ({ location }) => {
  const alert = useAlert();
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

  return (
    <>
      <div className="w-full py-5 px-7 bg-white my-4 rounded-md shadow-sm">
        <div
          id="location-data__cta"
          className="flex justify-between items-center pb-3 border-b-2"
        >
          <h1>{location.country}</h1>
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
              onClick={deleteLocation}
              className="py-3 w-full px-7 text-sm cursor-pointer text-white bg-[#F25F3A] rounded-md"
            >
              Update Record
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default LocationItem;
