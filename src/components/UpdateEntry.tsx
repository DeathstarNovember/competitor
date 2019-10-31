import React from "react";
import { useMutation } from "@apollo/react-hooks";
import useForm from "react-hook-form";
import { Entry } from "../types";
import { parse, format, set, parseISO } from "date-fns";
import { UPDATE_ENTRY } from "../util";

type Props = {
  entry: Entry;
  handleFormToggle: () => void;
};

const UpdateEntry: React.FC<Props> = ({ entry, handleFormToggle }) => {
  const [updateEntryMutation] = useMutation(UPDATE_ENTRY);

  console.warn({ entry });
  const { handleSubmit, register, errors } = useForm();

  const onSubmit = async (values: any) => {
    console.warn({ values });
    const time =
      Number(values.duration_h) * 60 * 60 +
      Number(values.duration_m) * 60 +
      Number(values.duration_s);

    const completedDate = parse(
      values.completed_date,
      "MM/dd/yyyy",
      new Date()
    );
    const completedTime = parse(values.completed_time, "HH:mm", new Date());

    const completedAt = format(
      set(completedDate, {
        hours: completedTime.getHours(),
        minutes: completedTime.getMinutes(),
      }),
      "yyyy-MM-dd HH:mm:ss"
    );

    const userWeight = Number(values.userWeight);
    const userHeight = Number(values.userHeight);

    const payload = {
      id: `${entry.id}`,
      userId: Number(entry.user.id),
      distance: Number(values.distance),
      strokeRate: Number(values.strokeRate),
      time,
      completedAt,
      userWeight,
      userHeight,
      maxHr: Number(values.maxHr),
      avgHr: Number(values.avgHr),
    };

    console.warn({ payload });

    try {
      const result = await updateEntryMutation({
        variables: payload,
      });
      handleFormToggle();
      console.warn({ result });
    } catch (err) {
      console.warn({ err });
    }
  };

  // console.warn({ errors });

  return (
    <div className={"max-w-md mx-auto p-6"}>
      <div className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded px-8 py-8 pt-8"
        >
          <div className="pb-4 flex">
            <div className="pr-2">
              <label
                htmlFor="userWeight"
                className="text-sm block font-bold pb-2"
              >
                Weight(kg)
              </label>
              <input
                name="userWeight"
                defaultValue={`${entry.userWeight}`}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+[.][0-9]$/i,
                    message: "ex 0.0",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Weight in Kilograms"
              />
              {errors.userWeight && errors.userWeight.message}
            </div>
            <div className="pr-2">
              <label
                htmlFor="userHeight"
                className="text-sm block font-bold pb-2"
              >
                Height(cm)
              </label>
              <input
                name="userHeight"
                defaultValue={`${entry.userHeight}`}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "ex 185",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Height in cm"
              />
              {errors.userHeight && errors.userHeight.message}
            </div>
          </div>
          <div className="pb-4 flex">
            <div className="pr-2">
              <label
                htmlFor="distance"
                className="text-sm block font-bold pb-2"
              >
                Distance
              </label>
              <input
                name="distance"
                defaultValue={`${entry.distance}`}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "Numbers only PLS",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Distance in Meters"
              />
              {errors.distance && errors.distance.message}
            </div>
            <div className="">
              <label
                htmlFor="strokeRate"
                className="text-sm block font-bold pb-2"
              >
                Stroke Rate
              </label>
              <input
                name="strokeRate"
                defaultValue={`${entry.strokeRate}`}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "Numbers only PLS",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="(Like 26)"
              />
            </div>
          </div>
          <div className="pb-4 flex">
            <div className="pr-2">
              <label htmlFor="maxHr" className="text-sm block font-bold pb-2">
                Max HR
              </label>
              <input
                name="maxHr"
                defaultValue={`${entry.maxHr}`}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "ex 165",
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
                defaultValue={`${entry.avgHr}`}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^[1-9][0-9]+$/i,
                    message: "ex 160",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300 "
                placeholder="Avg HR"
              />
              {errors.avgHr && errors.avgHr.message}
            </div>
          </div>
          <div className="pb-4">
            <div>
              <label
                htmlFor="duration"
                className="text-sm block font-bold pb-2"
              >
                Duration
              </label>
            </div>
            <div className="flex">
              <input
                name="duration_h"
                defaultValue={(entry.time / 60 / 60).toFixed(0)}
                ref={register({})}
                className="shadow appearance-none border rounded w-full mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                placeholder="0 Hours"
              />
              <input
                name="duration_m"
                defaultValue={(entry.time / 60).toFixed(0)}
                ref={register({})}
                className="shadow appearance-none border rounded w-full mr-2 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                placeholder="Minutes"
              />
              <input
                name="duration_s"
                defaultValue={(entry.time % 60).toFixed(0)}
                ref={register({})}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                placeholder="Seconds"
              />
            </div>
          </div>
          <div className="pb-4 flex">
            <div className="pr-2">
              <label
                htmlFor="completed_date"
                className="text-sm block font-bold pb-2"
              >
                Date
              </label>
              <input
                name="completed_date"
                defaultValue={format(parseISO(entry.completedAt), "MM/dd/yyyy")}
                ref={register({
                  required: "Required",
                  pattern: {
                    value: /^(0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])[- /.](19|20)\d\d$/i,
                    message: "MM/DD/YYYY PLS",
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                placeholder="MM/DD/YYYY"
              />
            </div>
            <div>
              <label
                htmlFor="completed_time"
                className="text-sm block font-bold pb-2"
              >
                Time
              </label>
              <input
                name="completed_time"
                ref={register({})}
                defaultValue={format(parseISO(entry.completedAt), "HH:mm")}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-blue-300"
                placeholder="HH:MM"
              />
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

export default UpdateEntry;
