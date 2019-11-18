import React from "react";
import { useMutation } from "@apollo/react-hooks";
import useForm from "react-hook-form";
import { Entry } from "../types";
import { UPDATE_ENTRY } from "../util";

type Props = {
  entry: Entry;
  handleHrFormToggle: () => void;
};

type UpdateEntryHrInfoFormValues = {
  maxHr: number;
  avgHr: number;
};

const UpdateEntryHrInfo: React.FC<Props> = ({ entry, handleHrFormToggle }) => {
  const [updateEntryHrInfoMutation] = useMutation(UPDATE_ENTRY);

  // console.warn({ entry });
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = async (values: any) => {
    // console.warn({ values });

    const payload = {
      id: `${entry.id}`,
      userId: entry.user.id,
      distance: entry.distance,
      strokeRate: entry.strokeRate,
      time: entry.time,
      completedAt: entry.completedAt,
      userWeight: entry.userWeight,
      userHeight: entry.userHeight,
      maxHr: Number(values.maxHr),
      avgHr: Number(values.avgHr),
    };

    // console.warn({ payload });

    try {
      const result = await updateEntryHrInfoMutation({
        variables: payload,
      });
      handleHrFormToggle();
      console.warn({ result });
    } catch (err) {
      console.warn({ err });
    }
  };

  // console.warn({ errors });

  return (
    <div className={"max-w-md mx-auto p-2"}>
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-2 py-2 pt-2"
        >
          <div className="pb-4 flex">
            <div className="pr-2">
              <label htmlFor="maxHr" className="text-sm block font-bold pb-2">
                Max HR
              </label>
              <input
                name="maxHr"
                defaultValue={`${entry.maxHr || ""}`}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "Numbers only PLS",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Max HR"
              />
              {errors.maxHr && errors.maxHr.message}
            </div>
            <div className="pr-2">
              <label htmlFor="avgHr" className="text-sm block font-bold pb-2">
                Avg HR
              </label>
              <input
                name="avgHr"
                defaultValue={`${entry.avgHr || ""}`}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "Numbers only PLS",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Avg HR"
              />
              {errors.avgHr && errors.avgHr.message}
            </div>
          </div>
          <div>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateEntryHrInfo;
